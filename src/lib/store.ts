import { MockProject } from "./types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

interface ProjectRow {
  id: string;
  user_id: string;
  user_slug: string;
  name: string;
  slug: string;
  description: string;
  endpoints: string;
  created_at: string;
  updated_at: string;
}

function rowToProject(row: ProjectRow): MockProject {
  return {
    id: row.id,
    userId: row.user_id,
    userSlug: row.user_slug,
    name: row.name,
    slug: row.slug,
    description: row.description,
    endpoints: JSON.parse(row.endpoints),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get a project by userSlug + slug (for serving mocks — no auth needed)
export async function getProject(userSlug: string, slug: string): Promise<MockProject | undefined> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT * FROM projects WHERE user_slug = ? AND slug = ?")
    .bind(userSlug, slug)
    .first<ProjectRow>();
  return row ? rowToProject(row) : undefined;
}

// Get all projects (public catalog)
export async function getAllProjects(): Promise<MockProject[]> {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all<ProjectRow>();
  return results.map(rowToProject);
}

// Get all projects for a specific user
export async function getUserProjects(userId: string): Promise<MockProject[]> {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC")
    .bind(userId)
    .all<ProjectRow>();
  return results.map(rowToProject);
}

// Save a project (upsert)
export async function saveProject(project: MockProject): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO projects (id, user_id, user_slug, name, slug, description, endpoints, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_slug, slug) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         endpoints = excluded.endpoints,
         updated_at = excluded.updated_at`
    )
    .bind(
      project.id,
      project.userId,
      project.userSlug,
      project.name,
      project.slug,
      project.description,
      JSON.stringify(project.endpoints),
      project.createdAt,
      project.updatedAt
    )
    .run();
}

// Delete a project
export async function deleteProject(userSlug: string, slug: string): Promise<boolean> {
  const db = await getDB();
  const result = await db
    .prepare("DELETE FROM projects WHERE user_slug = ? AND slug = ?")
    .bind(userSlug, slug)
    .run();
  return result.meta.changes > 0;
}

// Check if a slug exists for a given user
export async function slugExistsForUser(userSlug: string, slug: string): Promise<boolean> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT 1 FROM projects WHERE user_slug = ? AND slug = ?")
    .bind(userSlug, slug)
    .first();
  return row !== null;
}

// Check if a user owns a project
export async function userOwnsProject(userId: string, userSlug: string, slug: string): Promise<boolean> {
  const db = await getDB();
  const row = await db
    .prepare("SELECT 1 FROM projects WHERE user_id = ? AND user_slug = ? AND slug = ?")
    .bind(userId, userSlug, slug)
    .first();
  return row !== null;
}

// Log a mock request for analytics
export async function logRequest(
  userSlug: string,
  projectSlug: string,
  method: string,
  path: string,
  statusCode: number,
  responseTimeMs: number
): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      "INSERT INTO request_logs (user_slug, project_slug, method, path, status_code, response_time_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
    )
    .bind(userSlug, projectSlug, method, path, statusCode, responseTimeMs)
    .run();
}

// Get analytics for a project
export interface ProjectStats {
  totalCalls: number;
  last24h: number;
  avgResponseMs: number;
  topEndpoints: { method: string; path: string; count: number }[];
}

export async function getProjectStats(userSlug: string, projectSlug: string): Promise<ProjectStats> {
  const db = await getDB();

  const total = await db
    .prepare("SELECT COUNT(*) as cnt FROM request_logs WHERE user_slug = ? AND project_slug = ?")
    .bind(userSlug, projectSlug)
    .first<{ cnt: number }>();

  const last24h = await db
    .prepare(
      "SELECT COUNT(*) as cnt FROM request_logs WHERE user_slug = ? AND project_slug = ? AND created_at > datetime('now', '-1 day')"
    )
    .bind(userSlug, projectSlug)
    .first<{ cnt: number }>();

  const avgMs = await db
    .prepare(
      "SELECT AVG(response_time_ms) as avg_ms FROM request_logs WHERE user_slug = ? AND project_slug = ?"
    )
    .bind(userSlug, projectSlug)
    .first<{ avg_ms: number | null }>();

  const { results: topEndpoints } = await db
    .prepare(
      "SELECT method, path, COUNT(*) as cnt FROM request_logs WHERE user_slug = ? AND project_slug = ? GROUP BY method, path ORDER BY cnt DESC LIMIT 5"
    )
    .bind(userSlug, projectSlug)
    .all<{ method: string; path: string; cnt: number }>();

  return {
    totalCalls: total?.cnt ?? 0,
    last24h: last24h?.cnt ?? 0,
    avgResponseMs: Math.round(avgMs?.avg_ms ?? 0),
    topEndpoints: topEndpoints.map((r) => ({ method: r.method, path: r.path, count: r.cnt })),
  };
}
