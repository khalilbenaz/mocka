"use client";

import { useState } from "react";
import { HttpMethod, MockEndpoint, ResponseVariant, ConditionSource, ConditionOperator } from "@/lib/types";
import { generateId, methodColor, formatJson, isValidJson } from "@/lib/utils";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const CONTENT_TYPES = ["application/json", "text/plain", "text/html", "application/xml"];
const SOURCES: ConditionSource[] = ["query", "header", "body"];
const OPERATORS: ConditionOperator[] = ["equals", "contains", "exists", "regex"];

interface Props {
  endpoint?: MockEndpoint;
  onSave: (endpoint: MockEndpoint) => void;
  onCancel: () => void;
}

export default function EndpointForm({ endpoint, onSave, onCancel }: Props) {
  const [method, setMethod] = useState<HttpMethod>(endpoint?.method || "GET");
  const [path, setPath] = useState(endpoint?.path || "/");
  const [statusCode, setStatusCode] = useState(endpoint?.statusCode || 200);
  const [responseBody, setResponseBody] = useState(
    endpoint?.responseBody || '{\n  "message": "Hello from Mocka!"\n}'
  );
  const [contentType, setContentType] = useState(endpoint?.contentType || "application/json");
  const [delay, setDelay] = useState(endpoint?.delay || 0);
  const [customHeaders, setCustomHeaders] = useState(
    endpoint?.headers ? JSON.stringify(endpoint.headers, null, 2) : "{}"
  );

  // Rate Limiting
  const [rateLimitEnabled, setRateLimitEnabled] = useState(!!endpoint?.rateLimit);
  const [maxRequests, setMaxRequests] = useState(endpoint?.rateLimit?.maxRequests ?? 60);
  const [windowSeconds, setWindowSeconds] = useState(endpoint?.rateLimit?.windowSeconds ?? 60);

  // Webhook
  const [webhookEnabled, setWebhookEnabled] = useState(!!endpoint?.webhook);
  const [whUrl, setWhUrl] = useState(endpoint?.webhook?.url ?? "");
  const [whMethod, setWhMethod] = useState<HttpMethod>(endpoint?.webhook?.method ?? "POST");
  const [whDelay, setWhDelay] = useState(endpoint?.webhook?.delayMs ?? 0);
  const [whBody, setWhBody] = useState(endpoint?.webhook?.body ?? "");
  const [whHeaders, setWhHeaders] = useState(
    endpoint?.webhook?.headers ? JSON.stringify(endpoint.webhook.headers, null, 2) : "{}"
  );

  // Conditional Responses
  const [variants, setVariants] = useState<ResponseVariant[]>(endpoint?.variants ?? []);

  const addVariant = () => {
    setVariants([...variants, {
      id: generateId(),
      label: `Variant ${variants.length + 1}`,
      condition: { source: "query", field: "error", operator: "equals", value: "true" },
      statusCode: 500,
      responseBody: '{"error": "Something went wrong"}',
      contentType: "application/json",
      headers: {},
    }]);
  };

  const updateVariant = (id: string, patch: Partial<ResponseVariant>) => {
    setVariants(variants.map((v) => v.id === id ? { ...v, ...patch } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let headers: Record<string, string> = {};
    try { headers = JSON.parse(customHeaders); } catch { /* ignore */ }

    let webhookHeaders: Record<string, string> = {};
    try { webhookHeaders = JSON.parse(whHeaders); } catch { /* ignore */ }

    onSave({
      id: endpoint?.id || generateId(),
      method,
      path: path.startsWith("/") ? path : `/${path}`,
      statusCode,
      responseBody,
      contentType,
      headers,
      delay,
      rateLimit: rateLimitEnabled ? { maxRequests, windowSeconds } : undefined,
      webhook: webhookEnabled && whUrl ? { url: whUrl, method: whMethod, delayMs: whDelay, body: whBody || undefined, headers: Object.keys(webhookHeaders).length > 0 ? webhookHeaders : undefined } : undefined,
      variants: variants.length > 0 ? variants : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Method + Path */}
      <div className="flex gap-3">
        <div className="shrink-0">
          <label className="block text-xs text-muted mb-1.5">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)} className="bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent">
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-muted mb-1.5">Path</label>
          <input type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/api/users" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent" required />
        </div>
      </div>

      {/* Status + Content Type + Delay */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1.5">Status Code</label>
          <input type="number" value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))} min={100} max={599} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Content-Type</label>
          <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent">
            {CONTENT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Delay (ms)</label>
          <input type="number" value={delay} onChange={(e) => setDelay(Number(e.target.value))} min={0} max={30000} step={100} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent" />
        </div>
      </div>

      {/* Response Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-muted">Response Body {variants.length > 0 && <span className="text-accent">(default)</span>}</label>
          {contentType === "application/json" && (
            <button type="button" onClick={() => setResponseBody(formatJson(responseBody))} className="text-xs text-accent hover:text-accent-hover transition-colors">Format JSON</button>
          )}
        </div>
        <textarea value={responseBody} onChange={(e) => setResponseBody(e.target.value)} rows={6} className="code-editor w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent" placeholder='{"message": "Hello!"}' />
        {contentType === "application/json" && responseBody && !isValidJson(responseBody) && (
          <p className="text-xs text-danger mt-1">Invalid JSON</p>
        )}
      </div>

      {/* Custom Headers */}
      <div>
        <label className="block text-xs text-muted mb-1.5">Custom Headers (JSON)</label>
        <textarea value={customHeaders} onChange={(e) => setCustomHeaders(e.target.value)} rows={2} className="code-editor w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent" placeholder='{"X-Custom": "value"}' />
      </div>

      {/* ─── Rate Limiting ─────────────────────────────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button type="button" onClick={() => setRateLimitEnabled(!rateLimitEnabled)} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-surface-2/50 transition-colors">
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${rateLimitEnabled ? "bg-warning" : "bg-border"}`} />
            <span className="font-medium">Rate Limiting</span>
          </span>
          <span className="text-xs text-muted">{rateLimitEnabled ? `${maxRequests} req / ${windowSeconds}s` : "Off"}</span>
        </button>
        {rateLimitEnabled && (
          <div className="px-4 py-3 border-t border-border bg-surface-2/30 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Max requests</label>
              <input type="number" value={maxRequests} onChange={(e) => setMaxRequests(Number(e.target.value))} min={1} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Window (seconds)</label>
              <input type="number" value={windowSeconds} onChange={(e) => setWindowSeconds(Number(e.target.value))} min={1} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent" />
            </div>
          </div>
        )}
      </div>

      {/* ─── Webhook ───────────────────────────────────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button type="button" onClick={() => setWebhookEnabled(!webhookEnabled)} className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-surface-2/50 transition-colors">
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${webhookEnabled ? "bg-accent" : "bg-border"}`} />
            <span className="font-medium">Webhook / Callback</span>
          </span>
          <span className="text-xs text-muted">{webhookEnabled ? "On" : "Off"}</span>
        </button>
        {webhookEnabled && (
          <div className="px-4 py-3 border-t border-border bg-surface-2/30 space-y-3">
            <div className="flex gap-3">
              <div className="shrink-0">
                <label className="block text-xs text-muted mb-1">Method</label>
                <select value={whMethod} onChange={(e) => setWhMethod(e.target.value as HttpMethod)} className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent">
                  {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-muted mb-1">URL</label>
                <input type="url" value={whUrl} onChange={(e) => setWhUrl(e.target.value)} placeholder="https://example.com/callback" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent" />
              </div>
              <div className="shrink-0 w-24">
                <label className="block text-xs text-muted mb-1">Delay (ms)</label>
                <input type="number" value={whDelay} onChange={(e) => setWhDelay(Number(e.target.value))} min={0} step={100} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Body (optional, supports templating)</label>
              <textarea value={whBody} onChange={(e) => setWhBody(e.target.value)} rows={2} className="code-editor w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" placeholder='{"event": "mock_called", "id": "{{id}}"}' />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Headers (JSON, optional)</label>
              <textarea value={whHeaders} onChange={(e) => setWhHeaders(e.target.value)} rows={1} className="code-editor w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" placeholder='{"X-Webhook-Secret": "abc"}' />
            </div>
          </div>
        )}
      </div>

      {/* ─── Conditional Responses ─────────────────────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${variants.length > 0 ? "bg-success" : "bg-border"}`} />
            <span className="font-medium">Conditional Responses</span>
          </span>
          <button type="button" onClick={addVariant} className="text-xs text-accent hover:text-accent-hover transition-colors">+ Add variant</button>
        </div>
        {variants.length > 0 && (
          <div className="border-t border-border divide-y divide-border">
            {variants.map((v) => (
              <div key={v.id} className="px-4 py-3 bg-surface-2/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input type="text" value={v.label} onChange={(e) => updateVariant(v.id, { label: e.target.value })} className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent" placeholder="Variant label" />
                  <button type="button" onClick={() => removeVariant(v.id)} className="text-xs text-danger hover:text-danger/70 px-2 py-1">Remove</button>
                </div>
                {/* Condition */}
                <div className="flex gap-2 items-end flex-wrap">
                  <div>
                    <label className="block text-[10px] text-muted mb-0.5">When</label>
                    <select value={v.condition.source} onChange={(e) => updateVariant(v.id, { condition: { ...v.condition, source: e.target.value as ConditionSource } })} className="bg-surface-2 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent">
                      {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[80px]">
                    <label className="block text-[10px] text-muted mb-0.5">Field</label>
                    <input type="text" value={v.condition.field} onChange={(e) => updateVariant(v.id, { condition: { ...v.condition, field: e.target.value } })} className="w-full bg-surface-2 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent" placeholder="status" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted mb-0.5">Op</label>
                    <select value={v.condition.operator} onChange={(e) => updateVariant(v.id, { condition: { ...v.condition, operator: e.target.value as ConditionOperator } })} className="bg-surface-2 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent">
                      {OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  {v.condition.operator !== "exists" && (
                    <div className="flex-1 min-w-[80px]">
                      <label className="block text-[10px] text-muted mb-0.5">Value</label>
                      <input type="text" value={v.condition.value ?? ""} onChange={(e) => updateVariant(v.id, { condition: { ...v.condition, value: e.target.value } })} className="w-full bg-surface-2 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent" placeholder="true" />
                    </div>
                  )}
                </div>
                {/* Response */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-muted mb-0.5">Status</label>
                    <input type="number" value={v.statusCode} onChange={(e) => updateVariant(v.id, { statusCode: Number(e.target.value) })} min={100} max={599} className="w-full bg-surface-2 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted mb-0.5">Content-Type</label>
                    <select value={v.contentType} onChange={(e) => updateVariant(v.id, { contentType: e.target.value })} className="w-full bg-surface-2 border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-accent">
                      {CONTENT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted mb-0.5">Headers (JSON)</label>
                    <input type="text" value={JSON.stringify(v.headers)} onChange={(e) => { try { updateVariant(v.id, { headers: JSON.parse(e.target.value) }); } catch { /* ignore */ } }} className="w-full bg-surface-2 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent" placeholder="{}" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-muted mb-0.5">Response Body</label>
                  <textarea value={v.responseBody} onChange={(e) => updateVariant(v.id, { responseBody: e.target.value })} rows={2} className="code-editor w-full bg-surface-2 border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-accent" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="bg-background border border-border rounded-lg p-4">
        <div className="text-xs text-muted mb-2">Preview</div>
        <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${methodColor(method)}`}>{method}</span>
          <span className="text-foreground">{path || "/"}</span>
          <span className="text-muted">&rarr;</span>
          <span className="text-accent">{statusCode}</span>
          {delay > 0 && <span className="text-muted text-xs">+{delay}ms</span>}
          {rateLimitEnabled && <span className="text-warning text-xs">limit:{maxRequests}/{windowSeconds}s</span>}
          {webhookEnabled && whUrl && <span className="text-accent text-xs">webhook</span>}
          {variants.length > 0 && <span className="text-success text-xs">{variants.length} variant{variants.length > 1 ? "s" : ""}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors">{endpoint ? "Update" : "Add"} Endpoint</button>
      </div>
    </form>
  );
}
