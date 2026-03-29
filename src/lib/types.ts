export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// ─── Rate Limiting ───────────────────────────────────────────────────────────

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

// ─── Webhook / Callback ──────────────────────────────────────────────────────

export interface WebhookConfig {
  url: string;
  method: HttpMethod;
  delayMs: number;
  body?: string;
  headers?: Record<string, string>;
}

// ─── Conditional Responses ───────────────────────────────────────────────────

export type ConditionSource = "query" | "header" | "body";
export type ConditionOperator = "equals" | "contains" | "exists" | "regex";

export interface ResponseCondition {
  source: ConditionSource;
  field: string;
  operator: ConditionOperator;
  value?: string;
}

export interface ResponseVariant {
  id: string;
  label: string;
  condition: ResponseCondition;
  statusCode: number;
  responseBody: string;
  contentType: string;
  headers: Record<string, string>;
}

// ─── Endpoint & Project ──────────────────────────────────────────────────────

export interface MockEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  statusCode: number;
  responseBody: string;
  contentType: string;
  headers: Record<string, string>;
  delay: number; // ms
  rateLimit?: RateLimitConfig;
  webhook?: WebhookConfig;
  variants?: ResponseVariant[];
  // Sequence responses — cycles through bodies on each call
  sequence?: string[];
  // Random failure injection — percentage 0-100
  failureRate?: number;
  // Fetch response body from external URL instead of inline
  responseBodyUrl?: string;
  // JSON Schema for request body validation
  jsonSchema?: string;
  // Proxy mode — forward to real API and record response
  proxyUrl?: string;
}

export interface MockProject {
  id: string;
  userId: string;
  userSlug: string; // short unique id derived from userId (6 chars)
  name: string;
  slug: string;
  description: string;
  endpoints: MockEndpoint[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean; // visible in gallery
  tags?: string[];
}
