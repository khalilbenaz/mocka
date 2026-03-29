"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

interface GalleryTemplate {
  name: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  endpoints: { method: string; path: string; desc: string }[];
  jsonFile: string;
}

const TEMPLATES: GalleryTemplate[] = [
  {
    name: "E-Commerce API",
    description: "Full shopping experience — products, cart, orders, reviews, payments, wishlist, notifications. 24 endpoints.",
    icon: "🛒",
    color: "text-accent",
    tags: ["products", "cart", "orders", "payments", "reviews"],
    endpoints: [
      { method: "GET", path: "/products", desc: "List products with pagination" },
      { method: "GET", path: "/products/:id", desc: "Product detail with specs" },
      { method: "POST", path: "/cart/items", desc: "Add item to cart" },
      { method: "POST", path: "/orders", desc: "Place an order" },
      { method: "GET", path: "/users/me", desc: "User profile with loyalty" },
      { method: "POST", path: "/payments/charge", desc: "Process payment" },
    ],
    jsonFile: "/gallery/e-commerce-api.json",
  },
  {
    name: "Authentication API",
    description: "Complete auth flow — login, register, token refresh, password reset, profile management. JWT-style responses.",
    icon: "🔐",
    color: "text-success",
    tags: ["JWT", "login", "register", "tokens", "OAuth"],
    endpoints: [
      { method: "POST", path: "/auth/login", desc: "Login with email/password" },
      { method: "POST", path: "/auth/register", desc: "Create new account" },
      { method: "POST", path: "/auth/refresh", desc: "Refresh access token" },
      { method: "POST", path: "/auth/forgot-password", desc: "Send reset email" },
      { method: "GET", path: "/auth/me", desc: "Get current user" },
      { method: "PATCH", path: "/auth/me", desc: "Update profile" },
    ],
    jsonFile: "/gallery/auth-api.json",
  },
  {
    name: "Social Media API",
    description: "Posts, comments, likes, followers, feed, stories. Build social features without a backend.",
    icon: "💬",
    color: "text-[#3b82f6]",
    tags: ["posts", "comments", "likes", "followers", "feed"],
    endpoints: [
      { method: "GET", path: "/feed", desc: "Personalized feed" },
      { method: "POST", path: "/posts", desc: "Create a post" },
      { method: "POST", path: "/posts/:id/like", desc: "Like a post" },
      { method: "GET", path: "/posts/:id/comments", desc: "List comments" },
      { method: "GET", path: "/users/:id/followers", desc: "User followers" },
      { method: "GET", path: "/stories", desc: "Active stories" },
    ],
    jsonFile: "/gallery/social-api.json",
  },
  {
    name: "Payment API",
    description: "Stripe-like payment flows — charges, refunds, customers, invoices, payment methods, webhooks.",
    icon: "💳",
    color: "text-warning",
    tags: ["charges", "refunds", "invoices", "Stripe-like"],
    endpoints: [
      { method: "POST", path: "/charges", desc: "Create a charge" },
      { method: "POST", path: "/refunds", desc: "Refund a charge" },
      { method: "GET", path: "/customers/:id", desc: "Get customer" },
      { method: "GET", path: "/invoices", desc: "List invoices" },
      { method: "GET", path: "/payment-methods", desc: "Saved methods" },
      { method: "POST", path: "/checkout/sessions", desc: "Start checkout" },
    ],
    jsonFile: "/gallery/payment-api.json",
  },
  {
    name: "Blog / CMS API",
    description: "Articles, categories, tags, authors, media uploads. Perfect for headless CMS frontends.",
    icon: "📝",
    color: "text-danger",
    tags: ["articles", "categories", "authors", "headless CMS"],
    endpoints: [
      { method: "GET", path: "/articles", desc: "List articles" },
      { method: "GET", path: "/articles/:slug", desc: "Article by slug" },
      { method: "GET", path: "/categories", desc: "All categories" },
      { method: "GET", path: "/authors/:id", desc: "Author profile" },
      { method: "GET", path: "/tags", desc: "All tags" },
      { method: "POST", path: "/articles", desc: "Create article" },
    ],
    jsonFile: "/gallery/blog-api.json",
  },
  {
    name: "Weather API",
    description: "Current weather, 7-day forecast, historical data, alerts. Simulate weather services for dashboards.",
    icon: "🌤️",
    color: "text-[#06b6d4]",
    tags: ["forecast", "temperature", "alerts", "historical"],
    endpoints: [
      { method: "GET", path: "/weather/current", desc: "Current conditions" },
      { method: "GET", path: "/weather/forecast", desc: "7-day forecast" },
      { method: "GET", path: "/weather/history", desc: "Historical data" },
      { method: "GET", path: "/weather/alerts", desc: "Active alerts" },
      { method: "GET", path: "/weather/cities/:id", desc: "City weather" },
      { method: "GET", path: "/weather/search/:query", desc: "Search cities" },
    ],
    jsonFile: "/gallery/weather-api.json",
  },
  {
    name: "Chat / Messaging API",
    description: "Conversations, messages, typing indicators, read receipts, contacts. For chat UI development.",
    icon: "💭",
    color: "text-[#ec4899]",
    tags: ["messages", "conversations", "contacts", "real-time"],
    endpoints: [
      { method: "GET", path: "/conversations", desc: "List conversations" },
      { method: "GET", path: "/conversations/:id/messages", desc: "Get messages" },
      { method: "POST", path: "/messages", desc: "Send message" },
      { method: "PATCH", path: "/messages/:id/read", desc: "Mark as read" },
      { method: "GET", path: "/contacts", desc: "Contact list" },
      { method: "DELETE", path: "/messages/:id", desc: "Delete message" },
    ],
    jsonFile: "/gallery/chat-api.json",
  },
  {
    name: "IoT / Devices API",
    description: "Devices, sensors, readings, alerts, dashboards. Prototype IoT monitoring interfaces.",
    icon: "📡",
    color: "text-[#8b5cf6]",
    tags: ["devices", "sensors", "readings", "alerts"],
    endpoints: [
      { method: "GET", path: "/devices", desc: "List all devices" },
      { method: "GET", path: "/devices/:id/readings", desc: "Sensor readings" },
      { method: "POST", path: "/devices/:id/command", desc: "Send command" },
      { method: "GET", path: "/alerts", desc: "Active alerts" },
      { method: "GET", path: "/dashboard/stats", desc: "Dashboard stats" },
      { method: "POST", path: "/devices", desc: "Register device" },
    ],
    jsonFile: "/gallery/iot-api.json",
  },
];

const METHOD_BADGE: Record<string, string> = {
  GET: "method-get", POST: "method-post", PUT: "method-put", PATCH: "method-patch", DELETE: "method-delete",
};

function buildTemplateData(tpl: GalleryTemplate) {
  return {
    name: tpl.name,
    description: tpl.description,
    endpoints: tpl.endpoints.map((ep, i) => ({
      id: `tpl_${i}`,
      method: ep.method,
      path: ep.path,
      statusCode: ep.method === "POST" ? 201 : ep.method === "DELETE" ? 204 : 200,
      responseBody: ep.method === "DELETE" ? "" : `{"message": "${ep.desc}"}`,
      contentType: "application/json",
      headers: {},
      delay: 0,
    })),
  };
}

export default function GalleryPage() {
  const router = useRouter();

  const handleUseTemplate = (tpl: GalleryTemplate) => {
    const data = buildTemplateData(tpl);
    localStorage.setItem("mocka-import-template", JSON.stringify(data));
    router.push("/create?from=gallery");
  };
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
            <Link href="/use-cases" className="text-sm text-muted hover:text-foreground transition-colors">Use Cases</Link>
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">Create Mock</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Mock API Gallery</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Ready-to-use mock APIs. Browse, explore the endpoints, or download the JSON to import into your own Mocka project.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
        {TEMPLATES.map((tpl) => (
          <div key={tpl.name} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/20 transition-colors">
            {/* Header */}
            <div className="px-6 py-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tpl.icon}</span>
                <div>
                  <h2 className={`text-xl font-bold ${tpl.color}`}>{tpl.name}</h2>
                  <p className="text-sm text-muted mt-1 leading-relaxed max-w-xl">{tpl.description}</p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {tpl.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-muted bg-surface-2 border border-border px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleUseTemplate(tpl)}
                className="shrink-0 text-xs bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Use Template
              </button>
            </div>

            {/* Endpoints */}
            <div className="border-t border-border divide-y divide-border">
              {tpl.endpoints.map((ep) => (
                <div key={`${ep.method}-${ep.path}`} className="px-6 py-2.5 flex items-center gap-3">
                  <span className={`shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded ${METHOD_BADGE[ep.method]}`}>{ep.method}</span>
                  <code className="text-sm font-mono text-foreground/90">{ep.path}</code>
                  <span className="ml-auto text-xs text-muted hidden sm:inline">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">M</div>
            <span>Mocka</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/khalilbenaz/mocka" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <span className="font-mono text-accent">qzz.io</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
