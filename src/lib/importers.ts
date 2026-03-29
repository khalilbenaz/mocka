import { MockEndpoint, HttpMethod } from "./types";

// ─── cURL Parser ─────────────────────────────────────────────────────────────

export function parseCurl(curl: string): Partial<MockEndpoint> | null {
  try {
    const clean = curl.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim();

    // Method
    const methodMatch = clean.match(/-X\s+(GET|POST|PUT|PATCH|DELETE)/i);
    const method = (methodMatch ? methodMatch[1].toUpperCase() : (clean.includes("-d ") || clean.includes("--data") ? "POST" : "GET")) as HttpMethod;

    // URL
    const urlMatch = clean.match(/(?:curl\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/) || clean.match(/\s(https?:\/\/[^\s'"]+)/);
    if (!urlMatch) return null;
    const url = new URL(urlMatch[1]);
    const path = url.pathname;

    // Headers
    const headers: Record<string, string> = {};
    const headerMatches = clean.matchAll(/-H\s+['"]([^'"]+)['"]/g);
    let contentType = "application/json";
    for (const m of headerMatches) {
      const [key, ...rest] = m[1].split(":");
      const val = rest.join(":").trim();
      if (key.toLowerCase() === "content-type") contentType = val;
      else headers[key.trim()] = val;
    }

    // Body
    const bodyMatch = clean.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"](.+?)['"](?:\s|$)/) ||
                      clean.match(/(?:-d|--data|--data-raw|--data-binary)\s+(\S+)/);
    const responseBody = bodyMatch ? bodyMatch[1] : "";

    return { method, path, statusCode: method === "POST" ? 201 : 200, responseBody, contentType, headers, delay: 0 };
  } catch {
    return null;
  }
}

// ─── OpenAPI/Swagger Parser ──────────────────────────────────────────────────

interface OpenAPIPath {
  [method: string]: {
    summary?: string;
    responses?: Record<string, {
      description?: string;
      content?: Record<string, { schema?: unknown; example?: unknown; examples?: Record<string, { value?: unknown }> }>;
    }>;
  };
}

interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info?: { title?: string; description?: string };
  paths?: Record<string, OpenAPIPath>;
}

function resolveExample(response: { content?: Record<string, { schema?: unknown; example?: unknown; examples?: Record<string, { value?: unknown }> }> } | undefined): string {
  if (!response?.content) return '{"message": "OK"}';
  const json = response.content["application/json"] || response.content[Object.keys(response.content)[0]];
  if (!json) return '{"message": "OK"}';
  if (json.example) return JSON.stringify(json.example, null, 2);
  if (json.examples) {
    const first = Object.values(json.examples)[0];
    if (first?.value) return JSON.stringify(first.value, null, 2);
  }
  // Generate from schema
  if (json.schema) return generateFromSchema(json.schema);
  return '{"message": "OK"}';
}

function generateFromSchema(schema: unknown): string {
  if (!schema || typeof schema !== "object") return '{}';
  const s = schema as Record<string, unknown>;
  if (s.type === "array") return JSON.stringify([generateFromSchemaObj(s.items as Record<string, unknown>)], null, 2);
  if (s.type === "object" || s.properties) return JSON.stringify(generateFromSchemaObj(s), null, 2);
  if (s.type === "string") return '"example"';
  if (s.type === "number" || s.type === "integer") return "0";
  if (s.type === "boolean") return "true";
  return '{}';
}

function generateFromSchemaObj(schema: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!schema) return {};
  const props = schema.properties as Record<string, Record<string, unknown>> | undefined;
  if (!props) return {};
  const obj: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(props)) {
    if (def.example !== undefined) obj[key] = def.example;
    else if (def.type === "string") obj[key] = `example_${key}`;
    else if (def.type === "integer" || def.type === "number") obj[key] = 1;
    else if (def.type === "boolean") obj[key] = true;
    else if (def.type === "array") obj[key] = [];
    else if (def.type === "object") obj[key] = generateFromSchemaObj(def);
    else obj[key] = null;
  }
  return obj;
}

export function parseOpenAPI(content: string): { name: string; description: string; endpoints: MockEndpoint[] } | null {
  try {
    let spec: OpenAPISpec;
    // Try JSON first, then basic YAML parsing
    try { spec = JSON.parse(content); } catch {
      // Basic YAML → JSON conversion (handles simple cases)
      const yamlToJson = content
        .replace(/:\s*\n/g, ": null\n")
        .replace(/^(\s*)(\w[\w-]*):\s*(.+)$/gm, '$1"$2": $3');
      spec = JSON.parse(`{${yamlToJson}}`);
    }

    if (!spec.paths) return null;

    const endpoints: MockEndpoint[] = [];
    const httpMethods = ["get", "post", "put", "patch", "delete"];

    for (const [pathStr, methods] of Object.entries(spec.paths)) {
      for (const [methodStr, operation] of Object.entries(methods)) {
        if (!httpMethods.includes(methodStr.toLowerCase())) continue;

        const responses = operation.responses || {};
        const successCode = Object.keys(responses).find((c) => c.startsWith("2")) || "200";
        const response = responses[successCode];
        const body = resolveExample(response);

        // Convert {param} to :param
        const path = pathStr.replace(/\{(\w+)\}/g, ":$1");

        endpoints.push({
          id: `${methodStr}_${pathStr}`.replace(/[^a-z0-9]/gi, "_"),
          method: methodStr.toUpperCase() as HttpMethod,
          path,
          statusCode: Number(successCode),
          responseBody: body,
          contentType: "application/json",
          headers: {},
          delay: 0,
        });
      }
    }

    return {
      name: spec.info?.title || "Imported API",
      description: spec.info?.description || "",
      endpoints,
    };
  } catch {
    return null;
  }
}

// ─── Postman Collection Parser ───────────────────────────────────────────────

interface PostmanItem {
  name?: string;
  request?: {
    method?: string;
    url?: { raw?: string; path?: string[]; host?: string[] } | string;
    header?: Array<{ key: string; value: string }>;
    body?: { raw?: string };
  };
  response?: Array<{
    code?: number;
    body?: string;
    header?: Array<{ key: string; value: string }>;
  }>;
  item?: PostmanItem[];
}

interface PostmanCollection {
  info?: { name?: string; description?: string };
  item?: PostmanItem[];
}

function flattenPostmanItems(items: PostmanItem[]): PostmanItem[] {
  const result: PostmanItem[] = [];
  for (const item of items) {
    if (item.item) result.push(...flattenPostmanItems(item.item));
    else if (item.request) result.push(item);
  }
  return result;
}

export function parsePostman(content: string): { name: string; description: string; endpoints: MockEndpoint[] } | null {
  try {
    const collection: PostmanCollection = JSON.parse(content);
    if (!collection.item) return null;

    const items = flattenPostmanItems(collection.item);
    const endpoints: MockEndpoint[] = [];

    for (const item of items) {
      if (!item.request) continue;

      const method = (item.request.method || "GET").toUpperCase() as HttpMethod;
      let path = "/";

      if (typeof item.request.url === "string") {
        try { path = new URL(item.request.url).pathname; } catch { path = item.request.url; }
      } else if (item.request.url?.path) {
        path = "/" + item.request.url.path.join("/");
      }

      // Convert {{variable}} to :variable and :variable syntax
      path = path.replace(/\{\{(\w+)\}\}/g, ":$1");

      const headers: Record<string, string> = {};
      if (item.request.header) {
        for (const h of item.request.header) {
          if (h.key.toLowerCase() !== "content-type") headers[h.key] = h.value;
        }
      }

      // Use first saved response as body, or request body
      let responseBody = '{"message": "OK"}';
      let statusCode = method === "POST" ? 201 : 200;

      if (item.response && item.response.length > 0) {
        const resp = item.response[0];
        if (resp.body) responseBody = resp.body;
        if (resp.code) statusCode = resp.code;
      } else if (item.request.body?.raw) {
        responseBody = item.request.body.raw;
      }

      endpoints.push({
        id: (item.name || `${method}_${path}`).replace(/[^a-z0-9]/gi, "_").slice(0, 32),
        method,
        path,
        statusCode,
        responseBody,
        contentType: "application/json",
        headers,
        delay: 0,
      });
    }

    return {
      name: collection.info?.name || "Imported Collection",
      description: collection.info?.description || "",
      endpoints,
    };
  } catch {
    return null;
  }
}
