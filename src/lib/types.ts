export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface MockEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  statusCode: number;
  responseBody: string;
  contentType: string;
  headers: Record<string, string>;
  delay: number; // ms
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
