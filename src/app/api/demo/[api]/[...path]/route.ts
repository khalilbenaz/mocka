import { NextRequest, NextResponse } from "next/server";
import { matchDemoEndpoint, DEMO_APIS } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Cache-Control": "no-store",
    "X-Mock-Server": "Mocka-Demo",
  };
}

type RouteParams = { params: Promise<{ api: string; path: string[] }> };

async function handleRequest(request: NextRequest, { params }: RouteParams) {
  const { api, path } = await params;
  const requestPath = "/" + path.join("/");
  const method = request.method;

  if (!DEMO_APIS[api]) {
    return NextResponse.json(
      { error: "Demo API not found", available: Object.keys(DEMO_APIS) },
      { status: 404, headers: corsHeaders() }
    );
  }

  const ep = matchDemoEndpoint(api, method, requestPath);
  if (!ep) {
    const available = DEMO_APIS[api].endpoints.map((e) => `${e.method} ${e.path}`);
    return NextResponse.json(
      { error: "No matching endpoint", method, path: requestPath, available },
      { status: 404, headers: corsHeaders() }
    );
  }

  return new NextResponse(ep.body || null, {
    status: ep.status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, ctx: RouteParams) { return handleRequest(req, ctx); }
export async function POST(req: NextRequest, ctx: RouteParams) { return handleRequest(req, ctx); }
export async function PUT(req: NextRequest, ctx: RouteParams) { return handleRequest(req, ctx); }
export async function PATCH(req: NextRequest, ctx: RouteParams) { return handleRequest(req, ctx); }
export async function DELETE(req: NextRequest, ctx: RouteParams) { return handleRequest(req, ctx); }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: corsHeaders() }); }
