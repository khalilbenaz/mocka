import { auth } from "@clerk/nextjs/server";

interface AuthUser {
  sub: string;
  email: string;
}

// Extract user from Clerk session (replaces Netlify Identity JWT parsing)
export async function getUserFromRequest(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  return {
    sub: userId,
    email: "", // email not needed for API routes — userId is the key
  };
}
