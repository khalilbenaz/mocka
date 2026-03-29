"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

// ─── Gallery templates (same as /gallery) ────────────────────────────────────

interface DemoAPI {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  baseUrl: string;
  endpoints: { method: string; path: string; desc: string }[];
}

const DEMO_APIS: DemoAPI[] = [
  {
    id: "e-commerce",
    name: "E-Commerce",
    icon: "🛒",
    color: "text-accent",
    description: "Products, cart, orders, reviews, payments, wishlist, notifications.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/e-commerce-api",
    endpoints: [
      { method: "GET", path: "/products", desc: "List all products" },
      { method: "GET", path: "/products/1", desc: "Product detail" },
      { method: "GET", path: "/products/search/mac", desc: "Search products" },
      { method: "GET", path: "/cart", desc: "View cart" },
      { method: "POST", path: "/cart/items", desc: "Add to cart" },
      { method: "POST", path: "/cart/coupon", desc: "Apply coupon" },
      { method: "GET", path: "/orders", desc: "List orders" },
      { method: "GET", path: "/orders/1", desc: "Order detail" },
      { method: "POST", path: "/orders", desc: "Place order" },
      { method: "GET", path: "/users/me", desc: "User profile" },
      { method: "GET", path: "/payments/methods", desc: "Payment methods" },
      { method: "POST", path: "/payments/charge", desc: "Process payment" },
      { method: "GET", path: "/products/1/reviews", desc: "Product reviews" },
      { method: "GET", path: "/categories", desc: "Categories" },
      { method: "GET", path: "/wishlist", desc: "Wishlist" },
      { method: "GET", path: "/notifications", desc: "Notifications" },
    ],
  },
  {
    id: "auth",
    name: "Authentication",
    icon: "🔐",
    color: "text-success",
    description: "Login, register, token refresh, password reset, profile.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/auth-api",
    endpoints: [
      { method: "POST", path: "/auth/login", desc: "Login" },
      { method: "POST", path: "/auth/register", desc: "Register" },
      { method: "POST", path: "/auth/refresh", desc: "Refresh token" },
      { method: "POST", path: "/auth/forgot-password", desc: "Forgot password" },
      { method: "GET", path: "/auth/me", desc: "Current user" },
      { method: "PATCH", path: "/auth/me", desc: "Update profile" },
    ],
  },
  {
    id: "social",
    name: "Social Media",
    icon: "💬",
    color: "text-[#3b82f6]",
    description: "Posts, comments, likes, followers, feed, stories.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/social-api",
    endpoints: [
      { method: "GET", path: "/feed", desc: "News feed" },
      { method: "POST", path: "/posts", desc: "Create post" },
      { method: "GET", path: "/posts/1/comments", desc: "Comments" },
      { method: "POST", path: "/posts/1/like", desc: "Like post" },
      { method: "GET", path: "/users/1/followers", desc: "Followers" },
      { method: "GET", path: "/stories", desc: "Stories" },
    ],
  },
  {
    id: "payment",
    name: "Payment",
    icon: "💳",
    color: "text-warning",
    description: "Charges, refunds, customers, invoices, checkout.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/payment-api",
    endpoints: [
      { method: "POST", path: "/charges", desc: "Create charge" },
      { method: "POST", path: "/refunds", desc: "Refund" },
      { method: "GET", path: "/customers/1", desc: "Customer" },
      { method: "GET", path: "/invoices", desc: "Invoices" },
      { method: "GET", path: "/payment-methods", desc: "Methods" },
      { method: "POST", path: "/checkout/sessions", desc: "Checkout" },
    ],
  },
  {
    id: "blog",
    name: "Blog / CMS",
    icon: "📝",
    color: "text-danger",
    description: "Articles, categories, tags, authors.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/blog-api",
    endpoints: [
      { method: "GET", path: "/articles", desc: "List articles" },
      { method: "GET", path: "/articles/hello-world", desc: "Article detail" },
      { method: "GET", path: "/categories", desc: "Categories" },
      { method: "GET", path: "/authors/1", desc: "Author" },
      { method: "GET", path: "/tags", desc: "Tags" },
      { method: "POST", path: "/articles", desc: "Create article" },
    ],
  },
  {
    id: "weather",
    name: "Weather",
    icon: "🌤️",
    color: "text-[#06b6d4]",
    description: "Current weather, forecasts, history, alerts.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/weather-api",
    endpoints: [
      { method: "GET", path: "/weather/current", desc: "Current" },
      { method: "GET", path: "/weather/forecast", desc: "Forecast" },
      { method: "GET", path: "/weather/history", desc: "History" },
      { method: "GET", path: "/weather/alerts", desc: "Alerts" },
      { method: "GET", path: "/weather/cities/1", desc: "City" },
      { method: "GET", path: "/weather/search/paris", desc: "Search" },
    ],
  },
  {
    id: "chat",
    name: "Chat",
    icon: "💭",
    color: "text-[#ec4899]",
    description: "Conversations, messages, contacts, read receipts.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/chat-api",
    endpoints: [
      { method: "GET", path: "/conversations", desc: "Conversations" },
      { method: "GET", path: "/conversations/1/messages", desc: "Messages" },
      { method: "POST", path: "/messages", desc: "Send" },
      { method: "PATCH", path: "/messages/1/read", desc: "Read" },
      { method: "GET", path: "/contacts", desc: "Contacts" },
      { method: "DELETE", path: "/messages/1", desc: "Delete" },
    ],
  },
  {
    id: "iot",
    name: "IoT",
    icon: "📡",
    color: "text-[#8b5cf6]",
    description: "Devices, sensors, readings, alerts, dashboard.",
    baseUrl: "https://mocka.qzz.io/api/mock/d045k8/iot-api",
    endpoints: [
      { method: "GET", path: "/devices", desc: "All devices" },
      { method: "GET", path: "/devices/1/readings", desc: "Readings" },
      { method: "POST", path: "/devices/1/command", desc: "Command" },
      { method: "GET", path: "/alerts", desc: "Alerts" },
      { method: "GET", path: "/dashboard/stats", desc: "Stats" },
      { method: "POST", path: "/devices", desc: "Register" },
    ],
  },
];

const METHOD_BADGE: Record<string, string> = {
  GET: "method-get", POST: "method-post", PUT: "method-put", PATCH: "method-patch", DELETE: "method-delete",
};

interface ApiLog {
  method: string;
  path: string;
  status: number;
  time: number;
  api: string;
}

interface EndpointResult {
  status: number;
  time: number;
  body: string;
}

export default function DemoPage() {
  const [selectedApi, setSelectedApi] = useState<DemoAPI>(DEMO_APIS[0]);
  const [results, setResults] = useState<Record<string, EndpointResult>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [apiLog, setApiLog] = useState<ApiLog[]>([]);

  const callEndpoint = useCallback(async (api: DemoAPI, ep: { method: string; path: string }) => {
    const key = `${api.id}:${ep.method}:${ep.path}`;
    setLoadingKey(key);

    const url = `${api.baseUrl}${ep.path}`;
    const start = Date.now();
    try {
      const res = await fetch(url, { method: ep.method });
      const time = Date.now() - start;
      const body = await res.text();
      let pretty = body;
      try { pretty = JSON.stringify(JSON.parse(body), null, 2); } catch { /* keep raw */ }

      setResults((prev) => ({ ...prev, [key]: { status: res.status, time, body: pretty } }));
      setApiLog((prev) => [{ method: ep.method, path: ep.path, status: res.status, time, api: api.name }, ...prev.slice(0, 29)]);
    } catch {
      setResults((prev) => ({ ...prev, [key]: { status: 0, time: Date.now() - start, body: "Network error" } }));
    }
    setLoadingKey(null);
  }, []);

  const callAll = async (api: DemoAPI) => {
    for (const ep of api.endpoints) {
      await callEndpoint(api, ep);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-lg tracking-tight">API Explorer</span>
            </Link>
            <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">Powered by Mocka</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/gallery" className="text-sm text-muted hover:text-foreground transition-colors">Gallery</Link>
            <Link href="/create" className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">Create Mock</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* API Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {DEMO_APIS.map((api) => (
            <button
              key={api.id}
              onClick={() => setSelectedApi(api)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                selectedApi.id === api.id
                  ? "bg-accent text-white border-accent"
                  : "bg-surface border-border text-muted hover:text-foreground hover:border-accent/30"
              }`}
            >
              <span>{api.icon}</span>
              <span>{api.name}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Endpoints panel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold ${selectedApi.color}`}>{selectedApi.icon} {selectedApi.name} API</h2>
                <p className="text-sm text-muted mt-1">{selectedApi.description}</p>
              </div>
              <button
                onClick={() => callAll(selectedApi)}
                className="text-xs bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Call All
              </button>
            </div>

            {/* Base URL */}
            <div className="bg-surface-2 border border-border rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
              <span className="text-xs text-muted">Base URL</span>
              <code className="text-xs font-mono text-accent">{selectedApi.baseUrl}</code>
            </div>

            {/* Endpoints */}
            <div className="space-y-2">
              {selectedApi.endpoints.map((ep) => {
                const key = `${selectedApi.id}:${ep.method}:${ep.path}`;
                const result = results[key];
                const isLoading = loadingKey === key;

                return (
                  <div key={key} className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className={`shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded ${METHOD_BADGE[ep.method]}`}>{ep.method}</span>
                      <code className="text-sm font-mono text-foreground/90 flex-1">{ep.path}</code>
                      <span className="text-xs text-muted hidden sm:inline">{ep.desc}</span>
                      <button
                        onClick={() => callEndpoint(selectedApi, ep)}
                        disabled={isLoading}
                        className="shrink-0 text-xs bg-accent hover:bg-accent-hover disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        {isLoading ? "..." : "Send"}
                      </button>
                    </div>
                    {result && (
                      <div className="border-t border-border px-4 py-3 bg-background">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-bold font-mono ${result.status >= 200 && result.status < 300 ? "text-success" : result.status >= 400 ? "text-danger" : "text-warning"}`}>
                            {result.status}
                          </span>
                          <span className="text-xs text-muted font-mono">{result.time}ms</span>
                        </div>
                        <pre className="text-xs font-mono text-foreground/80 overflow-x-auto max-h-48 overflow-y-auto leading-relaxed">{result.body}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live API Log */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
                <span className="text-sm font-semibold">Live API Log</span>
                <span className="text-xs text-muted ml-auto">{apiLog.length} calls</span>
              </div>
              <div className="divide-y divide-border max-h-[calc(100vh-200px)] overflow-y-auto">
                {apiLog.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-muted">Click &quot;Send&quot; on any endpoint to start</div>
                ) : apiLog.map((log, i) => (
                  <div key={i} className="px-4 py-2 flex items-center gap-2 text-xs font-mono">
                    <span className={`shrink-0 px-1.5 py-0.5 rounded font-bold ${METHOD_BADGE[log.method]}`}>{log.method}</span>
                    <span className="text-foreground/70 truncate flex-1">{log.path}</span>
                    <span className={`shrink-0 ${log.status >= 200 && log.status < 300 ? "text-success" : "text-danger"}`}>{log.status}</span>
                    <span className="shrink-0 text-muted">{log.time}ms</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted mt-3 text-center">
              All calls go to real Mocka mock APIs &middot; <Link href="/gallery" className="text-accent hover:underline">Browse gallery</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
