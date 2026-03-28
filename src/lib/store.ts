import { MockProject } from "./types";

// In-memory store for mock projects (server-side)
// In production, replace with a database (Vercel KV, Supabase, etc.)
const projects = new Map<string, MockProject>();

export function getProject(slug: string): MockProject | undefined {
  return projects.get(slug);
}

export function getProjectById(id: string): MockProject | undefined {
  for (const project of projects.values()) {
    if (project.id === id) return project;
  }
  return undefined;
}

export function getAllProjects(): MockProject[] {
  return Array.from(projects.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function saveProject(project: MockProject): void {
  projects.set(project.slug, project);
}

export function deleteProject(slug: string): boolean {
  return projects.delete(slug);
}

export function slugExists(slug: string): boolean {
  return projects.has(slug);
}
