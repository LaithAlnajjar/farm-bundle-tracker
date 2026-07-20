# Architecture decision log

This is a curated record of choices that materially shape the codebase. It is
not a diary of every dependency. Each entry states the tradeoff and the event
that would justify revisiting it.

## Feature-first frontend boundaries

**Context.** Product workflows change together more often than all components
of the same technical kind. A flat `components`, `hooks`, and `services`
structure would make feature ownership harder to see as the tracker grows.

**Decision.** Keep product pages, components, hooks, services, and types inside
their feature. Reserve `app` for composition and `shared` for proven
cross-feature primitives.

**Consequences.** A developer can follow one workflow without scanning the
whole client, and shared UI cannot acquire product dependencies. Some similar
code may remain duplicated until its stable reusable purpose is clear.

**Revisit when.** Multiple features need a coherent public domain module or a
client-side capability cannot be owned without circular dependencies.

## Layered backend with repository ports

**Context.** Authorization, session rotation, claims, and completion rules need
to remain testable without booting NestJS or PostgreSQL.

**Decision.** Organize backend modules into presentation, application, domain,
and infrastructure. Application use cases depend on domain-facing repository
and service interfaces; Nest modules bind concrete adapters through tokens.

**Consequences.** Business workflows can be tested with small fakes, and
Drizzle remains replaceable at the boundary. The structure costs more files
and mapping code than controller-to-ORM CRUD, so empty layers are not created
before a module has behavior for them.

**Revisit when.** A boundary repeatedly adds translation without isolating
policy or a module is demonstrably too small to benefit from the full shape.

## In-memory access tokens and rotating refresh cookies

**Context.** Persistent browser storage makes bearer tokens available to any
successful script injection. Cookie-only access tokens would add cross-site
request concerns to every API operation.

**Decision.** Keep short-lived JWT access tokens in frontend memory and send
them as bearer tokens. Store opaque refresh-token hashes in PostgreSQL, deliver
the raw token through an HTTP-only cookie, and rotate it on every refresh.

**Consequences.** Reloading requires session hydration, concurrent `401`
responses need one coordinated refresh, and the backend must track replacement
links and reuse. Long-lived credentials are unavailable to frontend JavaScript.

**Revisit when.** The frontend and API move to an origin/topology that makes
cookie policy impractical, or a centralized identity provider replaces local
sessions.

## Capability-based farm authorization

**Context.** Role checks scattered across controllers would drift as HTTP,
board, and real-time entry points multiply.

**Decision.** Map roles to named domain capabilities and authorize farm-scoped
actions through one application use case. Treat missing membership as not
found; reserve forbidden for known members without a capability.

**Consequences.** New transports can reuse the same policy, the permission
matrix is directly testable, and unauthorized callers cannot enumerate farms.
Every farm-scoped operation must still remember to request the correct
capability.

**Revisit when.** Permissions become resource- or condition-specific enough
that a static role-to-capability map no longer expresses them clearly.

## Versioned and validated catalog manifests

**Context.** Community Center data is shared reference material, but per-farm
progress will depend on stable slot identities. Ad hoc seed inserts could
silently change those identities or partially update production.

**Decision.** Keep a canonical typed manifest with provenance, a version slug,
revision, checksum, structural validation, and transactional idempotent seed.
Allow descriptive metadata updates but reject unplanned structural drift.

**Consequences.** Data changes are reviewable and safe to replay, and future
progress can point to stable records. Structural corrections require an
explicit migration or new catalog release rather than a convenient overwrite.

**Revisit when.** Multiple game versions or remixed per-farm catalogs require a
release model beyond one active standard manifest.

## Multi-use invites until expiry or revocation

**Context.** A friend group often joins from one shared link. Single-use links
would force an owner to generate and distribute a token per person without
providing meaningful protection for this trusted-user product.

**Decision.** Farm invites may be redeemed by multiple registered users for
eight days. Redemption creates an editor membership, is idempotent for an
existing member, and does not consume the link. Owners can revoke it early.

**Consequences.** Group onboarding stays low-friction. Anyone who receives the
active link can join as editor, so token entropy, expiration, owner-only invite
management, and revocation are essential.

**Revisit when.** The project opens to untrusted users, farms need admission
approval, or invite-level usage limits become a product requirement.
