# Development setup

This is the source of truth for running Farm Bundle Tracker locally. The web
client and API run on the host; Docker runs PostgreSQL.

## Prerequisites

- Node.js 24
- npm, included with Node.js
- Docker Engine or Docker Desktop with Compose v2

The repository uses npm workspaces. Install dependencies once from the root;
do not install each application independently.

## First run

### 1. Install dependencies

```bash
npm install
```

### 2. Create the local environment

```bash
cp .env.example .env
```

The repository development scripts and backend database scripts load this root
file. A direct Nest start command from the backend workspace requires
`DOTENV_CONFIG_PATH=../../.env`. Keep secrets local; `.env` must not be
committed.

| Variable | Purpose | Example/default in `.env.example` |
| --- | --- | --- |
| `POSTGRES_USER` | Local database user | `farm` |
| `POSTGRES_PASSWORD` | Local database password | `farm` |
| `POSTGRES_DB` | Local database name | `farm_bundle_tracker` |
| `POSTGRES_PORT` | Host port published by Compose | `5432` |
| `PORT` | API listen port | `3000` |
| `DATABASE_URL` | Host-side PostgreSQL connection | `postgresql://farm:farm@localhost:5432/farm_bundle_tracker` |
| `JWT_SECRET` | Access-token signing secret | Development placeholder; replace outside local work |
| `JWT_ACCESS_EXPIRES_IN` | Access-token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token and cookie lifetime | `7d` |
| `REFRESH_COOKIE_SAME_SITE` | Refresh-cookie SameSite policy | `lax` |
| `FRONTEND_PORT` | Vite development-server port | `5173` |
| `FRONTEND_URL` | Comma-separated allowed browser origins | `http://localhost:5173` |
| `VITE_API_URL` | API base URL compiled into the web client | `http://localhost:3000` |

Optional refresh-cookie variables supported by the API are
`REFRESH_COOKIE_NAME` and `REFRESH_COOKIE_PATH`. Their defaults are
`refresh_token` and `/auth`. The cookie is automatically secure when
`NODE_ENV=production`.

### 3. Start PostgreSQL

```bash
npm run db:up
```

The copied environment publishes PostgreSQL on `localhost:5432`. Without an
environment override, the Compose file's fallback host port is `5435`; keeping
the copied `.env` and `DATABASE_URL` aligned avoids that ambiguity.

### 4. Apply the schema

```bash
npm run db:push -w backend
```

The repository does not yet contain committed Drizzle migrations. `db:push` is
therefore the supported fresh-development workflow. Migration generation and
`db:migrate` are reserved for the migration workflow tracked in Phase 0; do not
use them as fresh-clone instructions yet.

### 5. Seed the catalog

```bash
npm run db:seed:catalog -w backend
```

The seed validates the complete manifest and writes it transactionally. It is
safe to rerun and refuses unexpected structural drift.

### 6. Start the applications

Run these in separate terminals from the repository root:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

| Service | Address |
| --- | --- |
| Frontend | <http://localhost:5173> |
| API | <http://localhost:3000> |
| PostgreSQL | `localhost:5432` with the example environment |

Register a local account in the browser, create a farm, and use its management
page to exercise memberships and invite links.

## Daily database commands

```bash
# Start PostgreSQL without recreating an existing volume
npm run db:up

# Stop containers while retaining the database volume
npm run db:down

# Stop containers and delete the database volume
npm run db:reset
```

`db:reset` is destructive. After using it, run `db:up`, `db:push`, and the
catalog seed again.

Drizzle commands available in the backend workspace:

```bash
npm run db:push -w backend
npm run db:generate -w backend
npm run db:migrate -w backend
npm run db:seed:catalog -w backend
```

Only `db:push` and `db:seed:catalog` are part of today's documented local
workflow. See [data architecture](../architecture/data.md) for the intended
transition to committed migrations.

## Useful application checks

```bash
npm test -w backend -- --runInBand
npm run build -w backend
npm run build -w frontend
npm run lint -w frontend
```

The backend `lint` and `format` scripts use write modes and can modify source
files. Run them intentionally and inspect the diff.

## Troubleshooting

### The API cannot connect to PostgreSQL

Check that the container is healthy with `docker compose ps`. Because the API
runs on the host, `DATABASE_URL` must use `localhost`, not `postgres`. Its port
must match `POSTGRES_PORT`.

### A port is already in use

Change the corresponding values in `.env`. Keep `POSTGRES_PORT` and the port in
`DATABASE_URL` identical. If the frontend port changes, update `FRONTEND_URL`
as well so credentialed CORS accepts it.

### The API reports missing environment variables

Use `npm run dev:backend` from the repository root. If you intentionally start
the backend from its workspace, set `DOTENV_CONFIG_PATH=../../.env` or use the
workspace scripts that already provide it.

### Tables or catalog records are missing

Run `npm run db:push -w backend`, then
`npm run db:seed:catalog -w backend`. The seed does not create tables.

### Authentication works once and then fails

Confirm the frontend uses the exact origin listed in `FRONTEND_URL` and that
the browser accepts the HTTP-only refresh cookie. The frontend and API calls
must both use matching localhost hostnames rather than mixing `localhost` and
`127.0.0.1`.
