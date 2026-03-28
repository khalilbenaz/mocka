import { MockProject } from "./types";

// In-memory store for mock projects (server-side)
// Key format: "userSlug:slug" for user-scoped projects
const projects = new Map<string, MockProject>();

function projectKey(userSlug: string, slug: string): string {
  return `${userSlug}:${slug}`;
}

// Get a project by userSlug + slug (for serving mocks — no auth needed)
export function getProject(userSlug: string, slug: string): MockProject | undefined {
  return projects.get(projectKey(userSlug, slug));
}

// Get all projects for a specific user
export function getUserProjects(userId: string): MockProject[] {
  const userProjects: MockProject[] = [];
  for (const project of projects.values()) {
    if (project.userId === userId) {
      userProjects.push(project);
    }
  }
  return userProjects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

// Save a project scoped to a user
export function saveProject(project: MockProject): void {
  projects.set(projectKey(project.userSlug, project.slug), project);
}

// Delete a project
export function deleteProject(userSlug: string, slug: string): boolean {
  return projects.delete(projectKey(userSlug, slug));
}

// Check if a slug exists for a given user
export function slugExistsForUser(userSlug: string, slug: string): boolean {
  return projects.has(projectKey(userSlug, slug));
}

// Check if a user owns a project
export function userOwnsProject(userId: string, userSlug: string, slug: string): boolean {
  const project = projects.get(projectKey(userSlug, slug));
  return project?.userId === userId;
}
