import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/store";
import type { MockEndpoint } from "@/lib/types";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ userSlug: string; slug: string }> };

const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GET: { bg: "#22c55e20", text: "#22c55e", border: "#22c55e40" },
  POST: { bg: "#3b82f620", text: "#3b82f6", border: "#3b82f640" },
  PUT: { bg: "#f59e0b20", text: "#f59e0b", border: "#f59e0b40" },
  PATCH: { bg: "#f9731620", text: "#f97316", border: "#f9731640" },
  DELETE: { bg: "#ef444420", text: "#ef4444", border: "#ef444440" },
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderEndpoint(ep: MockEndpoint, baseUrl: string): string {
  const colors = METHOD_COLORS[ep.method] || METHOD_COLORS.GET;
  const fullUrl = `${baseUrl}${ep.path}`;
  const curlCmd = `curl${ep.method !== "GET" ? ` -X ${ep.method}` : ""} "${fullUrl}"`;

  return `
    <div style="border:1px solid #2a2a2a;border-radius:10px;margin-bottom:12px;overflow:hidden;background:#141414">
      <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer" onclick="this.parentElement.querySelector('.ep-body').classList.toggle('hidden')">
        <span style="background:${colors.bg};color:${colors.text};border:1px solid ${colors.border};font-family:monospace;font-size:12px;font-weight:700;padding:3px 10px;border-radius:5px;min-width:60px;text-align:center">${ep.method}</span>
        <code style="font-size:14px;color:#ededed;font-family:monospace">${escapeHtml(ep.path)}</code>
        <span style="margin-left:auto;font-family:monospace;font-size:12px;color:#737373">${ep.statusCode}</span>
        <span style="font-size:12px;color:#737373">${escapeHtml(ep.contentType)}</span>
        ${ep.delay > 0 ? `<span style="font-size:12px;color:#f59e0b;font-family:monospace">${ep.delay}ms</span>` : ""}
      </div>
      <div class="ep-body hidden" style="border-top:1px solid #2a2a2a;padding:16px 18px;background:#0d0d0d">
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:#737373;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">curl</div>
          <pre style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:6px;padding:10px 14px;font-size:12px;color:#a5b4fc;overflow-x:auto;margin:0">${escapeHtml(curlCmd)}</pre>
        </div>
        ${Object.keys(ep.headers).length > 0 ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:#737373;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Headers</div>
          <pre style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:6px;padding:10px 14px;font-size:12px;color:#ededed;overflow-x:auto;margin:0">${escapeHtml(JSON.stringify(ep.headers, null, 2))}</pre>
        </div>` : ""}
        ${ep.responseBody ? `
        <div>
          <div style="font-size:11px;color:#737373;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Response body</div>
          <pre style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:6px;padding:10px 14px;font-size:12px;color:#ededed;overflow-x:auto;margin:0;max-height:300px">${escapeHtml(ep.responseBody)}</pre>
        </div>` : ""}
      </div>
    </div>`;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userSlug, slug } = await params;
  const project = await getProject(userSlug, slug);

  if (!project) {
    return NextResponse.json(
      { error: "Mock project not found", userSlug, slug },
      { status: 404 }
    );
  }

  const origin = request.nextUrl.origin;
  const baseUrl = `${origin}/api/mock/${userSlug}/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escapeHtml(project.name)} — Mocka API</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0a0a0a;color:#ededed;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.5}
    .hidden{display:none!important}
    pre{white-space:pre-wrap;word-break:break-all}
    ::selection{background:#6366f140}
    ::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-track{background:#141414}
    ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
  </style>
</head>
<body>
  <div style="max-width:900px;margin:0 auto;padding:24px 16px 64px">
    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:8px;background:#6366f1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px">M</div>
      <div>
        <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.5px">${escapeHtml(project.name)}</h1>
      </div>
      <span style="margin-left:auto;font-size:12px;font-family:monospace;color:#6366f1;background:#6366f115;border:1px solid #6366f130;padding:4px 10px;border-radius:6px">${project.endpoints.length} endpoint${project.endpoints.length !== 1 ? "s" : ""}</span>
    </div>

    ${project.description ? `<p style="color:#737373;font-size:14px;margin-bottom:16px;padding-left:46px">${escapeHtml(project.description)}</p>` : ""}

    <!-- Base URL -->
    <div style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:8px;padding:10px 16px;margin-bottom:28px;display:flex;align-items:center;gap:8px">
      <span style="font-size:11px;color:#737373;text-transform:uppercase;letter-spacing:0.5px">Base URL</span>
      <code style="font-size:13px;font-family:monospace;color:#a5b4fc">${escapeHtml(baseUrl)}</code>
    </div>

    <!-- Endpoints -->
    <h2 style="font-size:14px;font-weight:600;color:#737373;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px">Endpoints</h2>
    ${project.endpoints.map((ep) => renderEndpoint(ep, baseUrl)).join("")}

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:16px;border-top:1px solid #2a2a2a;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:20px;height:20px;border-radius:4px;background:#6366f1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:9px">M</div>
        <span style="font-size:13px;color:#737373">Mocka</span>
      </div>
      <a href="${origin}" style="font-size:12px;font-family:monospace;color:#6366f1;text-decoration:none">mocka.qzz.io</a>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
