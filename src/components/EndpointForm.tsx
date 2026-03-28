"use client";

import { useState } from "react";
import { HttpMethod, MockEndpoint } from "@/lib/types";
import { generateId, methodColor, formatJson, isValidJson } from "@/lib/utils";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const CONTENT_TYPES = [
  "application/json",
  "text/plain",
  "text/html",
  "application/xml",
];

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
  const [contentType, setContentType] = useState(
    endpoint?.contentType || "application/json"
  );
  const [delay, setDelay] = useState(endpoint?.delay || 0);
  const [customHeaders, setCustomHeaders] = useState(
    endpoint?.headers ? JSON.stringify(endpoint.headers, null, 2) : "{}"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let headers: Record<string, string> = {};
    try {
      headers = JSON.parse(customHeaders);
    } catch {
      // ignore
    }

    onSave({
      id: endpoint?.id || generateId(),
      method,
      path: path.startsWith("/") ? path : `/${path}`,
      statusCode,
      responseBody,
      contentType,
      headers,
      delay,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Method + Path */}
      <div className="flex gap-3">
        <div className="shrink-0">
          <label className="block text-xs text-muted mb-1.5">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-muted mb-1.5">Path</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/api/users"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      {/* Status + Content Type + Delay */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1.5">Status Code</label>
          <input
            type="number"
            value={statusCode}
            onChange={(e) => setStatusCode(Number(e.target.value))}
            min={100}
            max={599}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Content-Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
          >
            {CONTENT_TYPES.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5">Delay (ms)</label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            min={0}
            max={30000}
            step={100}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Response Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-muted">Response Body</label>
          {contentType === "application/json" && (
            <button
              type="button"
              onClick={() => setResponseBody(formatJson(responseBody))}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Format JSON
            </button>
          )}
        </div>
        <textarea
          value={responseBody}
          onChange={(e) => setResponseBody(e.target.value)}
          rows={8}
          className="code-editor w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
          placeholder='{"message": "Hello!"}'
        />
        {contentType === "application/json" && responseBody && !isValidJson(responseBody) && (
          <p className="text-xs text-danger mt-1">Invalid JSON</p>
        )}
      </div>

      {/* Custom Headers */}
      <div>
        <label className="block text-xs text-muted mb-1.5">
          Custom Headers (JSON)
        </label>
        <textarea
          value={customHeaders}
          onChange={(e) => setCustomHeaders(e.target.value)}
          rows={3}
          className="code-editor w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
          placeholder='{"X-Custom": "value"}'
        />
      </div>

      {/* Preview */}
      <div className="bg-background border border-border rounded-lg p-4">
        <div className="text-xs text-muted mb-2">Preview</div>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${methodColor(method)}`}>
            {method}
          </span>
          <span className="text-foreground">{path || "/"}</span>
          <span className="text-muted">→</span>
          <span className="text-accent">{statusCode}</span>
          {delay > 0 && <span className="text-muted text-xs">+{delay}ms</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
        >
          {endpoint ? "Update" : "Add"} Endpoint
        </button>
      </div>
    </form>
  );
}
