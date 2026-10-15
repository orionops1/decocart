# DecoCart 🎉

> Sri Lanka's #1 Surprise Delivery Platform — Birthdays, Anniversaries, Midnight Deliveries & Flash Mobs.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS (PWA) |
| **Backend API** | Hono on Cloudflare Workers |
| **Database** | Cloudflare D1 (edge SQLite) |
| **Media Storage** | Cloudflare R2 |
| **Cache / Sessions** | Cloudflare KV |
| **Deployment** | Cloudflare Pages + Workers |

## Project Structure

```
decocart/
├── apps/
│   ├── web/          # React + Vite PWA (Cloudflare Pages)
│   └── api/          # Hono Worker API (Cloudflare Workers)
├── packages/         # Shared types & utilities (future)
├── package.json      # Root pnpm workspace
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- Cloudflare account (for deployment)

### Install Dependencies
```bash
pnpm install
```

### Local Development
```bash
# Start both frontend (port 5173) and API (port 8787) in parallel
pnpm dev
```

### Database (Cloudflare D1)
```bash
# Create local D1 database
cd apps/api
wrangler d1 create decocart-db

# Run migrations locally
pnpm db:migrate

# Run migrations on production
pnpm db:migrate:prod
```

### Deploy
```bash
# Deploy API Worker
cd apps/api && pnpm deploy

# Deploy frontend (Cloudflare Pages connects to GitHub automatically)
```

## Environment Variables

Copy `.env.example` to `.env` in each app folder.

### apps/api
```toml
# wrangler.toml — update with real IDs after:
# wrangler d1 create decocart-db  -> update database_id
# wrangler kv namespace create decocart-kv -> update kv id
```

### apps/web
```env
VITE_API_URL=/api
```
