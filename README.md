# CMS Starter Template

A batteries-included starter that pairs a lean NestJS backend with a single-page Vue dashboard. It keeps the clean pieces—JWT auth, Prisma, Docker, Vue Router—and trims everything else so you can ship features right away.

## What's inside

- **Backend** – NestJS 11 with CQRS-style login flow, Prisma ORM, and PostgreSQL/Redis integrations.
- **Frontend** – Vue 3 + Vite with a single dashboard route and fetch-based auth UI.
- **Tooling** – pnpm workspace, ESLint/TypeScript configs, and Docker Compose for one-command local stacks.

## Prerequisites

- Node.js 18+
- pnpm 9+
- Docker (optional but recommended for running Postgres + Redis)

## Quick start with Docker

```powershell
pnpm install
docker compose up --build
```

Services boot with the following defaults:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000/api>
- Admin credentials: `admin / admin123`

## Local development (without Docker)

1. Install dependencies:

```powershell
pnpm install
pnpm --filter backend prisma:generate
```

2. Start Postgres + Redis locally and update `backend/.env` if needed.
3. In one terminal run the backend:

```powershell
pnpm --filter backend prisma:deploy
pnpm --filter backend prisma:seed
pnpm --filter backend start:dev
```

4. In another terminal start the frontend:

```powershell
pnpm --filter frontend dev
```

## Project layout

```
cms-starter-template/
├── backend/          # NestJS app (CQRS login, Prisma, seeds)
│   └── prisma/       # Schema, migration, seed script
├── frontend/         # Vue 3 dashboard served by Vite
└── docker-compose.yml
```

## Useful scripts

| Command                             | Description                         |
| ----------------------------------- | ----------------------------------- |
| `pnpm --filter backend start:dev`   | Run the NestJS API with live reload |
| `pnpm --filter backend prisma:seed` | Seed the admin user into Postgres   |
| `pnpm --filter frontend dev`        | Launch Vite dev server              |
| `pnpm --filter frontend build`      | Produce production assets           |
| `pnpm --filter frontend lint`       | Lint Vue + TypeScript source        |

## Next steps

- Add new Prisma models and CQRS handlers in `backend/apps/base-system/src/lib`.
- Expand the dashboard or connect real data by calling additional backend routes.
- Adjust Docker configuration for custom deployment targets.

Enjoy building! The template stays intentionally small so you can grow it to fit your product.
