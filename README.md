<div align="center">

# Mocka

**Mock anything. Instantly.**

Create mock API servers in seconds. Define your endpoints, get a live URL, and test your frontend without waiting for the backend.

[![Live Demo](https://img.shields.io/badge/Live_Demo-mocka.qzz.io-6366f1?style=for-the-badge&logo=cloudflare&logoColor=white)](https://mocka.qzz.io)
[![GitHub](https://img.shields.io/badge/GitHub-khalilbenaz%2Fmocka-181717?style=for-the-badge&logo=github)](https://github.com/khalilbenaz/mocka)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![D1](https://img.shields.io/badge/Cloudflare_D1-F38020?style=flat-square&logo=cloudflare&logoColor=white)

[![This Website is Powered by DigitalPlat FreeDomain Get a free domain from DigitalPlat.](https://img.shields.io/badge/DigitalPlat-Get%20a%20free%20domain%20from%20DigitalPlat.-2563eb?style=flat-square&logo=databricks&logoColor=ffffff)](https://dash.domain.digitalplat.org/signup?ref=jfs4BIQ0Mw)

</div>

---

## What is Mocka?

Mocka is a free, open-source mock server builder. It lets you define API endpoints with custom responses, status codes, headers, and latency — then serves them at a live URL you can use immediately.

**Free. No config files. No backend required.**

## Features

| Feature | Description |
|---------|-------------|
| **User Accounts** | Sign up / login with Clerk — GitHub or email |
| **Social Login** | One-click sign-in with GitHub |
| **All HTTP Methods** | GET, POST, PUT, PATCH, DELETE |
| **Any Response** | JSON, XML, HTML, plain text with any status code |
| **Custom Headers** | Add any response headers you need |
| **Simulated Latency** | Add delays (ms) to mimic real-world network conditions |
| **Path Parameters** | Support for `:param` style dynamic segments (e.g. `/users/:id`) |
| **Response Templating** | Dynamic values: `{{id}}`, `{{timestamp}}`, `{{randomId}}`, `{{randomInt}}` |
| **CORS Ready** | All endpoints include CORS headers by default |
| **Import / Export** | Save and share mock configurations as JSON files |
| **Shareable URLs** | Each mock project gets a unique, public base URL |
| **Swagger Page** | Visit a mock's base URL to see a Swagger-like listing of all its endpoints |
| **Dark & Light Theme** | Toggle between dark and light mode |
| **Live Demo** | Full e-commerce demo app powered by a Mocka mock API at [/demo](https://mocka.qzz.io/demo) |
| **Persistent Storage** | Cloudflare D1 (SQLite at the edge) — data survives deployments |

## Quick Start

### Use the hosted version

1. Go to [mocka.qzz.io](https://mocka.qzz.io) and **sign up** with GitHub, Google or email
2. Go to [/create](https://mocka.qzz.io/create), name your project and add endpoints
3. Click **Create Mock Server**
4. Your mock is live — use the base URL in your frontend

### Run locally

```bash
git clone https://github.com/khalilbenaz/mocka.git
cd mocka
npm install
```

Create a `.env.local` file with your [Clerk](https://clerk.com/) keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

For local development with D1:

```bash
npm run db:migrate:local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Reference

### Creating & Managing Mocks

Mock projects are created and managed via the **web UI**:

1. **Sign in** at [mocka.qzz.io](https://mocka.qzz.io) with GitHub or email
2. Go to [/create](https://mocka.qzz.io/create), name your project, add endpoints
3. Click **Create Mock Server** — your API is live instantly
4. Manage everything from the [dashboard](https://mocka.qzz.io/dashboard): edit endpoints, export configs, delete projects

You can also **import a JSON file** on the create page to set up a project in one click (see [Import / Export](#import--export)).

> **Note:** The management API (`/api/mocks`) uses Clerk session cookies — it is designed for the web UI, not for direct programmatic calls.

---

### Projects (Internal API)

These endpoints are used internally by the Mocka web UI. They require an active Clerk session (browser cookie).

#### `POST /api/mocks` — Create a mock project

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique project ID (you generate it) |
| `name` | string | yes | Display name |
| `slug` | string | yes | URL slug (auto-incremented if taken: `my-api` → `my-api-1`) |
| `description` | string | no | Project description |
| `endpoints` | array | yes | At least one endpoint (see [Endpoint Object](#endpoint-object)) |

**Response:** `201` with the created project object (includes generated `userSlug`).

---

#### `GET /api/mocks` — List your mock projects

Returns all projects for the authenticated user, ordered by last update.

```bash
curl https://mocka.qzz.io/api/mocks
```

**Response:** `200`

```json
[
  {
    "id": "proj_1",
    "userId": "user_xxx",
    "userSlug": "2mojs3",
    "name": "Users API",
    "slug": "users-api",
    "description": "Mock for user management",
    "endpoints": [...],
    "createdAt": "2025-03-29T10:00:00.000Z",
    "updatedAt": "2025-03-29T10:00:00.000Z"
  }
]
```

---

#### `PUT /api/mocks` — Update a mock project

Updates an existing project you own. Send the full project object.

```bash
curl -X PUT https://mocka.qzz.io/api/mocks \
  -H "Content-Type: application/json" \
  -d '{
    "id": "proj_1",
    "name": "Users API v2",
    "slug": "users-api",
    "description": "Updated mock",
    "endpoints": [
      {
        "id": "ep_1",
        "method": "GET",
        "path": "/users",
        "statusCode": 200,
        "responseBody": "[{\"id\": 1, \"name\": \"Alice\", \"role\": \"admin\"}]",
        "contentType": "application/json",
        "headers": { "X-API-Version": "2" },
        "delay": 50
      },
      {
        "id": "ep_2",
        "method": "POST",
        "path": "/users",
        "statusCode": 201,
        "responseBody": "{\"id\": {{randomInt}}, \"created\": true, \"timestamp\": \"{{timestamp}}\"}",
        "contentType": "application/json",
        "headers": {},
        "delay": 0
      }
    ]
  }'
```

**Response:** `200` with the updated project.

---

#### `DELETE /api/mocks?slug={slug}` — Delete a mock project

Deletes a project and all its associated request logs.

```bash
curl -X DELETE "https://mocka.qzz.io/api/mocks?slug=users-api"
```

**Response:** `200`

```json
{ "success": true }
```

---

### Mock Serving (Public — No Auth)

#### `{METHOD} /api/mock/{userSlug}/{slug}/{path}` — Hit a mock endpoint

Matches the HTTP method and path against the project's endpoints and returns the configured response.

```bash
# GET request
curl https://mocka.qzz.io/api/mock/2mojs3/users-api/users

# POST request
curl -X POST https://mocka.qzz.io/api/mock/2mojs3/users-api/users

# With path parameters
curl https://mocka.qzz.io/api/mock/2mojs3/users-api/users/42

# DELETE request
curl -X DELETE https://mocka.qzz.io/api/mock/2mojs3/users-api/users/42
```

**Response headers always include:**

| Header | Value |
|--------|-------|
| `Access-Control-Allow-Origin` | `*` |
| `Access-Control-Allow-Methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` |
| `X-Mock-Server` | `Mocka` |
| `X-Mock-Project` | `{userSlug}/{slug}` |
| `Cache-Control` | `no-store, no-cache, must-revalidate` |

**Error responses:**

- `404` — Project not found or no matching endpoint. Returns available endpoints list:

```json
{
  "error": "No matching endpoint",
  "method": "GET",
  "path": "/unknown",
  "available": ["GET /users", "POST /users", "GET /users/:id"]
}
```

---

#### `GET /api/mock/{userSlug}/{slug}` — Swagger page

Returns an **HTML page** listing all endpoints with method, path, status code, curl examples, and response bodies. Share this URL as documentation for your mock API.

```
https://mocka.qzz.io/api/mock/2mojs3/users-api
```

---

#### `OPTIONS /api/mock/{userSlug}/{slug}/{path}` — CORS preflight

Returns `204` with full CORS headers.

---

### Analytics

#### `GET /api/stats?slug={slug}` — Get project statistics

```bash
curl "https://mocka.qzz.io/api/stats?slug=users-api"
```

**Response:** `200`

```json
{
  "totalCalls": 1234,
  "last24h": 56,
  "avgResponseMs": 12,
  "topEndpoints": [
    { "method": "GET", "path": "/users", "count": 890 },
    { "method": "POST", "path": "/users", "count": 234 },
    { "method": "GET", "path": "/users/42", "count": 110 }
  ]
}
```

---

### Endpoint Object

Each endpoint in a project has the following structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique endpoint ID |
| `method` | string | yes | `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` |
| `path` | string | yes | URL path (e.g. `/users/:id`) |
| `statusCode` | number | yes | HTTP status code (100–599) |
| `responseBody` | string | yes | Response body (JSON string, XML, HTML, plain text) |
| `contentType` | string | yes | MIME type (e.g. `application/json`, `text/xml`) |
| `headers` | object | yes | Custom response headers (key-value pairs) |
| `delay` | number | yes | Simulated latency in milliseconds |

---

### Path Parameters

Use `:param` syntax in endpoint paths to define dynamic segments:

| Pattern | URL | Extracted params |
|---------|-----|-----------------|
| `/users/:id` | `/users/42` | `{ "id": "42" }` |
| `/posts/:postId/comments/:commentId` | `/posts/5/comments/12` | `{ "postId": "5", "commentId": "12" }` |
| `/files/:path` | `/files/report.pdf` | `{ "path": "report.pdf" }` |

---

### Response Templating

Use `{{variable}}` in response bodies to inject dynamic values:

| Template | Output | Description |
|----------|--------|-------------|
| `{{id}}` | `42` | Path parameter value (shorthand for `{{params.id}}`) |
| `{{params.id}}` | `42` | Explicit path parameter reference |
| `{{timestamp}}` | `2025-03-29T10:30:00.000Z` | Current ISO 8601 timestamp |
| `{{randomId}}` | `a1b2c3d4` | Random 8-character alphanumeric string |
| `{{randomInt}}` | `7342` | Random integer between 0 and 10000 |
| `{{now}}` | `1711705800000` | Current epoch timestamp in milliseconds |

**Example response body:**

```json
{
  "id": "{{randomInt}}",
  "userId": "{{id}}",
  "token": "tok_{{randomId}}",
  "createdAt": "{{timestamp}}",
  "serverTime": {{now}}
}
```

---

### Import / Export

#### Export (from dashboard)

Click **Export** on any project to download a JSON file:

```json
{
  "id": "proj_1",
  "name": "Users API",
  "slug": "users-api",
  "description": "Mock for user management",
  "endpoints": [...],
  "createdAt": "2025-03-29T10:00:00.000Z",
  "updatedAt": "2025-03-29T10:00:00.000Z"
}
```

#### Import (on create page)

Click **Import JSON** on the `/create` page and select a `.json` file. Fields `name`, `description`, and `endpoints` are loaded into the form.

#### Import via API

```bash
# Create a project from a JSON file
curl -X POST https://mocka.qzz.io/api/mocks \
  -H "Content-Type: application/json" \
  \
  -d @my-mock.json
```

---

### Error Codes

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `201` | Created |
| `204` | No content (DELETE success, CORS preflight) |
| `400` | Bad request — missing required fields |
| `401` | Authentication required |
| `404` | Project or endpoint not found |

---

## Themes

Mocka supports **dark** and **light** themes. Click the sun/moon icon in the navbar to toggle. Your preference is saved in `localStorage`.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                                  # Landing page
│   ├── create/page.tsx                           # Mock creation form (auth required)
│   ├── dashboard/page.tsx                        # Mock management dashboard (auth required)
│   ├── demo/page.tsx                             # Live e-commerce demo (uses mock API)
│   ├── api/
│   │   ├── mocks/route.ts                        # CRUD API for mock projects
│   │   ├── stats/route.ts                        # Analytics API
│   │   └── mock/[userSlug]/[slug]/
│   │       ├── route.ts                          # Swagger page (mock base URL)
│   │       └── [...path]/route.ts                # Mock server endpoint (public)
│   ├── layout.tsx
│   └── globals.css                               # Dark + light theme variables
├── components/
│   ├── Navbar.tsx                                # Navigation with auth state
│   ├── EndpointForm.tsx                          # Endpoint configuration form
│   └── ThemeToggle.tsx                           # Dark/light mode toggle
├── middleware.ts                                 # Clerk middleware (Edge)
└── lib/
    ├── auth.tsx                                  # Clerk client-side auth hooks
    ├── auth-server.ts                            # Clerk server-side auth
    ├── types.ts                                  # TypeScript interfaces
    ├── store.ts                                  # Cloudflare D1 database layer
    └── utils.ts                                  # Helper functions
```

## Tech Stack

| | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Auth | [Clerk](https://clerk.com/) — GitHub, Email |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com/) via [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQLite at the edge |
| CLI | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) v4 |

## Self-Hosting

### Cloudflare Workers (recommended)

1. Fork this repo
2. Install dependencies: `npm install`
3. Login to Cloudflare: `npx wrangler login`
4. Create a D1 database:
   ```bash
   npx wrangler d1 create mocka-db
   ```
5. Update `wrangler.jsonc` with the database ID from the previous command
6. Apply the schema:
   ```bash
   npm run db:migrate
   ```
7. Set secrets:
   ```bash
   echo "pk_live_..." | npx wrangler secret put NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   echo "sk_live_..." | npx wrangler secret put CLERK_SECRET_KEY
   ```
8. Deploy:
   ```bash
   npm run deploy
   ```
9. Attach a custom domain:
   ```bash
   npx wrangler deploy --domain your-domain.com
   ```

### Docker (self-hosted Node.js)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

> Docker mode runs on Node.js without D1. You'll need to swap `src/lib/store.ts` with a compatible database adapter (PostgreSQL, SQLite, etc.) and set Clerk env variables.

## Database

Mocka uses **Cloudflare D1** (SQLite at the edge) for persistent storage. Data survives deployments and restarts.

**Schema:**

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  endpoints TEXT NOT NULL DEFAULT '[]',  -- JSON array
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_slug, slug)
);

CREATE TABLE request_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_slug TEXT NOT NULL,
  project_slug TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

**Commands:**

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Apply schema to production D1 |
| `npm run db:migrate:local` | Apply schema to local D1 |
| `npm run preview` | Build and preview locally with Cloudflare |
| `npm run deploy` | Build and deploy to Cloudflare Workers |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

---

<div align="center">
  <sub>Built with Next.js 16 — Deployed on Cloudflare Workers</sub>
</div>
