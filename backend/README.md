<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Backend (NestJS)

This service powers the starter API. It exposes a minimal auth flow built with NestJS 11, CQRS command handlers, and Prisma ORM talking to PostgreSQL.

## Highlights

- CQRS login command/handler (`LoginCommand` → `LoginHandler`)
- BCrypt password hashing and JWT access tokens
- Prisma repository implementation (`PrismaUsersRepository`)
- Health check at `GET /api/health`

## Requirements

- Node.js 18+
- pnpm 9+
- PostgreSQL 16+
- (Optional) Redis 7+ if you plan to extend caching queues

## Environment

Configure `backend/.env`:

```env
DATABASE_URL="postgresql://cms:cms@localhost:5432/cms_starter"
APP_PORT=3000
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1h"
```

Environment variables are loaded globally via `ConfigModule.forRoot`.

## Development workflow

```powershell
# Install dependencies
pnpm install

# Generate Prisma client
pnpm --filter backend prisma:generate

# Apply migrations & seed
pnpm --filter backend prisma:deploy
pnpm --filter backend prisma:seed

# Start the API with auto-reload
pnpm --filter backend start:dev
```

The service listens on <http://localhost:3000/api>. Seeded credentials are `admin / admin123`.

## Testing & linting

| Command                          | Purpose                          |
| -------------------------------- | -------------------------------- |
| `pnpm --filter backend lint`     | Run ESLint on the Nest app       |
| `pnpm --filter backend test`     | Unit tests (Jest)                |
| `pnpm --filter backend test:e2e` | End-to-end tests using Supertest |

## Project layout

```
backend/
├── apps/base-system/src/
│   ├── api/              # HTTP controllers (AuthController)
│   ├── infra/            # Prisma service + repositories
│   └── lib/              # CQRS login command + domain layer
├── prisma/
│   ├── schema.prisma     # User model
│   ├── migrations/       # SQL migration history
│   └── seeds/            # Default admin seed
└── Dockerfile
```

Extend the domain by adding new commands/queries under `lib/bounded-contexts` and exposing them through controllers inside `api/`.
