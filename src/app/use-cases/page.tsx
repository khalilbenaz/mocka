import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Mock API Use Cases — Mocka | Free Mock Server",
  description: "Create mock REST APIs for e-commerce, payments, authentication, social media, weather, and more. Free mock server with instant URLs.",
  keywords: ["mock API", "fake API", "mock REST API", "API testing", "mock server", "mock e-commerce API", "mock payment API"],
};

const USE_CASES = [
  {
    slug: "e-commerce",
    title: "E-Commerce API",
    desc: "Products, cart, orders, reviews, payments, wishlist. Perfect for building online stores.",
    endpoints: ["GET /products", "POST /cart/items", "POST /orders", "GET /users/me"],
    tags: ["products", "cart", "orders", "payments"],
    color: "text-accent",
  },
  {
    slug: "auth",
    title: "Authentication API",
    desc: "Login, register, refresh tokens, password reset, user profile. For auth flow prototyping.",
    endpoints: ["POST /auth/login", "POST /auth/register", "POST /auth/refresh", "GET /auth/me"],
    tags: ["JWT", "OAuth", "sessions"],
    color: "text-success",
  },
  {
    slug: "social-media",
    title: "Social Media API",
    desc: "Posts, comments, likes, followers, feeds. Build social features fast.",
    endpoints: ["GET /feed", "POST /posts", "POST /posts/:id/like", "GET /users/:id/followers"],
    tags: ["posts", "comments", "likes", "feed"],
    color: "text-[#3b82f6]",
  },
  {
    slug: "payment",
    title: "Payment API",
    desc: "Charges, refunds, payment methods, invoices. Simulate Stripe-like flows.",
    endpoints: ["POST /charges", "POST /refunds", "GET /payment-methods", "GET /invoices"],
    tags: ["Stripe-like", "charges", "refunds"],
    color: "text-warning",
  },
  {
    slug: "cms",
    title: "CMS / Blog API",
    desc: "Articles, categories, tags, authors, media. For headless CMS frontends.",
    endpoints: ["GET /articles", "GET /articles/:slug", "GET /categories", "GET /authors/:id"],
    tags: ["articles", "categories", "headless"],
    color: "text-danger",
  },
  {
    slug: "iot",
    title: "IoT / Devices API",
    desc: "Devices, sensors, readings, alerts, dashboards. For IoT dashboard prototyping.",
    endpoints: ["GET /devices", "GET /devices/:id/readings", "POST /alerts", "GET /dashboard/stats"],
    tags: ["sensors", "readings", "alerts"],
    color: "text-[#8b5cf6]",
  },
  {
    slug: "weather",
    title: "Weather API",
    desc: "Current weather, forecasts, historical data, alerts. Simulate weather services.",
    endpoints: ["GET /weather/current", "GET /weather/forecast", "GET /weather/history", "GET /alerts"],
    tags: ["forecast", "temperature", "alerts"],
    color: "text-[#06b6d4]",
  },
  {
    slug: "chat",
    title: "Chat / Messaging API",
    desc: "Conversations, messages, typing indicators, read receipts. For chat UI development.",
    endpoints: ["GET /conversations", "POST /messages", "GET /messages/:convId", "PATCH /messages/:id/read"],
    tags: ["messages", "conversations", "real-time"],
    color: "text-[#ec4899]",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-bold text-lg tracking-tight">Mocka</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/gallery" className="text-sm text-muted hover:text-foreground transition-colors">Gallery</Link>
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">Create Mock</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Mock APIs for Every Use Case</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">Create realistic mock APIs in seconds. Pick a use case, customize the endpoints, and get a live URL instantly.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {USE_CASES.map((uc) => (
            <div key={uc.slug} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
              <h2 className={`text-xl font-bold mb-2 ${uc.color}`}>{uc.title}</h2>
              <p className="text-sm text-muted mb-4 leading-relaxed">{uc.desc}</p>
              <div className="space-y-1.5 mb-4">
                {uc.endpoints.map((ep) => {
                  const [method, ...rest] = ep.split(" ");
                  return (
                    <div key={ep} className="flex items-center gap-2 text-xs font-mono">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${method === "GET" ? "method-get" : method === "POST" ? "method-post" : method === "PATCH" ? "method-patch" : "method-put"}`}>{method}</span>
                      <span className="text-foreground/70">{rest.join(" ")}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {uc.tags.map((t) => (
                    <span key={t} className="text-[10px] text-muted bg-surface-2 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
                <Link href="/create" className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
                  Use this template &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
