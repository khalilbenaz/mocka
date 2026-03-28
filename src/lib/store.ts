import { MockProject } from "./types";

// In-memory store for mock projects (server-side)
// Key format: "userId:slug" for user-scoped projects
// Mock serving uses slug-only lookup across all users
const projects = new Map<string, MockProject>();

function userKey(userId: string, slug: string): string {
  return `${userId}:${slug}`;
}

// Get a project by slug (for serving mocks — no auth needed)
export function getProject(slug: string): MockProject | undefined {
  for (const project of projects.values()) {
    if (project.slug === slug) return project;
  }
  return undefined;
}

// Get all projects for a specific user
export function getUserProjects(userId: string): MockProject[] {
  const userProjects: MockProject[] = [];
  for (const [key, project] of projects.entries()) {
    if (key.startsWith(`${userId}:`)) {
      userProjects.push(project);
    }
  }
  return userProjects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

// Save a project scoped to a user
export function saveProject(userId: string, project: MockProject): void {
  projects.set(userKey(userId, project.slug), project);
}

// Delete a project scoped to a user
export function deleteProject(userId: string, slug: string): boolean {
  return projects.delete(userKey(userId, slug));
}

// Check if a slug exists globally (slugs must be unique across all users)
export function slugExists(slug: string): boolean {
  for (const project of projects.values()) {
    if (project.slug === slug) return true;
  }
  return false;
}

// Check if a user owns a project
export function userOwnsProject(userId: string, slug: string): boolean {
  return projects.has(userKey(userId, slug));
}
