import { NextRequest, NextResponse } from "next/server";
import { MockProject } from "@/lib/types";
import { getUserProjects, saveProject, slugExistsForUser, deleteProject, userOwnsProject } from "@/lib/store";
import { getUserFromRequest } from "@/lib/auth-server";
import { userIdToSlug } from "@/lib/utils";

function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

// GET — list user's projects
export async function GET() {
  const user = await getUserFromRequest();
  if (!user) return unauthorized();

  const projects = getUserProjects(user.sub);
  return NextResponse.json(projects);
}

// POST — create a new project
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest();
  if (!user) return unauthorized();

  try {
    const body: MockProject = await request.json();

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    if (!body.endpoints || body.endpoints.length === 0) {
      return NextResponse.json({ error: "At least one endpoint is required" }, { status: 400 });
    }

    const uSlug = userIdToSlug(user.sub);

    // Ensure unique slug within user's namespace
    let slug = body.slug;
    let counter = 1;
    while (slugExistsForUser(uSlug, slug)) {
      slug = `${body.slug}-${counter}`;
      counter++;
    }

    const project: MockProject = {
      ...body,
      slug,
      userId: user.sub,
      userSlug: uSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(project);
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// PUT — update a project
export async function PUT(request: NextRequest) {
  const user = await getUserFromRequest();
  if (!user) return unauthorized();

  try {
    const body: MockProject = await request.json();
    const uSlug = userIdToSlug(user.sub);

    if (!body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (!userOwnsProject(user.sub, uSlug, body.slug)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updated: MockProject = {
      ...body,
      userId: user.sub,
      userSlug: uSlug,
      updatedAt: new Date().toISOString(),
    };

    saveProject(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE — delete a project
export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const uSlug = userIdToSlug(user.sub);

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (!userOwnsProject(user.sub, uSlug, slug)) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const deleted = deleteProject(uSlug, slug);
  if (!deleted) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
