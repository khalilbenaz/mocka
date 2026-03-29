import { NextRequest, NextResponse } from "next/server";
import { getProject, logRequest, countRecentRequests } from "@/lib/store";
import type { MockEndpoint, ResponseCondition } from "@/lib/types";

export const dynamic = "force-dynamic";

function extractParams(pattern: string, actual: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const actualParts = actual.split("/").filter(Boolean);
  if (patternParts.length !== actualParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = actualParts[i];
    } else if (patternParts[i] !== actualParts[i]) {
      return null;
    }
  }
  return params;
}

function applyTemplating(body: string, params: Record<string, string>): string {
  return body.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (match, key: string) => {
    const paramKey = key.startsWith("params.") ? key.slice(7) : key;
    if (params[paramKey] !== undefined) return params[paramKey];
    if (key === "timestamp") return new Date().toISOString();
    if (key === "randomId") return Math.random().toString(36).substring(2, 10);
    if (key === "randomInt") return String(Math.floor(Math.random() * 10000));
    if (key === "now") return String(Date.now());
    return match;
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };
}

// ─── Nested value helper ─────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current !== undefined && current !== null ? String(current) : undefined;
}

// ─── Conditional response ────────────────────────────────────────────────────

function evaluateCondition(condition: ResponseCondition, request: NextRequest, bodyJson: Record<string, unknown> | null): boolean {
  let value: string | undefined;
  if (condition.source === "query") value = request.nextUrl.searchParams.get(condition.field) ?? undefined;
  else if (condition.source === "header") value = request.headers.get(condition.field) ?? undefined;
  else if (condition.source === "body" && bodyJson) value = getNestedValue(bodyJson, condition.field);

  switch (condition.operator) {
    case "exists": return value !== undefined;
    case "equals": return value === condition.value;
    case "contains": return value !== undefined && condition.value !== undefined && value.includes(condition.value);
    case "regex": try { return value !== undefined && condition.value !== undefined && new RegExp(condition.value).test(value); } catch { return false; }
    default: return false;
  }
}

function resolveResponse(endpoint: MockEndpoint, request: NextRequest, bodyJson: Record<string, unknown> | null) {
  if (endpoint.variants && endpoint.variants.length > 0) {
    for (const variant of endpoint.variants) {
      if (evaluateCondition(variant.condition, request, bodyJson)) {
        return { statusCode: variant.statusCode, responseBody: variant.responseBody, contentType: variant.contentType, headers: variant.headers };
      }
    }
  }
  return { statusCode: endpoint.statusCode, responseBody: endpoint.responseBody, contentType: endpoint.contentType, headers: endpoint.headers };
}

// ─── JSON Schema validation (basic) ──────────────────────────────────────────

function validateJsonSchema(body: Record<string, unknown> | null, schemaStr: string): string[] | null {
  try {
    const schema = JSON.parse(schemaStr) as { required?: string[]; properties?: Record<string, { type?: string }> };
    const errors: string[] = [];
    if (schema.required) {
      for (const field of schema.required) {
        if (!body || body[field] === undefined) errors.push(`Missing required field: ${field}`);
      }
    }
    if (schema.properties && body) {
      for (const [key, def] of Object.entries(schema.properties)) {
        if (body[key] !== undefined && def.type) {
          const actual = typeof body[key];
          if (def.type === "integer" && (actual !== "number" || !Number.isInteger(body[key]))) errors.push(`${key} must be integer`);
          else if (def.type === "number" && actual !== "number") errors.push(`${key} must be number`);
          else if (def.type === "string" && actual !== "string") errors.push(`${key} must be string`);
          else if (def.type === "boolean" && actual !== "boolean") errors.push(`${key} must be boolean`);
        }
      }
    }
    return errors.length > 0 ? errors : null;
  } catch {
    return null;
  }
}

// ─── Webhook ─────────────────────────────────────────────────────────────────

function fireWebhook(endpoint: MockEndpoint, params: Record<string, string>) {
  const wh = endpoint.webhook;
  if (!wh) return;
  const exec = async () => {
    if (wh.delayMs > 0) await new Promise((r) => setTimeout(r, wh.delayMs));
    const body = wh.body ? applyTemplating(wh.body, params) : undefined;
    await fetch(wh.url, { method: wh.method, headers: { "Content-Type": "application/json", ...wh.headers }, body }).catch(() => {});
  };
  exec().catch(() => {});
}

// ─── Main handler ────────────────────────────────────────────────────────────

type RouteParams = { params: Promise<{ userSlug: string; slug: string; path: string[] }> };

async function handleMockRequest(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const { userSlug, slug, path } = await params;
  const project = await getProject(userSlug, slug);

  if (!project) {
    return NextResponse.json({ error: "Mock project not found", userSlug, slug }, { status: 404, headers: corsHeaders() });
  }

  const requestPath = "/" + path.join("/");
  const method = request.method;

  let matchedParams: Record<string, string> | null = null;
  const endpoint = project.endpoints.find((ep) => {
    if (ep.method !== method) return false;
    const p = extractParams(ep.path, requestPath);
    if (p) { matchedParams = p; return true; }
    return false;
  });

  if (!endpoint) {
    return NextResponse.json(
      { error: "No matching endpoint", method, path: requestPath, available: project.endpoints.map((ep) => `${ep.method} ${ep.path}`) },
      { status: 404, headers: corsHeaders() }
    );
  }

  // ─── Rate limiting ─────────────────────────────────────────────────
  if (endpoint.rateLimit) {
    const count = await countRecentRequests(userSlug, slug, method, requestPath, endpoint.rateLimit.windowSeconds);
    if (count >= endpoint.rateLimit.maxRequests) {
      const responseTimeMs = Date.now() - startTime;
      logRequest(userSlug, slug, method, requestPath, 429, responseTimeMs).catch(() => {});
      return NextResponse.json(
        { error: "Rate limit exceeded", limit: endpoint.rateLimit.maxRequests, windowSeconds: endpoint.rateLimit.windowSeconds },
        { status: 429, headers: { ...corsHeaders(), "Retry-After": String(endpoint.rateLimit.windowSeconds) } }
      );
    }
  }

  // ─── Random failure injection ──────────────────────────────────────
  if (endpoint.failureRate && Math.random() * 100 < endpoint.failureRate) {
    const responseTimeMs = Date.now() - startTime;
    logRequest(userSlug, slug, method, requestPath, 500, responseTimeMs).catch(() => {});
    return NextResponse.json(
      { error: "Random failure (simulated)", failureRate: `${endpoint.failureRate}%` },
      { status: 500, headers: corsHeaders() }
    );
  }

  // ─── Parse body for conditions + validation ────────────────────────
  let bodyJson: Record<string, unknown> | null = null;
  if ((endpoint.variants && endpoint.variants.length > 0) || endpoint.jsonSchema) {
    try { const text = await request.text(); bodyJson = text ? JSON.parse(text) : null; } catch { bodyJson = null; }
  }

  // ─── JSON Schema validation ────────────────────────────────────────
  if (endpoint.jsonSchema) {
    const errors = validateJsonSchema(bodyJson, endpoint.jsonSchema);
    if (errors) {
      const responseTimeMs = Date.now() - startTime;
      logRequest(userSlug, slug, method, requestPath, 422, responseTimeMs).catch(() => {});
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 422, headers: corsHeaders() });
    }
  }

  // ─── Proxy mode ────────────────────────────────────────────────────
  if (endpoint.proxyUrl) {
    try {
      const proxyRes = await fetch(`${endpoint.proxyUrl}${requestPath}`, {
        method, headers: { "Content-Type": endpoint.contentType },
      });
      const proxyBody = await proxyRes.text();
      const responseTimeMs = Date.now() - startTime;
      logRequest(userSlug, slug, method, requestPath, proxyRes.status, responseTimeMs).catch(() => {});
      return new NextResponse(proxyBody, {
        status: proxyRes.status,
        headers: { ...corsHeaders(), "Content-Type": proxyRes.headers.get("Content-Type") || "application/json", "X-Mock-Server": "Mocka", "X-Mock-Proxy": "true" },
      });
    } catch {
      return NextResponse.json({ error: "Proxy request failed" }, { status: 502, headers: corsHeaders() });
    }
  }

  // ─── Resolve response (conditions / default) ──────────────────────
  const resolved = resolveResponse(endpoint, request, bodyJson);

  // ─── Sequence responses ────────────────────────────────────────────
  let finalBody = resolved.responseBody;
  if (endpoint.sequence && endpoint.sequence.length > 0) {
    const callCount = await countRecentRequests(userSlug, slug, method, requestPath, 86400); // last 24h
    const index = callCount % endpoint.sequence.length;
    finalBody = endpoint.sequence[index];
  }

  // ─── Response body from URL ────────────────────────────────────────
  if (endpoint.responseBodyUrl && !endpoint.sequence) {
    try {
      const urlRes = await fetch(endpoint.responseBodyUrl);
      finalBody = await urlRes.text();
    } catch {
      // fallback to inline body
    }
  }

  // ─── Delay ─────────────────────────────────────────────────────────
  if (endpoint.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
  }

  const responseBody = finalBody ? applyTemplating(finalBody, matchedParams || {}) : null;

  const headers: Record<string, string> = {
    ...corsHeaders(),
    "Content-Type": resolved.contentType,
    "X-Mock-Server": "Mocka",
    "X-Mock-Project": `${userSlug}/${slug}`,
    ...resolved.headers,
  };

  const responseTimeMs = Date.now() - startTime;
  logRequest(userSlug, slug, method, requestPath, resolved.statusCode, responseTimeMs).catch(() => {});
  fireWebhook(endpoint, matchedParams || {});

  return new NextResponse(responseBody, { status: resolved.statusCode, headers });
}

export async function GET(req: NextRequest, ctx: RouteParams) { return handleMockRequest(req, ctx); }
export async function POST(req: NextRequest, ctx: RouteParams) { return handleMockRequest(req, ctx); }
export async function PUT(req: NextRequest, ctx: RouteParams) { return handleMockRequest(req, ctx); }
export async function PATCH(req: NextRequest, ctx: RouteParams) { return handleMockRequest(req, ctx); }
export async function DELETE(req: NextRequest, ctx: RouteParams) { return handleMockRequest(req, ctx); }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders() }); }
