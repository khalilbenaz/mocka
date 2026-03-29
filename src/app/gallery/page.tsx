import Link from "next/link";
import { getAllProjects } from "@/lib/store";
import type { MockProject, HttpMethod } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "method-get", POST: "method-post", PUT: "method-put", PATCH: "method-patch", DELETE: "method-delete",
};

export default async function GalleryPage() {
  const projects = await getAllProjects();
  const publicProjects = projects.filter((p) => p.isPublic !== false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-bold text-lg tracking-tight">Mocka</span>
            <span className="text-xs text-muted font-mono ml-2">Gallery</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">Create Mock</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mock API Gallery</h1>
        <p className="text-muted max-w-2xl">Browse public mock APIs, clone them, or use them directly. {publicProjects.length} mock{publicProjects.length !== 1 ? "s" : ""} available.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {publicProjects.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted text-lg mb-4">No public mocks yet.</p>
            <Link href="/create" className="text-accent hover:underline font-medium">Create the first one</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicProjects.map((project) => (
              <GalleryCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryCard({ project }: { project: MockProject }) {
  const baseUrl = `/api/mock/${project.userSlug}/${project.slug}`;
  const methods = [...new Set(project.endpoints.map((e) => e.method))];

  return (
    <Link href={baseUrl} className="block bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold group-hover:text-accent transition-colors">{project.name}</h3>
          <span className="text-xs font-mono text-muted bg-surface-2 border border-border rounded px-2 py-0.5 shrink-0">
            {project.endpoints.length} ep
          </span>
        </div>
        {project.description && <p className="text-sm text-muted mb-3 line-clamp-2">{project.description}</p>}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {methods.map((m) => (
            <span key={m} className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${METHOD_COLORS[m]}`}>{m}</span>
          ))}
        </div>
        {project.tags && project.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-muted bg-surface-2 px-2 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="px-5 py-2.5 border-t border-border bg-surface-2/50">
        <code className="text-xs font-mono text-accent">mocka.qzz.io{baseUrl}</code>
      </div>
    </Link>
  );
}
