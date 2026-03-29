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
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create Mock
            </Link>
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

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-xs">M</div>
            <span>Mocka</span>
          </div>
          <span className="font-mono text-accent">qzz.io</span>
        </div>
      </footer>
    </div>
  );
}
