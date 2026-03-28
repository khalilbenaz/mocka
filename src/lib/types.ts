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
  name: string;
  slug: string;
  description: string;
  endpoints: MockEndpoint[];
  createdAt: string;
  updatedAt: string;
}
