import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/store";

function matchPath(pattern: string, actual: string): boolean {
  const patternParts = pattern.split("/").filter(Boolean);
  const actualParts = actual.split("/").filter(Boolean);

  if (patternParts.length !== actualParts.length) return false;

  return patternParts.every(
    (part, i) => part.startsWith(":") || part === actualParts[i]
  );
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
  const { userSlug, slug, path } = await params;
  const project = getProject(userSlug, slug);

  if (!project) {
    return NextResponse.json(
      { error: "Mock project not found", userSlug, slug },
      { status: 404, headers: corsHeaders() }
    );
  }

  const requestPath = "/" + path.join("/");
  const method = request.method;

  const endpoint = project.endpoints.find(
    (ep) => ep.method === method && matchPath(ep.path, requestPath)
  );

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

  const headers: Record<string, string> = {
    ...corsHeaders(),
    "Content-Type": endpoint.contentType,
    "X-Mock-Server": "Mocka",
    "X-Mock-Project": `${userSlug}/${slug}`,
    ...endpoint.headers,
  };

  return new NextResponse(endpoint.responseBody || null, {
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
