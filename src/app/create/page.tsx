"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import EndpointForm from "@/components/EndpointForm";
import { useAuth } from "@/lib/auth";
import { MockEndpoint } from "@/lib/types";
import { generateId, generateSlug, methodColor, userIdToSlug } from "@/lib/utils";

export default function CreatePage() {
  const router = useRouter();
  const { user, login, loading, getToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<MockEndpoint | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addEndpoint = (endpoint: MockEndpoint) => {
    if (editingEndpoint) {
      setEndpoints(endpoints.map((e) => (e.id === endpoint.id ? endpoint : e)));
    } else {
      setEndpoints([...endpoints, endpoint]);
    }
    setShowForm(false);
    setEditingEndpoint(undefined);
  };

  const removeEndpoint = (id: string) => {
    setEndpoints(endpoints.filter((e) => e.id !== id));
  };

  const editEndpoint = (endpoint: MockEndpoint) => {
    setEditingEndpoint(endpoint);
    setShowForm(true);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    if (endpoints.length === 0) {
      setError("Add at least one endpoint");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = getToken();
      const res = await fetch("/api/mocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: generateId(),
          name: name.trim(),
          slug: generateSlug(name),
          description: description.trim(),
          endpoints,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create mock");
      }

      const project = await res.json();
      router.push(`/dashboard?created=${project.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.name) setName(data.name);
        if (data.description) setDescription(data.description);
        if (Array.isArray(data.endpoints)) {
          setEndpoints(
            data.endpoints.map((ep: MockEndpoint) => ({ ...ep, id: ep.id || generateId() }))
          );
        }
      } catch {
        setError("Invalid JSON file");
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20 text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            M
          </div>
          <h2 className="text-xl font-bold mb-2">Sign in to create mocks</h2>
          <p className="text-sm text-muted mb-6">Create an account to start building mock servers.</p>
          <div className="flex justify-center gap-3">
            <button onClick={login} className="text-sm text-muted hover:text-foreground border border-border px-4 py-2 rounded-lg transition-colors">
              Login
            </button>
            <button onClick={login} className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Create Mock Server</h1>
            <p className="text-sm text-muted mt-1">Define your endpoints and get a live URL</p>
          </div>
          <button
            onClick={handleImport}
            className="text-sm text-muted hover:text-foreground border border-border hover:border-muted px-3 py-1.5 rounded-lg transition-colors"
          >
            Import JSON
          </button>
        </div>

        {/* Project info */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="My API Mock"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
              {name && (
                <p className="text-xs text-muted mt-1">
                  URL: <span className="text-accent font-mono">/api/mock/{user ? userIdToSlug(user.id) : "..."}/{generateSlug(name)}/...</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mock server for my frontend project"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Endpoints list */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              Endpoints{" "}
              <span className="text-muted font-normal text-sm">({endpoints.length})</span>
            </h2>
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setEditingEndpoint(undefined); }}
                className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
              >
                + Add Endpoint
              </button>
            )}
          </div>

          {showForm && (
            <div className="border border-border rounded-lg p-4 mb-4 bg-background">
              <EndpointForm
                endpoint={editingEndpoint}
                onSave={addEndpoint}
                onCancel={() => { setShowForm(false); setEditingEndpoint(undefined); }}
              />
            </div>
          )}

          {endpoints.length === 0 && !showForm ? (
            <div className="text-center py-12 text-muted">
              <p className="text-sm">No endpoints yet. Add your first one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {endpoints.map((ep) => (
                <div
                  key={ep.id}
                  className="flex items-center justify-between px-4 py-3 bg-background border border-border rounded-lg group"
                >
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${methodColor(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span>{ep.path}</span>
                    <span className="text-muted">→</span>
                    <span className="text-accent">{ep.statusCode}</span>
                    {ep.delay > 0 && <span className="text-muted text-xs">+{ep.delay}ms</span>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => editEndpoint(ep)}
                      className="text-xs text-muted hover:text-foreground px-2 py-1 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeEndpoint(ep.id)}
                      className="text-xs text-danger hover:text-danger/80 px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-[1.01]"
        >
          {saving ? "Creating..." : "Create Mock Server"}
        </button>
      </div>
    </div>
  );
}
