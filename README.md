# Farm Bundle Tracker

Monorepo for a React (Vite) frontend, NestJS backend, and PostgreSQL database — with Docker-driven local development.

## Project layout

```text
farm-bundle-tracker/
├── apps/
│   ├── frontend/          # React + Vite
│   │   └── Dockerfile.dev
│   └── backend/           # NestJS API
│       └── Dockerfile.dev
├── docker-compose.yml
├── .env.example
└── package.json
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2
- Node.js 22+ (for initializing the apps on your host)

## Quick start

### 1. Initialize the apps manually

Create the frontend and backend in `apps/` using your preferred tooling. Expected paths:

- `apps/backend/` — NestJS project with `package.json` and `npm run start:dev`
- `apps/frontend/` — Vite React project with `package.json` and `npm run dev`

Example:

```bash
# NestJS backend
npx @nestjs/cli new backend \
  --directory apps/backend \
  --package-manager npm \
  --skip-git \
  --strict

# React + Vite frontend
npm create vite@latest apps/frontend -- --template react-ts
npm install --prefix apps/frontend
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if you need different ports or database credentials.

### 3. Start everything with Docker

```bash
docker compose up --build
```

| Service    | URL                         |
|------------|-----------------------------|
| Frontend   | http://localhost:5173       |
| Backend    | http://localhost:3000       |
| PostgreSQL | localhost:5432              |

Stop containers:

```bash
docker compose down
```

Reset database and node_modules volumes:

```bash
npm run docker:reset
```

## How Docker dev works

- **postgres** — PostgreSQL 16 with a persistent volume and health checks.
- **backend** — NestJS dev server (`npm run start:dev`) with source mounted for hot reload. `node_modules` lives in a named volume so host and container deps do not conflict.
- **frontend** — Vite dev server bound to `0.0.0.0:5173` so it is reachable from your browser outside the container.

Backend receives these env vars automatically:

```text
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=farm
DATABASE_PASSWORD=farm
DATABASE_NAME=farm_bundle_tracker
DATABASE_URL=postgresql://farm:farm@postgres:5432/farm_bundle_tracker
```

Wire these into your ORM (TypeORM, Prisma, etc.) when you add database support.

## Recommended app configuration

### NestJS — listen on all interfaces

In `apps/backend/src/main.ts`:

```typescript
await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
```

### Vite — proxy API requests to the backend

In `apps/frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://backend:3000',
        changeOrigin: true,
      },
    },
  },
});
```

Use `/api/...` from the frontend during development; Vite proxies to the NestJS container.

### Frontend env in Docker

`VITE_API_URL` is set in `docker-compose.yml` for build-time Vite variables. For runtime fetch calls to the backend from the browser, use `http://localhost:3000` (the published host port), not `http://backend:3000`.

## Useful commands

```bash
# Rebuild images after dependency changes
docker compose up --build

# Run only Postgres (e.g. while developing backend locally)
docker compose up postgres

# View logs for one service
docker compose logs -f backend

# Shell into a running container
docker compose exec backend sh
```

## Local development without Docker

You can run apps on the host after initializing them:

```bash
# Terminal 1 — database only
docker compose up postgres

# Terminal 2 — backend
cd apps/backend && npm install && npm run start:dev

# Terminal 3 — frontend
cd apps/frontend && npm install && npm run dev
```

Set `DATABASE_HOST=localhost` in a local `.env` for the backend when not using the Docker network.

## Troubleshooting

**`ENOENT: no such file or directory, open 'package.json'`**  
Initialize `apps/frontend` and `apps/backend` manually before running Docker.

**Port already in use**  
Change `FRONTEND_PORT`, `BACKEND_PORT`, or `POSTGRES_PORT` in `.env`.

**Backend cannot connect to Postgres**  
Wait for the postgres health check to pass, or confirm `DATABASE_HOST=postgres` (not `localhost`) inside the backend container.

**Stale dependencies after `npm install` on the host**  
Remove the named volume and rebuild:

```bash
docker compose down
docker volume rm farm-bundle-tracker_backend_node_modules farm-bundle-tracker_frontend_node_modules
docker compose up --build
```
