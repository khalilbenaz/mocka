"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const API = "https://mocka.qzz.io/api/mock/d045k8/e-commerce-api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  coupon: string | null;
}

interface Order {
  id: string;
  status: string;
  total: number;
  currency: string;
  itemCount: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  stats: {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    tier: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-warning text-xs">
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-success/15 text-success",
  shipped: "bg-accent/15 text-accent",
  processing: "bg-warning/15 text-warning",
  pending_payment: "bg-danger/15 text-danger",
};

// ─── Main Page ───────────────────────────────────────────────────────────────

type Tab = "shop" | "cart" | "orders" | "profile" | "notifications";

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>("shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [apiLog, setApiLog] = useState<{ method: string; path: string; status: number; time: number }[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const apiFetch = useCallback(async (path: string, options?: RequestInit) => {
    const start = Date.now();
    const res = await fetch(`${API}${path}`, options);
    const time = Date.now() - start;
    setApiLog((prev) => [
      { method: options?.method || "GET", path, status: res.status, time },
      ...prev.slice(0, 19),
    ]);
    return res;
  }, []);

  // Load initial data
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prodRes, catRes, cartRes] = await Promise.all([
        apiFetch("/products"),
        apiFetch("/categories"),
        apiFetch("/cart"),
      ]);
      const prodData = await prodRes.json() as { data: Product[] };
      setProducts(prodData.data || []);
      const catData = await catRes.json() as { categories: Category[] };
      setCategories(catData.categories || []);
      setCart(await cartRes.json() as Cart);
      setLoading(false);
    }
    load();
  }, [apiFetch]);

  // Load tab-specific data
  useEffect(() => {
    if (tab === "orders" && orders.length === 0) {
      apiFetch("/orders").then(async (r) => { const d = await r.json() as { data: Order[] }; setOrders(d.data || []); });
    }
    if (tab === "notifications" && notifications.length === 0) {
      apiFetch("/notifications").then(async (r) => { const d = await r.json() as { notifications: Notification[] }; setNotifications(d.notifications || []); });
    }
    if (tab === "profile" && !profile) {
      apiFetch("/users/me").then(async (r) => { setProfile(await r.json() as UserProfile); });
    }
  }, [tab, orders.length, notifications.length, profile, apiFetch]);

  // Load reviews for selected product
  useEffect(() => {
    if (selectedProduct !== null) {
      apiFetch(`/products/${selectedProduct}/reviews`)
        .then(async (r) => { const d = await r.json() as { reviews: Review[] }; setReviews(d.reviews || []); });
    }
  }, [selectedProduct, apiFetch]);

  const addToCart = async (productId: number) => {
    await apiFetch("/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const res = await apiFetch("/cart");
    setCart(await res.json() as Cart);
    showToast("Added to cart");
  };

  const removeFromCart = async (productId: number) => {
    await apiFetch(`/cart/items/${productId}`, { method: "DELETE" });
    const res = await apiFetch("/cart");
    setCart(await res.json() as Cart);
    showToast("Removed from cart");
  };

  const applyCoupon = async () => {
    await apiFetch("/cart/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "SUMMER25" }),
    });
    showToast("Coupon SUMMER25 applied! -25%");
  };

  const placeOrder = async () => {
    await apiFetch("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    showToast("Order placed!");
    setTab("orders");
    const res = await apiFetch("/orders");
    const d = await res.json() as { data: Order[] };
    setOrders(d.data || []);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-lg tracking-tight">ShopDemo</span>
            </Link>
            <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
              Powered by Mocka
            </span>
          </div>
          <div className="flex items-center gap-1">
            {(["shop", "cart", "orders", "profile", "notifications"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSelectedProduct(null); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  tab === t ? "bg-accent text-white" : "text-muted hover:text-foreground hover:bg-surface-2"
                }`}
              >
                {t === "cart" ? `Cart${cart ? ` (${cart.itemCount})` : ""}` : t === "notifications" ? "Notifs" : t}
              </button>
            ))}
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-success text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg animate-[fadeIn_0.2s]">
          {toast}
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted">Loading from mock API...</div>
        ) : (
          <>
            {/* Shop */}
            {tab === "shop" && !selectedProduct && (
              <div>
                {/* Categories */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button key={cat.id} className="shrink-0 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-muted hover:text-foreground hover:border-accent/30 transition-colors">
                      {cat.name} <span className="text-xs text-muted">({cat.productCount})</span>
                    </button>
                  ))}
                </div>

                {/* Products grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => (
                    <div key={p.id} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors group">
                      <div
                        className="aspect-square bg-surface-2 flex items-center justify-center cursor-pointer overflow-hidden"
                        onClick={() => setSelectedProduct(p.id)}
                      >
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm cursor-pointer hover:text-accent" onClick={() => setSelectedProduct(p.id)}>
                            {p.name}
                          </h3>
                          <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded shrink-0">{p.brand}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Stars rating={p.rating} />
                          <span className="text-xs text-muted">({p.reviewCount})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">{p.price.toFixed(2)} {p.currency}</span>
                          <button
                            onClick={() => addToCart(p.id)}
                            className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                        <div className="flex gap-1.5 mt-3">
                          {p.tags.map((tag) => (
                            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              tag === "bestseller" ? "bg-success/15 text-success" :
                              tag === "new" ? "bg-accent/15 text-accent" :
                              tag === "sale" ? "bg-danger/15 text-danger" :
                              tag === "featured" ? "bg-warning/15 text-warning" :
                              "bg-surface-2 text-muted"
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product detail */}
            {tab === "shop" && selectedProduct && (
              <div>
                <button onClick={() => setSelectedProduct(null)} className="text-sm text-muted hover:text-foreground mb-6 flex items-center gap-1">
                  &larr; Back to shop
                </button>
                {products.filter((p) => p.id === selectedProduct).map((p) => (
                  <div key={p.id} className="grid md:grid-cols-2 gap-8">
                    <div className="bg-surface border border-border rounded-xl overflow-hidden aspect-square">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded">{p.brand}</span>
                      <h1 className="text-2xl font-bold mt-2 mb-2">{p.name}</h1>
                      <div className="flex items-center gap-2 mb-4">
                        <Stars rating={p.rating} />
                        <span className="text-sm text-muted">{p.reviewCount} reviews</span>
                      </div>
                      <div className="text-3xl font-bold text-accent mb-6">{p.price.toFixed(2)} {p.currency}</div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded ${p.stock > 20 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                          {p.stock > 20 ? "In stock" : `Only ${p.stock} left`}
                        </span>
                        <span className="text-xs text-muted">{p.category}</span>
                      </div>
                      <button
                        onClick={() => addToCart(p.id)}
                        className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-semibold transition-colors mb-8"
                      >
                        Add to Cart
                      </button>

                      {/* Reviews */}
                      <h3 className="font-semibold mb-4">Reviews</h3>
                      <div className="space-y-3">
                        {reviews.map((r) => (
                          <div key={r.id} className="bg-surface border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{r.author}</span>
                                {r.verified && <span className="text-[10px] text-success bg-success/10 px-1.5 py-0.5 rounded">Verified</span>}
                              </div>
                              <Stars rating={r.rating} />
                            </div>
                            <h4 className="font-medium text-sm mb-1">{r.title}</h4>
                            <p className="text-sm text-muted leading-relaxed">{r.body}</p>
                            <div className="text-xs text-muted mt-2">{r.helpful} people found this helpful</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart */}
            {tab === "cart" && cart && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Your Cart</h2>
                {cart.items.length === 0 ? (
                  <div className="text-center py-16 text-muted">
                    <p className="mb-4">Your cart is empty</p>
                    <button onClick={() => setTab("shop")} className="text-accent hover:underline">Browse products</button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {cart.items.map((item) => (
                        <div key={item.productId} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{item.name}</h3>
                            <p className="text-xs text-muted">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} EUR</span>
                          <button onClick={() => removeFromCart(item.productId)} className="text-xs text-danger hover:text-danger/70 px-2 py-1 rounded transition-colors">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Subtotal</span>
                        <span>{cart.subtotal.toFixed(2)} EUR</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Shipping</span>
                        <span className="text-success">{cart.shipping === 0 ? "Free" : `${cart.shipping.toFixed(2)} EUR`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Tax</span>
                        <span>{cart.tax.toFixed(2)} EUR</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-accent">{cart.total.toFixed(2)} EUR</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={applyCoupon} className="text-xs border border-border text-muted hover:text-foreground hover:border-accent/30 px-3 py-2 rounded-lg transition-colors">
                          Apply SUMMER25
                        </button>
                        <button onClick={placeOrder} className="flex-1 bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                          Place Order
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Orders */}
            {tab === "orders" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Your Orders</h2>
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium">{o.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] || "bg-surface-2 text-muted"}`}>
                            {o.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-xs text-muted">{o.itemCount} item{o.itemCount !== 1 ? "s" : ""} &middot; {new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold">{o.total.toFixed(2)} {o.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile */}
            {tab === "profile" && profile && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={profile.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
                      <p className="text-sm text-muted">{profile.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-background border border-border rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-accent">{profile.stats.totalOrders}</div>
                      <div className="text-xs text-muted">Orders</div>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-success">{profile.stats.totalSpent.toFixed(0)} EUR</div>
                      <div className="text-xs text-muted">Spent</div>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-warning">{profile.stats.loyaltyPoints}</div>
                      <div className="text-xs text-muted">Points</div>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-accent capitalize">{profile.stats.tier}</div>
                      <div className="text-xs text-muted">Tier</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {tab === "notifications" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Notifications</h2>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className={`bg-surface border rounded-xl p-4 ${n.read ? "border-border" : "border-accent/30"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{n.title}</h3>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-accent" />}
                        </div>
                        <span className="text-[10px] text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Log */}
            <div className="mt-12 border-t border-border pt-8">
              <h3 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
                Live API Log
                <span className="text-xs font-normal text-muted ml-1">— every action calls the real Mocka mock API</span>
              </h3>
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="divide-y divide-border max-h-60 overflow-y-auto">
                  {apiLog.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-muted">No API calls yet...</div>
                  ) : apiLog.map((log, i) => (
                    <div key={i} className="px-4 py-2 flex items-center gap-3 text-xs font-mono">
                      <span className={`shrink-0 px-2 py-0.5 rounded font-bold ${
                        log.method === "GET" ? "method-get" :
                        log.method === "POST" ? "method-post" :
                        log.method === "PUT" ? "method-put" :
                        log.method === "DELETE" ? "method-delete" : "method-patch"
                      }`}>{log.method}</span>
                      <span className="text-foreground/80 truncate">{log.path}</span>
                      <span className="ml-auto shrink-0 text-accent">{log.status}</span>
                      <span className="shrink-0 text-muted">{log.time}ms</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted mt-3">
                Base URL: <a href="https://mocka.qzz.io/api/mock/d045k8/e-commerce-api" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-mono">mocka.qzz.io/api/mock/d045k8/e-commerce-api</a>
                {" "}&middot;{" "}
                <Link href="/create" className="text-accent hover:underline">Create your own mock</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
