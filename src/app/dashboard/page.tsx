"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MockProject } from "@/lib/types";
import { methodColor, copyToClipboard } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background"><Navbar /><div className="text-center py-20 text-muted">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const created = searchParams.get("created");

  const [projects, setProjects] = useState<MockProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(created);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/mocks");
      const data = await res.json();
      setProjects(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this mock project?")) return;
    await fetch(`/api/mocks?slug=${slug}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.slug !== slug));
  };

  const handleCopy = async (slug: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    await copyToClipboard(`${baseUrl}/api/mock/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleExport = (project: MockProject) => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.slug}-mock.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted mt-1">Manage your mock servers</p>
          </div>
          <Link
            href="/create"
            className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + New Mock
          </Link>
        </div>

        {created && (
          <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 mb-6 text-sm">
            Mock server <span className="font-mono font-bold">{created}</span> created
            successfully!
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-muted">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-muted">M</span>
            </div>
            <h3 className="font-semibold mb-2">No mock servers yet</h3>
            <p className="text-sm text-muted mb-6">
              Create your first mock server to get started.
            </p>
            <Link
              href="/create"
              className="inline-flex bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Create Mock Server
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="bg-surface border border-border rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-surface-2/50 transition-colors"
                  onClick={() =>
                    setExpandedSlug(expandedSlug === project.slug ? null : project.slug)
                  }
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded">
                        {project.endpoints.length} endpoint
                        {project.endpoints.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted mt-1">{project.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(project.slug);
                      }}
                      className="text-xs text-muted hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {copiedSlug === project.slug ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(project);
                      }}
                      className="text-xs text-muted hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Export
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.slug);
                      }}
                      className="text-xs text-danger hover:text-danger/80 border border-danger/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {expandedSlug === project.slug && (
                  <div className="border-t border-border px-6 py-4">
                    {/* Base URL */}
                    <div className="bg-background border border-border rounded-lg px-4 py-3 mb-4 font-mono text-sm">
                      <span className="text-muted">Base URL: </span>
                      <span className="text-accent">
                        {typeof window !== "undefined" ? window.location.origin : ""}/api/mock/
                        {project.slug}
                      </span>
                    </div>

                    {/* Endpoints */}
                    <div className="space-y-2">
                      {project.endpoints.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-3 font-mono text-sm">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${methodColor(ep.method)}`}
                            >
                              {ep.method}
                            </span>
                            <span>{ep.path}</span>
                            <span className="text-muted">→</span>
                            <span className="text-accent">{ep.statusCode}</span>
                            {ep.delay > 0 && (
                              <span className="text-muted text-xs">+{ep.delay}ms</span>
                            )}
                          </div>
                          <span className="text-xs text-muted">{ep.contentType}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick test */}
                    <div className="mt-4 text-xs text-muted">
                      Test with:{" "}
                      <code className="bg-surface-2 px-2 py-1 rounded text-accent">
                        curl{" "}
                        {typeof window !== "undefined" ? window.location.origin : ""}/api/mock/
                        {project.slug}
                        {project.endpoints[0]?.path || "/"}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
