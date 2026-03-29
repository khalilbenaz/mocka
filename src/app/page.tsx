import Link from "next/link";
import { getAllProjects } from "@/lib/store";
import type { MockProject, HttpMethod } from "@/lib/types";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "method-get",
  POST: "method-post",
  PUT: "method-put",
  PATCH: "method-patch",
  DELETE: "method-delete",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="font-bold text-lg tracking-tight">Mocka</span>
            <span className="text-xs text-muted font-mono ml-2 hidden sm:inline">API Catalog</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create Mock
            </Link>
          </div>
        </div>
      </nav>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Mock API Catalog</h1>
        <p className="text-muted text-sm">
          {projects.length} mock{projects.length !== 1 ? "s" : ""} available — all endpoints are publicly accessible.
        </p>
      </div>

      {/* Project list */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-6">
        {projects.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted text-lg mb-4">No mocks yet.</p>
            <Link href="/create" className="text-accent hover:underline font-medium">
              Create the first one
            </Link>
          </div>
        )}

        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">M</div>
            <span>Mocka</span>
          </div>
          <span className="font-mono text-accent">qzz.io</span>
        </div>
      </footer>
    </div>
  );
}

function ProjectCard({ project }: { project: MockProject }) {
  const baseUrl = `/api/mock/${project.userSlug}/${project.slug}`;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Project header */}
      <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg">{project.name}</h2>
          {project.description && (
            <p className="text-muted text-sm mt-0.5">{project.description}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="text-xs font-mono text-muted bg-surface-2 border border-border rounded px-2 py-1">
            {project.endpoints.length} endpoint{project.endpoints.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Base URL */}
      <div className="px-5 py-2.5 bg-surface-2/50 border-b border-border">
        <span className="text-xs text-muted">Base URL:</span>{" "}
        <code className="text-xs font-mono text-accent">
          mocka.qzz.io{baseUrl}
        </code>
      </div>

      {/* Endpoints */}
      <div className="divide-y divide-border">
        {project.endpoints.map((ep) => (
          <div key={ep.id} className="px-5 py-3 flex items-center gap-3 hover:bg-surface-2/30 transition-colors">
            <span className={`shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded ${METHOD_COLORS[ep.method]}`}>
              {ep.method}
            </span>
            <code className="text-sm font-mono text-foreground/90 truncate">
              {ep.path}
            </code>
            <span className="ml-auto shrink-0 text-xs font-mono text-muted">
              {ep.statusCode}
            </span>
            <span className="shrink-0 text-xs text-muted hidden sm:inline">
              {ep.contentType}
            </span>
            {ep.delay > 0 && (
              <span className="shrink-0 text-xs text-warning font-mono hidden sm:inline">
                {ep.delay}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
