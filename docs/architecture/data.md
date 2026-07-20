# Data architecture

PostgreSQL is the durable source of truth. Drizzle schemas live with the module
that owns the data, while a shared schema index gives the database connection
and schema tooling one composition point.

## Schema ownership

| Module | Tables | Purpose |
| --- | --- | --- |
| Users | `users` | Identity, unique email and username, password hash |
| Auth | `refresh_tokens` | Hashed rotating session tokens and replacement links |
| Farms | `farms`, `farm_memberships`, `farm_invites` | Collaboration boundary, roles, invite lifecycle |
| Catalogs | `catalog_versions`, `catalog_rooms`, `catalog_bundles`, `catalog_items`, `bundle_item_slots` | Shared versioned Community Center reference data |

The `users` table is referenced by auth and farm records, but the users module
owns its schema and repository contract. Catalog records are shared reference
data: users do not edit them, and future farm progress points to stable bundle
item slots rather than copying catalog facts per farm.

## Relationships and invariants

- A refresh token belongs to one user. Token hashes are unique; deleting a user
  cascades through their refresh tokens.
- A farm has many memberships. The `(farm_id, user_id)` pair is unique, and a
  partial unique index permits only one `owner` role per farm.
- Membership deletion is restricted by application rules for the owner. User
  deletion is restricted while farm membership or created invites still refer
  to that user.
- A farm has many invites. The database stores only a unique token hash;
  expiration and revocation determine activity.
- Deleting a farm is a soft delete through `deleted_at`. Membership lookups and
  farm reads exclude deleted farms. Dependent records remain until a future
  retention policy deliberately removes them.
- A catalog version owns rooms and items. Rooms own bundles; bundles own
  possible slots; each slot points to an item from the same logical catalog
  release.
- Positive and unique display orders preserve deterministic board rendering.
  Database checks enforce positive quantities and required-slot counts; manifest
  validation also proves that required slots do not exceed possible slots.

Ownership transfer requires two membership writes while the database's
single-owner index remains valid. The Drizzle adapter locks memberships and
performs the demotion and promotion in one transaction. Invite redemption also
uses a transaction so membership creation and the returned farm view agree.

## Catalog releases

The canonical manifest targets Stardew Valley 1.6.15. It contains six rooms,
30 bundles, and 129 possible bundle slots, including Vault payments represented
through one currency item so they use the same future progress model.

Each catalog version records a slug, game version, manifest revision, and
SHA-256 checksum. Loading the manifest validates stable slugs, uniqueness,
display order, quantities, quality levels, season data, complete references,
known N-of-M bundles, and several version-sensitive facts before any write.

The seed runs in one transaction and is safe to repeat. It distinguishes two
classes of change:

- Names, rewards, availability details, categories, and display order are
  seed-owned metadata and may update in place.
- Removing or renaming structural records, changing quantities or qualities,
  or changing required-slot rules is refused. That work requires an explicit
  migration or a new catalog version.

This policy keeps generated database identifiers stable for the per-farm state
that will refer to bundle item slots. Source provenance and detailed update
rules live beside the seed in the
[catalog README](../../apps/backend/src/modules/catalogs/infrastructure/seed/README.md).

## Current schema workflow

The repository contains Drizzle schemas but no committed migration files yet.
Local setup therefore applies the current schema directly:

```bash
npm run db:push -w backend
```

After the schema exists, seed the catalog:

```bash
npm run db:seed:catalog -w backend
```

Both commands load the root `.env` through their workspace scripts. The
[setup guide](../development/setup.md) owns the complete database lifecycle.

## Direction

Before production deployment, schema changes will move to generated, reviewed,
committed migrations executed by CI/CD. Until that workflow exists, docs must
not instruct contributors to run `db:migrate` on a fresh clone.

Bundle tracking will add per-farm state keyed by the stable bundle item slot:
absence means needed; a collection record captures who collected it and when;
a separate claim captures one member's intent. Bundle, room, and farm progress
will be derived from collection records and required-slot rules rather than
stored as mutable completion flags.
