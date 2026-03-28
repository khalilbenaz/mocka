import { NextRequest } from "next/server";

interface JwtPayload {
  sub: string;
  email: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

// Extract user ID from Netlify Identity JWT token
export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);

  try {
    // Decode JWT payload (Netlify Identity tokens are JWTs)
    // In production, you'd verify the signature with the Netlify site's JWT secret
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    if (!payload.sub) return null;

    return {
      sub: payload.sub,
      email: payload.email || "",
      app_metadata: payload.app_metadata,
      user_metadata: payload.user_metadata,
    };
  } catch {
    return null;
  }
}
