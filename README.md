# Farm Bundle Tracker

Farm Bundle Tracker is a shared planning board for friends playing the same
Stardew Valley farm. It is designed to replace scattered chat messages with one
place to see the farm, invite the group, and—once the tracking board lands—show
which Community Center items are still needed and who has claimed them.

The project is also a deliberately complete engineering exercise: a React
client, a layered NestJS API, PostgreSQL persistence, rotating sessions,
role-based collaboration, validated reference data, and a roadmap toward
real-time synchronization and production delivery.

![Farm collaboration management screen](./docs/assets/farm-management.png)

*The current farm-management screen: owners can add members, assign roles,
share expiring invite links, and manage farm settings.*

## What works today

| Area | Current implementation | Next step |
| --- | --- | --- |
| Accounts | Registration, sign-in, rotating refresh sessions, sign-out | Integration and browser coverage |
| Farm collaboration | Farm CRUD, owner/editor/viewer membership, direct add, ownership transfer, multi-use invites | Complete permission-matrix tests |
| Community Center catalog | Versioned 1.6.15 manifest, 6 rooms, 30 bundles, 129 possible slots, validated idempotent seed | Read-only board API |
| Bundle tracking | Product and data-model requirements are agreed | Farm board, collection state, claims, and derived progress |
| Live updates and delivery | Designed in the v1 roadmap | Production deployment, then authenticated real-time sync |

The [living implementation plan](./docs/IMPLEMENTATION_PLAN.md) records what is
delivered and what remains without presenting roadmap work as finished.

## Engineering highlights

- The frontend is organized by product feature, with application composition
  and reusable UI kept at explicit boundaries.
- Backend modules separate HTTP presentation, application use cases, domain
  contracts, and Drizzle adapters. Repository ports keep persistence choices at
  the edge.
- Short-lived access tokens live only in memory. Rotating refresh tokens are
  stored as hashes and delivered through an HTTP-only cookie.
- Farm access is expressed as capabilities, not controller-specific role
  conditionals. Non-members cannot use authorization responses to discover a
  farm.
- The Community Center catalog is a versioned manifest with provenance,
  structural validation, a checksum, and guarded, transactional seeding.

## Stack

| Layer | Technology |
| --- | --- |
| Web client | React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS |
| API | NestJS 11, TypeScript, class-validator |
| Data | PostgreSQL 16, Drizzle ORM |
| Authentication | JWT access tokens, rotating refresh tokens, bcrypt |
| Tooling | npm workspaces, Jest, ESLint, GitHub Actions |

## Quick start

You need Node.js 24 and Docker with Compose v2.

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:push -w backend
npm run db:seed:catalog -w backend
```

Start the API and web client in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend runs at <http://localhost:5173> and the API at
<http://localhost:3000>. See the [development setup guide](./docs/development/setup.md)
for environment details, database lifecycle commands, and troubleshooting.

## Architecture at a glance

The browser application talks to a NestJS HTTP API, which owns authentication,
farm collaboration, catalog persistence, and PostgreSQL access. React Query
manages remote state in the client; domain-facing use cases and repository
ports keep backend policy separate from controllers and Drizzle queries.

Start with the [architecture overview](./docs/architecture/overview.md), then
continue into the [frontend](./docs/architecture/frontend.md),
[backend](./docs/architecture/backend.md), or
[data](./docs/architecture/data.md) guide.

## Documentation

- [Documentation handbook](./docs/README.md) — routes readers by task
- [Product requirements](./docs/PRD.md) — v1 problem, scope, and success criteria
- [Implementation plan](./docs/IMPLEMENTATION_PLAN.md) — delivered work and roadmap
- [Contributing](./CONTRIBUTING.md) — boundaries, checks, and definition of done
- [Architecture decisions](./docs/decisions.md) — consequential choices and tradeoffs
