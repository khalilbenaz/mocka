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
| **CORS Ready** | All endpoints include CORS headers by default |
| **Import / Export** | Save and share mock configurations as JSON files |
| **Shareable URLs** | Each mock project gets a unique, public base URL |
| **Swagger Page** | Visit a mock's base URL to see a Swagger-like listing of all its endpoints |
| **Persistent Storage** | Cloudflare D1 (SQLite at the edge) — data survives deployments |
| **Dark UI** | Clean, modern dark interface |

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

## How It Works

### 1. Create a mock project

Use the web UI at `/create` or send an authenticated POST request:

```bash
curl -X POST https://mocka.qzz.io/api/mocks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": "1",
    "name": "My API",
    "slug": "my-api",
    "description": "User management mock",
    "endpoints": [
      {
        "id": "e1",
        "method": "GET",
        "path": "/users",
        "statusCode": 200,
        "responseBody": "[{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}]",
        "contentType": "application/json",
        "headers": {},
        "delay": 0
      },
      {
        "id": "e2",
        "method": "POST",
        "path": "/users",
        "statusCode": 201,
        "responseBody": "{\"id\": 3, \"created\": true}",
        "contentType": "application/json",
        "headers": {},
        "delay": 0
      },
      {
        "id": "e3",
        "method": "GET",
        "path": "/users/:id",
        "statusCode": 200,
        "responseBody": "{\"id\": 1, \"name\": \"Alice\", \"email\": \"alice@example.com\"}",
        "contentType": "application/json",
        "headers": {},
        "delay": 100
      },
      {
        "id": "e4",
        "method": "DELETE",
        "path": "/users/:id",
        "statusCode": 204,
        "responseBody": "",
        "contentType": "application/json",
        "headers": {},
        "delay": 0
      }
    ]
  }'
```

### 2. Call your mock endpoints (no auth needed)

```bash
# List users
curl https://mocka.qzz.io/api/mock/{userSlug}/my-api/users

# Create a user
curl -X POST https://mocka.qzz.io/api/mock/{userSlug}/my-api/users

# Get a single user (path params supported)
curl https://mocka.qzz.io/api/mock/{userSlug}/my-api/users/42

# Delete a user
curl -X DELETE https://mocka.qzz.io/api/mock/{userSlug}/my-api/users/42
```

### 3. Manage from the dashboard

Go to [mocka.qzz.io/dashboard](https://mocka.qzz.io/dashboard) to view, expand, copy URLs, export configs, or delete your mock servers.

## API Reference

> **Note:** All management endpoints (`/api/mocks`) require authentication via Clerk session. Mock serving endpoints (`/api/mock/{userSlug}/{slug}/*`) are public.

### `POST /api/mocks` — Create a mock project

**Body:**

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "endpoints": [
    {
      "id": "string",
      "method": "GET | POST | PUT | PATCH | DELETE",
      "path": "/your/path",
      "statusCode": 200,
      "responseBody": "string",
      "contentType": "application/json",
      "headers": {},
      "delay": 0
    }
  ]
}
```

**Response:** `201` with the created project.

### `GET /api/mocks` — List your mock projects

**Response:** `200` with an array of your projects.

### `PUT /api/mocks` — Update a mock project

**Body:** Same as POST, must include `slug` of existing project you own.

### `DELETE /api/mocks?slug=my-api` — Delete a mock project

**Response:** `200` with `{ "success": true }`.

### `{METHOD} /api/mock/{userSlug}/{slug}/{path}` — Hit a mock endpoint

Matches the method and path against the project's endpoints and returns the configured response.

**Response headers always include:**
- `Access-Control-Allow-Origin: *`
- `X-Mock-Server: Mocka`
- `X-Mock-Project: {userSlug}/{slug}`

### `OPTIONS /api/mock/{userSlug}/{slug}/{path}` — CORS preflight

Returns `204` with full CORS headers.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                                  # Landing page
│   ├── create/page.tsx                           # Mock creation form (auth required)
│   ├── dashboard/page.tsx                        # Mock management dashboard (auth required)
│   ├── api/
│   │   ├── mocks/route.ts                        # CRUD API for mock projects
│   │   └── mock/[userSlug]/[slug]/
│   │       ├── route.ts                          # Swagger page (mock base URL)
│   │       └── [...path]/route.ts                # Mock server endpoint (public)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx                                # Navigation with auth state
│   └── EndpointForm.tsx                          # Endpoint configuration form
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
