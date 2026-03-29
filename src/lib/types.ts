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
}
