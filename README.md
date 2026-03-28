<div align="center">

# Mocka

**Mock anything. Instantly.**

Create mock API servers in seconds. Define your endpoints, get a live URL, and test your frontend without waiting for the backend.

[Live Demo](https://mock-a.netlify.app) | [Create a Mock](https://mock-a.netlify.app/create)

</div>

---

## What is Mocka?

Mocka is a free, open-source mock server builder. It lets you define API endpoints with custom responses, status codes, headers, and latency — then serves them at a live URL you can use immediately.

**No signup. No config files. No backend required.**

## Features

- **All HTTP Methods** — GET, POST, PUT, PATCH, DELETE
- **Custom Responses** — JSON, XML, HTML, plain text with any status code
- **Custom Headers** — Add any response headers you need
- **Simulated Latency** — Add delays (ms) to mimic real-world network conditions
- **Path Parameters** — Support for `:param` style dynamic segments (e.g. `/users/:id`)
- **CORS Enabled** — All endpoints include CORS headers by default
- **Import/Export** — Save and share mock configurations as JSON files
- **Shareable URLs** — Each mock project gets a unique, shareable base URL
- **Dark UI** — Clean, modern dark interface

## Quick Start

### Use the hosted version

1. Go to [mock-a.netlify.app/create](https://mock-a.netlify.app/create)
2. Name your project and add endpoints
3. Click **Create Mock Server**
4. Your mock is live — use the base URL in your frontend

### Run locally

```bash
git clone https://github.com/khalilbenaz/mocka.git
cd mocka
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

### 1. Create a mock project

Use the web UI at `/create` or send a POST request:

```bash
curl -X POST https://mock-a.netlify.app/api/mocks \
  -H "Content-Type: application/json" \
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

### 2. Call your mock endpoints

```bash
# List users
curl https://mock-a.netlify.app/api/mock/my-api/users

# Create a user
curl -X POST https://mock-a.netlify.app/api/mock/my-api/users

# Get a single user (path params supported)
curl https://mock-a.netlify.app/api/mock/my-api/users/42

# Delete a user
curl -X DELETE https://mock-a.netlify.app/api/mock/my-api/users/42
```

### 3. Manage from the dashboard

Go to [mock-a.netlify.app/dashboard](https://mock-a.netlify.app/dashboard) to view, expand, copy URLs, export configs, or delete your mock servers.

## API Reference

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

### `GET /api/mocks` — List all mock projects

**Response:** `200` with an array of projects.

### `PUT /api/mocks` — Update a mock project

**Body:** Same as POST, must include `slug` of existing project.

### `DELETE /api/mocks?slug=my-api` — Delete a mock project

**Response:** `200` with `{ "success": true }`.

### `{METHOD} /api/mock/{slug}/{path}` — Hit a mock endpoint

Matches the method and path against the project's endpoints and returns the configured response.

**Response headers always include:**
- `Access-Control-Allow-Origin: *`
- `X-Mock-Server: Mocka`
- `X-Mock-Project: {slug}`

### `OPTIONS /api/mock/{slug}/{path}` — CORS preflight

Returns `204` with full CORS headers.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                            # Landing page
│   ├── create/page.tsx                     # Mock creation form
│   ├── dashboard/page.tsx                  # Mock management dashboard
│   ├── api/
│   │   ├── mocks/route.ts                 # CRUD API for mock projects
│   │   └── mock/[slug]/[...path]/route.ts  # Mock server endpoint
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   └── EndpointForm.tsx
└── lib/
    ├── types.ts                            # TypeScript interfaces
    ├── store.ts                            # In-memory data store
    └── utils.ts                            # Helper functions
```

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Hosting:** [Netlify](https://netlify.com) with `@netlify/plugin-nextjs`

## Self-Hosting

### Netlify (recommended)

1. Fork this repo
2. Connect to Netlify via "Import an existing project"
3. Deploy — `netlify.toml` handles everything

### Docker

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

## Persistence

The current version uses an **in-memory store** — data resets on server restart. For production persistence, swap `src/lib/store.ts` with:

| Option | Free Tier | Notes |
|--------|-----------|-------|
| Supabase | 500 MB | PostgreSQL, auth included |
| Turso | 8 GB | SQLite on the edge |
| Upstash Redis | 10K cmds/day | Serverless Redis |
| PlanetScale | 1 GB | MySQL-compatible |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

---

<div align="center">
  <sub>Built with Next.js. Hosted on Netlify.</sub>
</div>
