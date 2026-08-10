# Data architecture

PostgreSQL is the durable source of truth. Drizzle schemas live with the module
that owns the data, while a shared schema index gives the database connection
and schema tooling one composition point.

## Schema ownership

| Module | Tables | Purpose |
| --- | --- | --- |
| Users | `users` | Identity, unique email and username, password hash |
| Auth | `refresh_tokens` | Hashed rotating session tokens and replacement links |
| Farms | `farms`, `farm_memberships`, `farm_invites`, `farm_item_collections`, `farm_item_claims` | Collaboration, board state, roles, and invites |
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
- Every farm references one catalog version and stores the group's shared
  current season. Farm creation refuses to proceed until an active catalog is
  seeded.
- A collection is unique per farm and catalog slot and records the user and
  time. A claim is unique per farm and slot and references a membership by its
  primary key. Claim mutations transactionally verify that membership belongs
  to the same farm and currently has the owner or editor role.
- Membership removal cascades claims while collection attribution survives.
  Demotion to viewer also releases that member's claims transactionally.
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

The repository contains a baseline and a bundle-tracking migration. Fresh
databases apply them in order:

```bash
npm run db:migrate -w backend
```

After the schema exists, seed the catalog:

```bash
npm run db:seed:catalog -w backend
```

Both commands load the root `.env` through their workspace scripts. The
[setup guide](../development/setup.md) owns the complete database lifecycle.

CI applies migrations to an empty PostgreSQL service before seeding and running
HTTP integration tests. Future schema changes must be generated, reviewed, and
committed rather than applied with `db:push`.

Bundle, room, and farm progress is derived from collection rows. Claims are
stored separately but are released when their slot is collected or their N-of-M
bundle becomes complete; claims never contribute to completion.
