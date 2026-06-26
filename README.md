# Farm Bundle Tracker

Monorepo for a React (Vite) frontend, NestJS backend, and PostgreSQL database.

## Project layout

```text
farm-bundle-tracker/
├── apps/
│   ├── frontend/          # React + Vite
│   └── backend/           # NestJS API
├── docker-compose.yml     # PostgreSQL only
├── .env.example
└── package.json
```

## Prerequisites

- Node.js 22+
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2 (database only)

## Quick start

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if you need different ports or database credentials. The backend reads env vars from the root `.env` file.

### 3. Start PostgreSQL

```bash
npm run db:up
```

PostgreSQL runs at `localhost:5432` with the credentials from `.env`.

### 4. Apply database schema

```bash
npm run db:push -w backend
```

### 5. Start the backend

```bash
npm run dev:backend
```

API runs at http://localhost:3000

### 6. Start the frontend (when initialized)

```bash
npm run dev:frontend
```

Frontend runs at http://localhost:5173

| Service    | URL                    |
|------------|------------------------|
| Frontend   | http://localhost:5173  |
| Backend    | http://localhost:3000  |
| PostgreSQL | localhost:5432         |

## Useful commands

```bash
# Start / stop the database
npm run db:up
npm run db:down

# Wipe database volume (destructive)
npm run db:reset

# Drizzle (from repo root)
npm run db:push -w backend
npm run db:generate -w backend
npm run db:migrate -w backend
```

## Environment variables

The backend expects these in the root `.env`:

```text
PORT=3000
DATABASE_URL=postgresql://farm:farm@localhost:5432/farm_bundle_tracker
JWT_SECRET=secret
FRONTEND_URL=http://localhost:5173
```

`DATABASE_URL` must point at `localhost` (not `postgres`) because the backend runs on your host machine while only the database runs in Docker.

## Troubleshooting

**Port already in use**  
Change `PORT`, `FRONTEND_PORT`, or `POSTGRES_PORT` in `.env`.

**Backend cannot connect to Postgres**  
Make sure the database container is running (`npm run db:up`) and `DATABASE_URL` uses `localhost`.

**Missing env vars**  
Run backend commands via the root scripts (`npm run dev:backend`) so `DOTENV_CONFIG_PATH` points at the root `.env`. If you run from `apps/backend` directly, set `DOTENV_CONFIG_PATH=../../.env` first.
