import { NextRequest, NextResponse } from "next/server";
import { getProjectStats } from "@/lib/store";
import { getUserFromRequest } from "@/lib/auth-server";
import { userIdToSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const uSlug = userIdToSlug(user.sub);
  const stats = await getProjectStats(uSlug, slug);
  return NextResponse.json(stats);
}
