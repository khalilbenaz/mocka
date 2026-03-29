// Hardcoded demo API responses — no D1, no user account needed

interface DemoEndpoint {
  method: string;
  path: string;
  status: number;
  body: string;
}

interface DemoAPIData {
  endpoints: DemoEndpoint[];
}

function ts() { return new Date().toISOString(); }
function rid() { return Math.random().toString(36).substring(2, 10); }
function rint() { return Math.floor(Math.random() * 10000); }

const ECOMMERCE: DemoEndpoint[] = [
  { method: "GET", path: "/products", status: 200, body: JSON.stringify({ data: [{ id: 1, name: "MacBook Pro 16\"", price: 2499.99, currency: "EUR", category: "laptops", brand: "Apple", stock: 42, rating: 4.8, reviewCount: 234, image: "https://picsum.photos/seed/macbook/400/400", tags: ["featured", "bestseller"] }, { id: 2, name: "Sony WH-1000XM5", price: 349.99, currency: "EUR", category: "audio", brand: "Sony", stock: 156, rating: 4.6, reviewCount: 892, image: "https://picsum.photos/seed/sony/400/400", tags: ["bestseller"] }, { id: 3, name: "Samsung Galaxy S24 Ultra", price: 1459.00, currency: "EUR", category: "smartphones", brand: "Samsung", stock: 89, rating: 4.7, reviewCount: 1203, image: "https://picsum.photos/seed/samsung/400/400", tags: ["new", "featured"] }, { id: 4, name: "Dyson V15 Detect", price: 699.99, currency: "EUR", category: "home", brand: "Dyson", stock: 23, rating: 4.5, reviewCount: 445, image: "https://picsum.photos/seed/dyson/400/400", tags: ["premium"] }, { id: 5, name: "Nike Air Max 90", price: 139.99, currency: "EUR", category: "shoes", brand: "Nike", stock: 312, rating: 4.4, reviewCount: 2891, image: "https://picsum.photos/seed/nike/400/400", tags: ["bestseller", "sale"] }], pagination: { page: 1, perPage: 20, total: 5, totalPages: 1 } }, null, 2) },
  { method: "GET", path: "/products/:id", status: 200, body: JSON.stringify({ id: 1, name: "MacBook Pro 16\"", price: 2499.99, compareAtPrice: 2799.99, currency: "EUR", category: "laptops", brand: "Apple", stock: 42, rating: 4.8, reviewCount: 234, description: "Le MacBook Pro 16 pouces avec puce M3 Max.", specs: { processor: "Apple M3 Max", ram: "36 Go", storage: "1 To SSD", display: "16.2 pouces Liquid Retina XDR" }, images: ["https://picsum.photos/seed/mbp1/800/600", "https://picsum.photos/seed/mbp2/800/600"] }, null, 2) },
  { method: "GET", path: "/products/search/:query", status: 200, body: JSON.stringify({ query: "search", results: [{ id: 1, name: "MacBook Pro 16\"", price: 2499.99, matchScore: 0.95 }, { id: 3, name: "Samsung Galaxy S24 Ultra", price: 1459.00, matchScore: 0.72 }], totalResults: 2 }, null, 2) },
  { method: "POST", path: "/products", status: 201, body: JSON.stringify({ id: 999, message: "Product created successfully" }, null, 2) },
  { method: "PUT", path: "/products/:id", status: 200, body: JSON.stringify({ id: 1, message: "Product updated successfully" }, null, 2) },
  { method: "DELETE", path: "/products/:id", status: 204, body: "" },
  { method: "GET", path: "/cart", status: 200, body: JSON.stringify({ id: "cart_demo", items: [{ productId: 1, name: "MacBook Pro 16\"", price: 2499.99, quantity: 1, image: "https://picsum.photos/seed/macbook/100/100" }, { productId: 5, name: "Nike Air Max 90", price: 139.99, quantity: 2, image: "https://picsum.photos/seed/nike/100/100" }], itemCount: 3, subtotal: 2779.97, shipping: 0, tax: 555.99, total: 3335.96, currency: "EUR" }, null, 2) },
  { method: "POST", path: "/cart/items", status: 201, body: JSON.stringify({ message: "Item added to cart", itemCount: 4, total: 3685.95 }, null, 2) },
  { method: "DELETE", path: "/cart/items/:productId", status: 200, body: JSON.stringify({ message: "Item removed from cart", itemCount: 2 }, null, 2) },
  { method: "POST", path: "/cart/coupon", status: 200, body: JSON.stringify({ coupon: { code: "SUMMER25", type: "percentage", value: 25 }, discount: -694.99, newTotal: 2501.97 }, null, 2) },
  { method: "GET", path: "/orders", status: 200, body: JSON.stringify({ data: [{ id: "ORD-2024-001", status: "delivered", total: 2499.99, currency: "EUR", itemCount: 1, createdAt: "2024-12-15T10:30:00Z" }, { id: "ORD-2025-002", status: "shipped", total: 349.99, currency: "EUR", itemCount: 1, createdAt: "2025-03-20T16:45:00Z" }, { id: "ORD-2025-003", status: "processing", total: 1598.99, currency: "EUR", itemCount: 3 }] }, null, 2) },
  { method: "GET", path: "/orders/:id", status: 200, body: JSON.stringify({ id: "ORD-2025-002", status: "shipped", items: [{ productId: 2, name: "Sony WH-1000XM5", price: 349.99, quantity: 1 }], total: 419.99, currency: "EUR", tracking: { carrier: "Colissimo", number: "FR12345678" } }, null, 2) },
  { method: "POST", path: "/orders", status: 201, body: JSON.stringify({ id: "ORD-2025-NEW", status: "pending_payment", total: 3335.96 }, null, 2) },
  { method: "GET", path: "/users/me", status: 200, body: JSON.stringify({ id: "usr_demo", email: "jean.dupont@example.com", firstName: "Jean", lastName: "Dupont", avatar: "https://picsum.photos/seed/avatar/200/200", stats: { totalOrders: 12, totalSpent: 8934.50, loyaltyPoints: 2450, tier: "gold" } }, null, 2) },
  { method: "PATCH", path: "/users/me", status: 200, body: JSON.stringify({ message: "Profile updated successfully" }, null, 2) },
  { method: "GET", path: "/payments/methods", status: 200, body: JSON.stringify({ methods: [{ id: "pm_1", type: "card", brand: "Visa", last4: "4242", isDefault: true }, { id: "pm_2", type: "card", brand: "Mastercard", last4: "8888", isDefault: false }, { id: "pm_3", type: "paypal", email: "jean@example.com", isDefault: false }] }, null, 2) },
  { method: "POST", path: "/payments/charge", status: 200, body: JSON.stringify({ id: "txn_demo", status: "succeeded", amount: 3335.96, currency: "EUR" }, null, 2) },
  { method: "GET", path: "/products/:productId/reviews", status: 200, body: JSON.stringify({ averageRating: 4.6, totalReviews: 3, reviews: [{ id: "rev_1", author: "Marie L.", rating: 5, title: "Excellent !", body: "Qualite exceptionnelle.", verified: true, helpful: 24 }, { id: "rev_2", author: "Pierre M.", rating: 5, title: "Parfait", body: "Performances au top.", verified: true, helpful: 18 }, { id: "rev_3", author: "Sophie R.", rating: 3, title: "Correct mais cher", body: "Rapport qualite/prix moyen.", verified: false, helpful: 7 }] }, null, 2) },
  { method: "POST", path: "/products/:productId/reviews", status: 201, body: JSON.stringify({ id: "rev_new", message: "Review submitted", status: "pending_moderation" }, null, 2) },
  { method: "GET", path: "/categories", status: 200, body: JSON.stringify({ categories: [{ id: 1, name: "Laptops", slug: "laptops", productCount: 45 }, { id: 2, name: "Smartphones", slug: "smartphones", productCount: 78 }, { id: 3, name: "Audio", slug: "audio", productCount: 132 }, { id: 4, name: "Maison", slug: "home", productCount: 56 }, { id: 5, name: "Chaussures", slug: "shoes", productCount: 234 }] }, null, 2) },
  { method: "GET", path: "/wishlist", status: 200, body: JSON.stringify({ items: [{ productId: 3, name: "Samsung Galaxy S24 Ultra", price: 1459.00, inStock: true }, { productId: 4, name: "Dyson V15 Detect", price: 699.99, inStock: true }], totalItems: 2 }, null, 2) },
  { method: "POST", path: "/wishlist/:productId", status: 201, body: JSON.stringify({ message: "Added to wishlist", totalItems: 3 }, null, 2) },
  { method: "DELETE", path: "/wishlist/:productId", status: 200, body: JSON.stringify({ message: "Removed from wishlist", totalItems: 1 }, null, 2) },
  { method: "GET", path: "/notifications", status: 200, body: JSON.stringify({ unreadCount: 3, notifications: [{ id: "n1", type: "order_shipped", title: "Commande expediee", body: "Votre commande a ete expediee.", read: false }, { id: "n2", type: "price_drop", title: "Baisse de prix !", body: "Samsung Galaxy S24 passe de 1459 a 1299 EUR.", read: false }, { id: "n3", type: "loyalty", title: "Palier Gold", body: "Vous avez atteint le palier Gold.", read: true }] }, null, 2) },
];

const AUTH: DemoEndpoint[] = [
  { method: "POST", path: "/auth/login", status: 200, body: JSON.stringify({ accessToken: "eyJhbGciOiJIUzI1NiJ9.demo.token", refreshToken: "rt_demo_refresh", expiresIn: 3600, tokenType: "Bearer", user: { id: "usr_1", email: "jean@example.com", name: "Jean Dupont" } }, null, 2) },
  { method: "POST", path: "/auth/register", status: 201, body: JSON.stringify({ id: "usr_new", email: "new@example.com", name: "New User", message: "Account created. Please verify your email." }, null, 2) },
  { method: "POST", path: "/auth/refresh", status: 200, body: JSON.stringify({ accessToken: "eyJhbGciOiJIUzI1NiJ9.refreshed.token", refreshToken: "rt_new_refresh", expiresIn: 3600 }, null, 2) },
  { method: "POST", path: "/auth/forgot-password", status: 200, body: JSON.stringify({ message: "Password reset email sent to j***@example.com" }, null, 2) },
  { method: "GET", path: "/auth/me", status: 200, body: JSON.stringify({ id: "usr_1", email: "jean@example.com", name: "Jean Dupont", avatar: "https://picsum.photos/seed/user1/200/200", role: "user", emailVerified: true, createdAt: "2024-01-15T10:00:00Z" }, null, 2) },
  { method: "PATCH", path: "/auth/me", status: 200, body: JSON.stringify({ message: "Profile updated successfully", updatedFields: ["name", "avatar"] }, null, 2) },
];

const SOCIAL: DemoEndpoint[] = [
  { method: "GET", path: "/feed", status: 200, body: JSON.stringify({ posts: [{ id: 1, author: { id: "u1", name: "Alice Martin", avatar: "https://picsum.photos/seed/alice/50/50" }, content: "Just deployed my new API with Mocka! So easy.", likes: 42, comments: 5, createdAt: "2025-03-28T14:30:00Z" }, { id: 2, author: { id: "u2", name: "Bob Leroy", avatar: "https://picsum.photos/seed/bob/50/50" }, content: "Working on a new side project this weekend.", likes: 18, comments: 3, createdAt: "2025-03-28T10:15:00Z" }], nextCursor: "cursor_abc" }, null, 2) },
  { method: "POST", path: "/posts", status: 201, body: JSON.stringify({ id: 99, message: "Post created", createdAt: "2025-03-29T12:00:00Z" }, null, 2) },
  { method: "GET", path: "/posts/:id/comments", status: 200, body: JSON.stringify({ comments: [{ id: 1, author: "Marie L.", body: "Super post !", createdAt: "2025-03-28T15:00:00Z" }, { id: 2, author: "Pierre M.", body: "Je suis d'accord !", createdAt: "2025-03-28T15:30:00Z" }] }, null, 2) },
  { method: "POST", path: "/posts/:id/like", status: 200, body: JSON.stringify({ liked: true, totalLikes: 43 }, null, 2) },
  { method: "GET", path: "/users/:id/followers", status: 200, body: JSON.stringify({ followers: [{ id: "u2", name: "Bob Leroy", avatar: "https://picsum.photos/seed/bob/50/50" }, { id: "u3", name: "Claire Petit", avatar: "https://picsum.photos/seed/claire/50/50" }], totalFollowers: 234 }, null, 2) },
  { method: "GET", path: "/stories", status: 200, body: JSON.stringify({ stories: [{ id: 1, author: { name: "Alice", avatar: "https://picsum.photos/seed/alice/50/50" }, media: "https://picsum.photos/seed/story1/400/700", expiresAt: "2025-03-30T14:30:00Z" }] }, null, 2) },
];

const PAYMENT: DemoEndpoint[] = [
  { method: "POST", path: "/charges", status: 201, body: JSON.stringify({ id: "ch_demo", amount: 4999, currency: "eur", status: "succeeded", paymentMethod: "pm_visa_4242", receipt_url: "https://receipts.example.com/demo" }, null, 2) },
  { method: "POST", path: "/refunds", status: 201, body: JSON.stringify({ id: "rf_demo", chargeId: "ch_demo", amount: 4999, status: "succeeded", reason: "customer_request" }, null, 2) },
  { method: "GET", path: "/customers/:id", status: 200, body: JSON.stringify({ id: "cus_1", email: "jean@example.com", name: "Jean Dupont", balance: 0, currency: "eur", defaultPaymentMethod: "pm_visa_4242", createdAt: "2024-06-15T10:00:00Z" }, null, 2) },
  { method: "GET", path: "/invoices", status: 200, body: JSON.stringify({ data: [{ id: "inv_1", amount: 4999, currency: "eur", status: "paid", customer: "cus_1", createdAt: "2025-03-01T10:00:00Z" }, { id: "inv_2", amount: 2999, currency: "eur", status: "open", customer: "cus_1", dueDate: "2025-04-01T10:00:00Z" }] }, null, 2) },
  { method: "GET", path: "/payment-methods", status: 200, body: JSON.stringify({ data: [{ id: "pm_1", type: "card", card: { brand: "visa", last4: "4242", expMonth: 12, expYear: 2027 } }, { id: "pm_2", type: "card", card: { brand: "mastercard", last4: "8888", expMonth: 6, expYear: 2026 } }] }, null, 2) },
  { method: "POST", path: "/checkout/sessions", status: 201, body: JSON.stringify({ id: "cs_demo", url: "https://checkout.example.com/cs_demo", expiresAt: "2025-03-29T13:00:00Z", status: "open" }, null, 2) },
];

const BLOG: DemoEndpoint[] = [
  { method: "GET", path: "/articles", status: 200, body: JSON.stringify({ data: [{ id: 1, title: "Getting Started with Mocka", slug: "getting-started-mocka", excerpt: "Learn how to create mock APIs in seconds.", author: { id: 1, name: "Alice Martin" }, category: "tutorials", publishedAt: "2025-03-25T10:00:00Z", readTime: 5 }, { id: 2, title: "API Testing Best Practices", slug: "api-testing-best-practices", excerpt: "How to test your APIs effectively.", author: { id: 2, name: "Bob Leroy" }, category: "engineering", publishedAt: "2025-03-20T14:00:00Z", readTime: 8 }], total: 2 }, null, 2) },
  { method: "GET", path: "/articles/:slug", status: 200, body: JSON.stringify({ id: 1, title: "Getting Started with Mocka", slug: "getting-started-mocka", content: "# Getting Started\n\nMocka lets you create mock APIs in seconds...\n\n## Step 1\n\nDefine your endpoints...", author: { id: 1, name: "Alice Martin", avatar: "https://picsum.photos/seed/alice/100/100" }, category: "tutorials", tags: ["mock", "api", "testing"], publishedAt: "2025-03-25T10:00:00Z", readTime: 5 }, null, 2) },
  { method: "GET", path: "/categories", status: 200, body: JSON.stringify({ categories: [{ id: 1, name: "Tutorials", slug: "tutorials", count: 12 }, { id: 2, name: "Engineering", slug: "engineering", count: 8 }, { id: 3, name: "Product", slug: "product", count: 5 }] }, null, 2) },
  { method: "GET", path: "/authors/:id", status: 200, body: JSON.stringify({ id: 1, name: "Alice Martin", bio: "Developer and tech writer.", avatar: "https://picsum.photos/seed/alice/200/200", articlesCount: 15, twitter: "@alice_dev" }, null, 2) },
  { method: "GET", path: "/tags", status: 200, body: JSON.stringify({ tags: [{ name: "mock", count: 8 }, { name: "api", count: 12 }, { name: "testing", count: 6 }, { name: "javascript", count: 10 }, { name: "tutorial", count: 7 }] }, null, 2) },
  { method: "POST", path: "/articles", status: 201, body: JSON.stringify({ id: 99, message: "Article created", slug: "new-article", status: "draft" }, null, 2) },
];

const WEATHER: DemoEndpoint[] = [
  { method: "GET", path: "/weather/current", status: 200, body: JSON.stringify({ location: { city: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 }, temperature: 18, feelsLike: 16, humidity: 65, windSpeed: 12, windDirection: "SW", condition: "partly_cloudy", icon: "cloud-sun", updatedAt: "2025-03-29T12:00:00Z" }, null, 2) },
  { method: "GET", path: "/weather/forecast", status: 200, body: JSON.stringify({ location: "Paris", forecast: [{ date: "2025-03-29", high: 20, low: 12, condition: "sunny", precipitation: 0 }, { date: "2025-03-30", high: 18, low: 11, condition: "cloudy", precipitation: 20 }, { date: "2025-03-31", high: 15, low: 9, condition: "rainy", precipitation: 80 }, { date: "2025-04-01", high: 17, low: 10, condition: "partly_cloudy", precipitation: 10 }] }, null, 2) },
  { method: "GET", path: "/weather/history", status: 200, body: JSON.stringify({ location: "Paris", period: "2025-03", data: [{ date: "2025-03-01", avgTemp: 8, maxTemp: 12, minTemp: 4, precipitation: 5 }, { date: "2025-03-15", avgTemp: 13, maxTemp: 17, minTemp: 9, precipitation: 0 }] }, null, 2) },
  { method: "GET", path: "/weather/alerts", status: 200, body: JSON.stringify({ alerts: [{ id: "alert_1", type: "wind", severity: "moderate", title: "Strong winds expected", description: "Wind gusts up to 80 km/h expected tomorrow.", validFrom: "2025-03-30T06:00:00Z", validTo: "2025-03-30T18:00:00Z" }] }, null, 2) },
  { method: "GET", path: "/weather/cities/:id", status: 200, body: JSON.stringify({ id: 1, city: "Paris", country: "FR", temperature: 18, condition: "partly_cloudy" }, null, 2) },
  { method: "GET", path: "/weather/search/:query", status: 200, body: JSON.stringify({ results: [{ id: 1, city: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 }, { id: 2, city: "Paris", country: "US", state: "Texas", lat: 33.6609, lon: -95.5555 }] }, null, 2) },
];

const CHAT: DemoEndpoint[] = [
  { method: "GET", path: "/conversations", status: 200, body: JSON.stringify({ conversations: [{ id: "conv_1", name: "Alice Martin", avatar: "https://picsum.photos/seed/alice/50/50", lastMessage: "On se voit demain ?", unreadCount: 2, updatedAt: "2025-03-29T11:30:00Z" }, { id: "conv_2", name: "Equipe Projet", avatar: "https://picsum.photos/seed/team/50/50", lastMessage: "Le deploy est OK", unreadCount: 0, updatedAt: "2025-03-29T09:00:00Z" }] }, null, 2) },
  { method: "GET", path: "/conversations/:id/messages", status: 200, body: JSON.stringify({ messages: [{ id: "msg_1", senderId: "u2", content: "Salut ! Ca va ?", createdAt: "2025-03-29T10:00:00Z" }, { id: "msg_2", senderId: "me", content: "Oui super, et toi ?", createdAt: "2025-03-29T10:05:00Z" }, { id: "msg_3", senderId: "u2", content: "On se voit demain ?", createdAt: "2025-03-29T11:30:00Z" }] }, null, 2) },
  { method: "POST", path: "/messages", status: 201, body: JSON.stringify({ id: "msg_new", content: "Message sent", conversationId: "conv_1", createdAt: "2025-03-29T12:00:00Z" }, null, 2) },
  { method: "PATCH", path: "/messages/:id/read", status: 200, body: JSON.stringify({ id: "msg_3", readAt: "2025-03-29T12:00:00Z" }, null, 2) },
  { method: "GET", path: "/contacts", status: 200, body: JSON.stringify({ contacts: [{ id: "u2", name: "Alice Martin", avatar: "https://picsum.photos/seed/alice/50/50", status: "online" }, { id: "u3", name: "Bob Leroy", avatar: "https://picsum.photos/seed/bob/50/50", status: "offline", lastSeen: "2025-03-29T08:00:00Z" }] }, null, 2) },
  { method: "DELETE", path: "/messages/:id", status: 200, body: JSON.stringify({ deleted: true, id: "msg_1" }, null, 2) },
];

const IOT: DemoEndpoint[] = [
  { method: "GET", path: "/devices", status: 200, body: JSON.stringify({ devices: [{ id: "dev_1", name: "Living Room Sensor", type: "temperature", status: "online", battery: 87, lastReading: 22.5, unit: "°C" }, { id: "dev_2", name: "Front Door Camera", type: "camera", status: "online", battery: 100, recording: true }, { id: "dev_3", name: "Garden Moisture", type: "humidity", status: "offline", battery: 12, lastReading: 45, unit: "%" }] }, null, 2) },
  { method: "GET", path: "/devices/:id/readings", status: 200, body: JSON.stringify({ deviceId: "dev_1", readings: [{ value: 22.5, unit: "°C", timestamp: "2025-03-29T12:00:00Z" }, { value: 22.3, unit: "°C", timestamp: "2025-03-29T11:00:00Z" }, { value: 21.8, unit: "°C", timestamp: "2025-03-29T10:00:00Z" }, { value: 20.5, unit: "°C", timestamp: "2025-03-29T09:00:00Z" }] }, null, 2) },
  { method: "POST", path: "/devices/:id/command", status: 200, body: JSON.stringify({ deviceId: "dev_1", command: "calibrate", status: "sent", message: "Command sent successfully" }, null, 2) },
  { method: "GET", path: "/alerts", status: 200, body: JSON.stringify({ alerts: [{ id: "alert_1", deviceId: "dev_3", type: "low_battery", message: "Garden Moisture sensor battery at 12%", severity: "warning", createdAt: "2025-03-29T08:00:00Z" }, { id: "alert_2", deviceId: "dev_3", type: "offline", message: "Garden Moisture sensor went offline", severity: "critical", createdAt: "2025-03-29T09:30:00Z" }] }, null, 2) },
  { method: "GET", path: "/dashboard/stats", status: 200, body: JSON.stringify({ totalDevices: 3, online: 2, offline: 1, alerts: 2, avgBattery: 66, lastUpdated: "2025-03-29T12:00:00Z" }, null, 2) },
  { method: "POST", path: "/devices", status: 201, body: JSON.stringify({ id: "dev_new", message: "Device registered", name: "New Sensor", status: "pending_activation" }, null, 2) },
];

// Suppress unused variable warnings
void ts; void rid; void rint;

export const DEMO_APIS: Record<string, DemoAPIData> = {
  "e-commerce": { endpoints: ECOMMERCE },
  "auth": { endpoints: AUTH },
  "social": { endpoints: SOCIAL },
  "payment": { endpoints: PAYMENT },
  "blog": { endpoints: BLOG },
  "weather": { endpoints: WEATHER },
  "chat": { endpoints: CHAT },
  "iot": { endpoints: IOT },
};

export function matchDemoEndpoint(apiId: string, method: string, path: string): DemoEndpoint | null {
  const api = DEMO_APIS[apiId];
  if (!api) return null;

  for (const ep of api.endpoints) {
    if (ep.method !== method) continue;
    const patternParts = ep.path.split("/").filter(Boolean);
    const actualParts = path.split("/").filter(Boolean);
    if (patternParts.length !== actualParts.length) continue;
    let match = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (!patternParts[i].startsWith(":") && patternParts[i] !== actualParts[i]) { match = false; break; }
    }
    if (match) return ep;
  }
  return null;
}
