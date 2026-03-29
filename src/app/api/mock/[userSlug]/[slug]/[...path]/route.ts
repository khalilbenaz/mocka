import { NextRequest, NextResponse } from "next/server";
import { getProject, logRequest, countRecentRequests } from "@/lib/store";
import type { MockEndpoint, ResponseVariant, ResponseCondition } from "@/lib/types";

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

// ─── Conditional response evaluation ─────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current !== undefined && current !== null ? String(current) : undefined;
}

function evaluateCondition(
  condition: ResponseCondition,
  request: NextRequest,
  bodyJson: Record<string, unknown> | null
): boolean {
  let value: string | undefined;

  if (condition.source === "query") {
    value = request.nextUrl.searchParams.get(condition.field) ?? undefined;
  } else if (condition.source === "header") {
    value = request.headers.get(condition.field) ?? undefined;
  } else if (condition.source === "body" && bodyJson) {
    value = getNestedValue(bodyJson, condition.field);
  }

  switch (condition.operator) {
    case "exists":
      return value !== undefined;
    case "equals":
      return value === condition.value;
    case "contains":
      return value !== undefined && condition.value !== undefined && value.includes(condition.value);
    case "regex":
      try {
        return value !== undefined && condition.value !== undefined && new RegExp(condition.value).test(value);
      } catch {
        return false;
      }
    default:
      return false;
  }
}

function resolveResponse(
  endpoint: MockEndpoint,
  request: NextRequest,
  bodyJson: Record<string, unknown> | null
): { statusCode: number; responseBody: string; contentType: string; headers: Record<string, string> } {
  if (endpoint.variants && endpoint.variants.length > 0) {
    for (const variant of endpoint.variants) {
      if (evaluateCondition(variant.condition, request, bodyJson)) {
        return {
          statusCode: variant.statusCode,
          responseBody: variant.responseBody,
          contentType: variant.contentType,
          headers: variant.headers,
        };
      }
    }
  }
  return {
    statusCode: endpoint.statusCode,
    responseBody: endpoint.responseBody,
    contentType: endpoint.contentType,
    headers: endpoint.headers,
  };
}

// ─── Webhook firing ──────────────────────────────────────────────────────────

function fireWebhook(endpoint: MockEndpoint, params: Record<string, string>) {
  const wh = endpoint.webhook;
  if (!wh) return;

  const exec = async () => {
    if (wh.delayMs > 0) await new Promise((r) => setTimeout(r, wh.delayMs));
    const body = wh.body ? applyTemplating(wh.body, params) : undefined;
    await fetch(wh.url, {
      method: wh.method,
      headers: { "Content-Type": "application/json", ...wh.headers },
      body,
    }).catch(() => {});
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
    return NextResponse.json(
      { error: "Mock project not found", userSlug, slug },
      { status: 404, headers: corsHeaders() }
    );
  }

  const requestPath = "/" + path.join("/");
  const method = request.method;

  let matchedParams: Record<string, string> | null = null;
  const endpoint = project.endpoints.find((ep) => {
    if (ep.method !== method) return false;
    const p = extractParams(ep.path, requestPath);
    if (p) {
      matchedParams = p;
      return true;
    }
    return false;
  });

  if (!endpoint) {
    return NextResponse.json(
      {
        error: "No matching endpoint",
        method,
        path: requestPath,
        available: project.endpoints.map((ep) => `${ep.method} ${ep.path}`),
      },
      { status: 404, headers: corsHeaders() }
    );
  }

  // ─── Rate limiting ───────────────────────────────────────────────────
  if (endpoint.rateLimit) {
    const count = await countRecentRequests(
      userSlug, slug, method, requestPath, endpoint.rateLimit.windowSeconds
    );
    if (count >= endpoint.rateLimit.maxRequests) {
      const responseTimeMs = Date.now() - startTime;
      logRequest(userSlug, slug, method, requestPath, 429, responseTimeMs).catch(() => {});
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          limit: endpoint.rateLimit.maxRequests,
          windowSeconds: endpoint.rateLimit.windowSeconds,
          retryAfterSeconds: endpoint.rateLimit.windowSeconds,
        },
        {
          status: 429,
          headers: {
            ...corsHeaders(),
            "Retry-After": String(endpoint.rateLimit.windowSeconds),
          },
        }
      );
    }
  }

  // ─── Parse body for conditional responses ────────────────────────────
  let bodyJson: Record<string, unknown> | null = null;
  if (endpoint.variants && endpoint.variants.length > 0) {
    try {
      const text = await request.text();
      bodyJson = text ? JSON.parse(text) : null;
    } catch {
      bodyJson = null;
    }
  }

  // ─── Resolve response (default or variant) ──────────────────────────
  const resolved = resolveResponse(endpoint, request, bodyJson);

  // ─── Delay ───────────────────────────────────────────────────────────
  if (endpoint.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
  }

  const responseBody = resolved.responseBody
    ? applyTemplating(resolved.responseBody, matchedParams || {})
    : null;

  const headers: Record<string, string> = {
    ...corsHeaders(),
    "Content-Type": resolved.contentType,
    "X-Mock-Server": "Mocka",
    "X-Mock-Project": `${userSlug}/${slug}`,
    ...resolved.headers,
  };

  const responseTimeMs = Date.now() - startTime;

  // Log async
  logRequest(userSlug, slug, method, requestPath, resolved.statusCode, responseTimeMs).catch(() => {});

  // Fire webhook async
  fireWebhook(endpoint, matchedParams || {});

  return new NextResponse(responseBody, {
    status: resolved.statusCode,
    headers,
  });
}

export async function GET(req: NextRequest, ctx: RouteParams) {
  return handleMockRequest(req, ctx);
}

export async function POST(req: NextRequest, ctx: RouteParams) {
  return handleMockRequest(req, ctx);
}

export async function PUT(req: NextRequest, ctx: RouteParams) {
  return handleMockRequest(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: RouteParams) {
  return handleMockRequest(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: RouteParams) {
  return handleMockRequest(req, ctx);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
