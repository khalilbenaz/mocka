import { NextRequest, NextResponse } from "next/server";
import { MockProject } from "@/lib/types";
import { getAllProjects, saveProject, slugExists, deleteProject, getProject } from "@/lib/store";

// GET — list all projects
export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json(projects);
}

// POST — create a new project
export async function POST(request: NextRequest) {
  try {
    const body: MockProject = await request.json();

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    if (!body.endpoints || body.endpoints.length === 0) {
      return NextResponse.json({ error: "At least one endpoint is required" }, { status: 400 });
    }

    // Ensure unique slug
    let slug = body.slug;
    let counter = 1;
    while (slugExists(slug)) {
      slug = `${body.slug}-${counter}`;
      counter++;
    }

    const project: MockProject = {
      ...body,
      slug,
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
  try {
    const body: MockProject = await request.json();

    if (!body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existing = getProject(body.slug);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updated: MockProject = {
      ...existing,
      ...body,
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
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const deleted = deleteProject(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
