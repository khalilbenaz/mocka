import { NextRequest, NextResponse } from "next/server";
import { getProject, logRequest } from "@/lib/store";

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
    // {{params.id}} or {{id}} — path params
    const paramKey = key.startsWith("params.") ? key.slice(7) : key;
    if (params[paramKey] !== undefined) return params[paramKey];

    // {{timestamp}}
    if (key === "timestamp") return new Date().toISOString();
    // {{randomId}}
    if (key === "randomId") return Math.random().toString(36).substring(2, 10);
    // {{randomInt}}
    if (key === "randomInt") return String(Math.floor(Math.random() * 10000));
    // {{now}}
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
  };
}

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

  if (endpoint.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
  }

  const responseBody = endpoint.responseBody
    ? applyTemplating(endpoint.responseBody, matchedParams || {})
    : null;

  const headers: Record<string, string> = {
    ...corsHeaders(),
    "Content-Type": endpoint.contentType,
    "X-Mock-Server": "Mocka",
    "X-Mock-Project": `${userSlug}/${slug}`,
    ...endpoint.headers,
  };

  const responseTimeMs = Date.now() - startTime;

  // Log async — don't block the response
  logRequest(userSlug, slug, method, requestPath, endpoint.statusCode, responseTimeMs).catch(() => {});

  return new NextResponse(responseBody, {
    status: endpoint.statusCode,
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
