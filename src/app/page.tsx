import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />

        <nav className="relative z-10 max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-xl tracking-tight">Mocka</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#docs" className="text-sm text-muted hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create Mock
            </Link>
            <a href="https://github.com/khalilbenaz/mocka" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <ThemeToggle />
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
            <span className="text-sm text-muted">Free &amp; open source</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Mock anything.
            <br />
            <span className="text-accent">Instantly.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            Create mock API servers in seconds. Define your endpoints, get a live URL,
            and test your frontend without waiting for the backend.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              Start Building
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto border border-border hover:border-muted text-foreground px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors">
              How It Works
            </Link>
          </div>

          {/* Code preview */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="bg-surface border border-border rounded-xl overflow-hidden text-left shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="ml-2 text-xs text-muted font-mono">mocka.qzz.io</span>
              </div>
              <pre className="p-5 text-sm font-mono overflow-x-auto">
                <code>
                  <span className="text-success">GET</span>
                  <span className="text-muted"> /api/users</span>
                  {"\n"}
                  <span className="text-muted">{"→ "}</span>
                  <span className="text-accent">200</span>{" "}
                  <span className="text-foreground/80">{`[{ "id": 1, "name": "Alice" }, ...]`}</span>
                  {"\n\n"}
                  <span className="text-[#3b82f6]">POST</span>
                  <span className="text-muted"> /api/users</span>
                  {"\n"}
                  <span className="text-muted">{"→ "}</span>
                  <span className="text-accent">201</span>{" "}
                  <span className="text-foreground/80">{`{ "id": 3, "created": true }`}</span>
                  {"\n\n"}
                  <span className="text-danger">DELETE</span>
                  <span className="text-muted"> /api/users/:id</span>
                  {"\n"}
                  <span className="text-muted">{"→ "}</span>
                  <span className="text-accent">204</span>{" "}
                  <span className="text-foreground/80">No Content</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need to mock</h2>
          <p className="text-muted text-center mb-16 max-w-xl mx-auto">No complex setup. No backend needed. Just define and go.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "{ }", title: "Any Response", desc: "JSON, XML, HTML, plain text — return anything with custom status codes and headers." },
              { icon: "//", title: "All HTTP Methods", desc: "GET, POST, PUT, PATCH, DELETE — mock any endpoint with any method." },
              { icon: "ms", title: "Simulated Latency", desc: "Add custom delays to simulate real-world network conditions and loading states." },
              { icon: "<>", title: "CORS Ready", desc: "All mock endpoints come with CORS headers enabled by default. No config needed." },
              { icon: "#", title: "Shareable URLs", desc: "Each mock project gets a unique URL. Share it with your team instantly." },
              { icon: "->", title: "Export Config", desc: "Export your mock configuration as JSON. Import it later or share it across projects." },
            ].map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono font-bold text-sm mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 border-t border-border bg-surface/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Three steps. That&apos;s it.</h2>
          <div className="space-y-12">
            {[
              { step: "01", title: "Define your endpoints", desc: "Choose HTTP methods, set paths, and write your response bodies. Add headers and delays if needed." },
              { step: "02", title: "Get your mock URL", desc: "Your mock server is instantly available at a unique URL. No deployment needed." },
              { step: "03", title: "Start building", desc: "Point your frontend to your mock URL and develop without waiting for the real API." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="text-4xl font-bold text-accent/30 font-mono shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/create" className="inline-flex bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-105">
              Create Your First Mock
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section id="docs" className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Documentation</h2>
          <p className="text-muted text-center mb-16 max-w-2xl mx-auto">Everything you need to use Mocka from the UI or programmatically via API.</p>

          {/* How it works */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">1</span>
              How It Works
            </h3>
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="text-xs text-success uppercase tracking-wide mb-2 font-semibold">Creating &amp; managing mocks</div>
                  <p className="text-sm text-muted leading-relaxed">
                    Sign in, go to <Link href="/create" className="text-accent hover:underline">/create</Link>, define your endpoints, and click Create.
                    Manage everything from the <Link href="/dashboard" className="text-accent hover:underline">dashboard</Link>. Authentication is handled automatically.
                  </p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="text-xs text-accent uppercase tracking-wide mb-2 font-semibold">Using your mocks (public)</div>
                  <p className="text-sm text-muted leading-relaxed">
                    Your mock endpoints are publicly accessible — no auth, no API key.
                    Just call the URL from your frontend, Postman, curl, or anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manage */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">2</span>
              Create &amp; Manage Mocks
            </h3>
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="space-y-3">
                {[
                  { step: "1", text: <>Go to <Link href="/create" className="text-accent hover:underline font-medium">/create</Link> and sign in with GitHub or email</> },
                  { step: "2", text: "Name your project, set a slug, and add your endpoints" },
                  { step: "3", text: <>Click <strong className="text-foreground">Create Mock Server</strong> — your API is live instantly</> },
                  { step: "4", text: <>Edit, delete, export or add endpoints from the <Link href="/dashboard" className="text-accent hover:underline font-medium">dashboard</Link></> },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold font-mono">{s.step}</span>
                    <p className="text-sm text-muted leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted pt-2 border-t border-border">
                You can also import a <code className="bg-surface-2 px-1 py-0.5 rounded text-accent">.json</code> config file on the create page to set up a project in one click.
              </p>
            </div>
          </div>

          {/* Serving mocks */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">3</span>
              Use Your Mocks (Public)
            </h3>
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <p className="text-sm text-muted">
                Mock endpoints are served at <code className="bg-surface-2 px-1.5 py-0.5 rounded text-accent text-xs">/api/mock/{'{'}<span className="text-warning">userSlug</span>{'}'}/{'{'}<span className="text-warning">slug</span>{'}'}/{'{'}<span className="text-warning">path</span>{'}'}</code> — no auth required.
              </p>
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <pre className="p-4 text-xs font-mono text-foreground/80 overflow-x-auto leading-relaxed">{`# List users
curl https://mocka.qzz.io/api/mock/2mojs3/my-api/users

# Get user by ID (path param :id → 42)
curl https://mocka.qzz.io/api/mock/2mojs3/my-api/users/42

# Create user
curl -X POST https://mocka.qzz.io/api/mock/2mojs3/my-api/users

# Delete user
curl -X DELETE https://mocka.qzz.io/api/mock/2mojs3/my-api/users/42`}</pre>
              </div>
              <p className="text-sm text-muted">
                Visit the base URL without a path to see the <strong className="text-foreground">Swagger page</strong> listing all endpoints:
                <code className="bg-surface-2 px-1.5 py-0.5 rounded text-accent text-xs ml-1">/api/mock/2mojs3/my-api</code>
              </p>
            </div>
          </div>

          {/* Templating */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">4</span>
              Response Templating
            </h3>
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50">
                    <th className="text-left px-5 py-3 text-muted font-medium text-xs uppercase tracking-wide">Template</th>
                    <th className="text-left px-5 py-3 text-muted font-medium text-xs uppercase tracking-wide">Output</th>
                    <th className="text-left px-5 py-3 text-muted font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tpl: "{{id}}", out: "42", desc: "Path parameter value" },
                    { tpl: "{{params.id}}", out: "42", desc: "Explicit path param" },
                    { tpl: "{{timestamp}}", out: "2025-03-29T10:30:00Z", desc: "ISO 8601 date" },
                    { tpl: "{{randomId}}", out: "a1b2c3d4", desc: "Random 8-char string" },
                    { tpl: "{{randomInt}}", out: "7342", desc: "Random 0–10000" },
                    { tpl: "{{now}}", out: "1711705800000", desc: "Epoch ms" },
                  ].map((t) => (
                    <tr key={t.tpl} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-mono text-accent text-xs">{t.tpl}</td>
                      <td className="px-5 py-3 font-mono text-foreground/70 text-xs">{t.out}</td>
                      <td className="px-5 py-3 text-muted text-xs hidden sm:table-cell">{t.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Path params */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">5</span>
              Path Parameters
            </h3>
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
              <p className="text-sm text-muted mb-4">
                Use <code className="bg-surface-2 px-1.5 py-0.5 rounded text-accent text-xs">:param</code> in your paths. They are extracted and available in templates.
              </p>
              {[
                { pattern: "/users/:id", url: "/users/42", params: '{ "id": "42" }' },
                { pattern: "/posts/:postId/comments/:commentId", url: "/posts/5/comments/12", params: '{ "postId": "5", "commentId": "12" }' },
              ].map((p) => (
                <div key={p.pattern} className="bg-background border border-border rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono">
                  <span className="text-accent">{p.pattern}</span>
                  <span className="text-muted hidden sm:inline">+</span>
                  <span className="text-foreground/70">{p.url}</span>
                  <span className="text-muted hidden sm:inline">=</span>
                  <span className="text-success">{p.params}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Endpoint schema */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">6</span>
              Endpoint Schema
            </h3>
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50">
                    <th className="text-left px-5 py-3 text-muted font-medium text-xs uppercase tracking-wide">Field</th>
                    <th className="text-left px-5 py-3 text-muted font-medium text-xs uppercase tracking-wide">Type</th>
                    <th className="text-left px-5 py-3 text-muted font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: "id", type: "string", desc: "Unique endpoint ID" },
                    { field: "method", type: "string", desc: "GET | POST | PUT | PATCH | DELETE" },
                    { field: "path", type: "string", desc: 'URL path, e.g. "/users/:id"' },
                    { field: "statusCode", type: "number", desc: "HTTP status code (100–599)" },
                    { field: "responseBody", type: "string", desc: "Response content (supports templating)" },
                    { field: "contentType", type: "string", desc: 'MIME type, e.g. "application/json"' },
                    { field: "headers", type: "object", desc: "Custom response headers" },
                    { field: "delay", type: "number", desc: "Simulated latency in ms" },
                  ].map((f) => (
                    <tr key={f.field} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-mono text-accent text-xs">{f.field}</td>
                      <td className="px-5 py-3 font-mono text-foreground/70 text-xs">{f.type}</td>
                      <td className="px-5 py-3 text-muted text-xs hidden sm:table-cell">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Import / Export */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">7</span>
              Import &amp; Export
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-xl p-5">
                <h4 className="font-semibold mb-2 text-sm">Export</h4>
                <p className="text-sm text-muted leading-relaxed">
                  From the <Link href="/dashboard" className="text-accent hover:underline">dashboard</Link>, click <strong className="text-foreground">Export</strong> on any project to download a <code className="bg-surface-2 px-1 py-0.5 rounded text-accent text-xs">.json</code> file.
                </p>
              </div>
              <div className="bg-surface border border-border rounded-xl p-5">
                <h4 className="font-semibold mb-2 text-sm">Import</h4>
                <p className="text-sm text-muted leading-relaxed">
                  On the <Link href="/create" className="text-accent hover:underline">create page</Link>, click <strong className="text-foreground">Import JSON</strong> to load a config file. Or import via API:
                </p>
                <pre className="mt-2 text-xs font-mono text-accent overflow-x-auto">curl -X POST /api/mocks -d @mock.json</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-xs">M</div>
              <span>Mocka</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/khalilbenaz/mocka" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <span className="font-mono text-accent">qzz.io</span>
            </div>
          </div>
          <div className="flex justify-center">
            <a href="https://dash.domain.digitalplat.org/signup?ref=jfs4BIQ0Mw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-3 py-2 border border-border rounded-xl bg-surface text-foreground text-xs no-underline hover:border-accent/30 transition-colors">
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wide">DigitalPlat</span>
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold text-xs">Powered by DigitalPlat FreeDomain</span>
                <span className="text-muted text-[10px]">Get a free domain from DigitalPlat.</span>
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
