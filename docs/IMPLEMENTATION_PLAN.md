# Farm Bundle Tracker — v1 Implementation Plan

Status: living v1 roadmap
Last reconciled with the repository: 2026-07-20
Scope source: [PRD.md](./PRD.md) — this plan describes **what** to build and in
what order, not how. Each phase states its goal and its done criteria. Sizing
assumes ~5 focused hours/week with no hard deadline; a "phase" is roughly one
to three weeks at that pace.

## Progress Snapshot

Work has overlapped the original phase boundaries; a phase is complete only
when its done criteria are met, not when its main code exists.

| Phase | Status | Delivered | Remaining before done |
|---|---|---|---|
| 0 — Test & CI Foundation | In progress | Backend use-case tests and a minimal CI test job | Real-Postgres HTTP tests, full lint/typecheck/build gates, committed migrations |
| 1 — Complete the Bundle Catalog | In progress | Schema, full 1.6.15 manifest, validation, provenance, transactional idempotent seed | Read-only catalog API and broader automated seed coverage |
| 2 — Membership, Invites & Authorization | In progress | Memberships, roles, direct add, eight-day multi-use invites, ownership transfer, authorization policy, management UI | Permission-matrix integration coverage and end-to-end acceptance of both join paths |
| 3 — Bundle Tracking Core | Planned | Product and domain requirements agreed | Per-farm state, claims, board API and UI, derived progress |
| 4 — Production Deployment & CD | Planned | Deployment goals agreed | Production topology, automated delivery, backups and tested restore |
| 5 — Real-Time Collaboration | Planned | Collaboration requirements agreed | Transport decision, authenticated push, reconciliation and tests |
| 6 — Hardening & v1 Close-Out | Planned | Success criteria agreed | Browser E2E, resilience, operational hardening and real-usage review |

## Ordering Rationale

Two deliberate ordering choices, both worth knowing before reading the phases:

1. **Testing and CI come first, not last.** They are resume targets, and
   retrofitting them is how they end up shallow. Phase 0 sets the pattern on
   the *existing* auth/farms code, so every later phase lands with tests in an
   already-green pipeline. *(Learning-over-speed choice: writing tests for
   code you didn't just write is slower, but it forces you to understand the
   existing layering — flagging per PRD goal 3.)*
2. **Deployment comes before real-time.** The moment the tracker is usable
   (end of Phase 3), it goes live so the friend group starts using it with
   plain refetch-based updates. Real-time then ships as an upgrade to a
   *running* product — which is both the stronger learning experience
   (deploying changes to a live system, migration discipline for real) and the
   faster route to PRD goal 1. The alternative (real-time first, deploy last)
   delays real usage by a month for no product gain.

## Milestones

- **M1 — Trackable (end of Phase 3):** the full loop works locally: seed
  catalog, invite a friend, mark items, claim items.
- **M2 — Live (end of Phase 4):** public HTTPS URL, auto-deploy on merge,
  friends actually using it.
- **M3 — Collaborative (end of Phase 5):** live sync between members; the
  headline resume feature works in production.
- **M4 — v1 done (end of Phase 6):** PRD §10 success criteria all check off.

---

## Phase 0 — Test & CI Foundation

**Status:** in progress. Unit-level backend coverage and a minimal GitHub
Actions job exist. The real-database integration harness, complete CI gates,
and committed migration workflow are still required by this phase.

**Goal:** every subsequent phase is developed against a pipeline that already
gates changes, using test patterns proven on the existing code.

**What:**

- Choose and document the backend testing approach at two levels: unit tests
  for domain/application code (no framework, no database) and integration
  tests for the HTTP layer against a real Postgres instance.
- Prove the patterns by covering what exists today: the auth use cases
  (token rotation and reuse detection are genuinely test-worthy) and the farms
  CRUD ownership rules.
- Stand up continuous integration on the repository: lint, typecheck, unit
  and integration tests, and builds for both apps, blocking merges on failure.
- Adopt migration discipline now: switch from push-style schema syncing to
  generated, committed migrations, since a production database is coming in
  Phase 4 and every phase after this one changes schema.

**Done when:** CI runs on every PR and blocks red merges; existing auth and
farm behavior is covered by unit tests; at least one end-to-end HTTP
integration test (register → sign in → create farm → list farms) runs against
a real Postgres in CI; schema changes flow through committed migrations.

**Resume signal:** automated testing, CI/CD (the CI half).

---

## Phase 1 — Complete the Bundle Catalog

**Status:** in progress. The versioned schema, complete standard manifest,
validation, provenance record, checksum, and guarded seed are implemented. The
read-only catalog API and explicit automated seed coverage remain.

**Goal:** the full vanilla Community Center dataset exists in the database as
versioned reference data, exposed read-only.

**What:**

- Model the catalog required by PRD §6: the bundle↔item association with
  per-slot quantity and minimum quality, and the per-bundle slots-required
  count. This schema work is implemented.
- Build an idempotent seeding mechanism for catalog data — re-runnable
  without duplicating or clobbering, since the same mechanism must later run
  against production.
- Enter the complete vanilla dataset: all rooms, bundles, bundle items, slot
  rules, rewards, and item categories/seasonality needed by the board UI.
- Expose the catalog through read-only endpoints shaped for the board:
  rooms → bundles → item slots in display order.
- Add automated dataset validation: structural checks (counts per room,
  every bundle's slots-required ≤ its item count, no orphans) plus spot checks
  of known-tricky bundles.

**Done when:** a fresh database can be migrated and seeded to the full vanilla
catalog in one documented step; the catalog endpoints return the complete
board structure; dataset validation runs in CI and passes.

**Resume signal:** clean architecture / domain modeling — this is the phase
where the catalog module earns its layered structure.

**Learning note:** the dataset entry itself is grunt work (~30 bundles). Doing
it via a reviewable, validated seed file rather than ad-hoc inserts is the
learning-over-speed choice, and it's what makes production seeding safe later.

---

## Phase 2 — Membership, Invites & Authorization

**Status:** in progress. The backend and frontend collaboration flows are
implemented, including direct addition, ownership transfer, and invite
management. The phase remains open until its permission matrix and join flows
have integration coverage and acceptance evidence.

**Goal:** farms stop being single-user; access is governed by a real
role-based authorization layer.

**What:**

- Introduce farm membership with the three roles (owner/editor/viewer);
  creating a farm makes the creator its owner; "my farms" becomes "farms I'm
  a member of."
- Invites, both flavors from the PRD: a shareable link that is multi-use for
  eight days unless revoked, and direct add by username/email. Redeeming an
  active invite creates an editor membership and does not consume the link.
- Membership management for owners: change roles, remove members; sensible
  edge rules decided and tested (owner can't demote themselves into an
  ownerless farm; leaving vs. removal).
- A farm-scoped authorization policy in the application layer — a single
  place that answers "may this user do this action on this farm" — replacing
  the current owner-only checks, and enforced by every farm-scoped endpoint
  (including all of Phase 3's, and eventually the real-time channel).
- Frontend: farm list reflects membership; farm creation, invite management,
  join-via-link flow, and a members panel for owners.
- Tests: the PRD §7 permission matrix, encoded as integration tests, plus
  invite lifecycle unit tests.

**Done when:** two real accounts can share a farm via link *and* via direct
add; every farm endpoint enforces the matrix; the permission matrix tests
pass in CI; a viewer can see but not touch.

**Resume signal:** authorization done properly (part of the clean-architecture
story); testing depth (the matrix suite).

---

## Phase 3 — Bundle Tracking Core

**Status:** planned.

**Goal:** the actual product: a farm's bundle board where members mark items
collected and claim outstanding work. **Milestone M1.**

**What:**

- Per-farm item state: mark a bundle item slot collected / not collected,
  recording who and when; derived bundle/room/farm completion computed from
  slot state and the slots-required rule — never stored as editable state.
- Claims: claim, release, and reassign a slot (any editor, per PRD); at most
  one claimant per slot; claims and collection state are independent.
- Endpoints for the board (full farm board state in one shape the UI can
  render), for slot mutations, and for claim mutations — all behind the
  Phase 2 policy.
- Frontend: the farm bundle board (rooms → bundles → slots) built on the
  existing farm-ui components; one-tap collect toggle; claim controls showing
  who's getting what; a "my claims" view; progress at bundle/room/farm level;
  comfortable on a phone (this phase includes the mobile layout pass for the
  board).
- Sync in this phase is refetch-based (query invalidation / focus refetch) —
  deliberately good enough to use, replaced in Phase 5.
- Tests: completion-derivation rules as domain unit tests (the N-of-M slot
  logic is the heart of the domain); board and mutation endpoints as
  integration tests including role enforcement.

**Done when:** the full loop works locally end to end — create farm, invite a
second account, both mark and claim items on the real vanilla board, progress
derives correctly, a phone-sized viewport is comfortable for flows 3–5 of the
PRD.

**Resume signal:** clean domain modeling (completion rules, claim semantics).

---

## Phase 4 — Production Deployment & Continuous Delivery

**Status:** planned.

**Goal:** the tracker is live and friends are using it. **Milestone M2.**

**What:**

- Containerize both applications for production use, distinct from the dev
  setup; compose the production topology: reverse proxy with TLS, backend,
  frontend, Postgres.
- Provision a small VPS; establish secrets/environment management,
  a non-root deploy story, and firewalling appropriate to a hobby box.
- Extend CI into CD: merging to main builds, runs migrations against
  production safely, deploys, and smoke-checks the deployment.
- Database backups on a schedule, plus a **tested, documented restore** —
  a backup that's never been restored doesn't count.
- Onboard the friend group for real; treat their first week of usage as
  acceptance testing for PRD success criterion 1.

**Done when:** public HTTPS URL; merge-to-main deploys with zero manual steps
including migrations; restore procedure has been executed successfully at
least once; the friend group has active accounts and a live farm.

**Resume signal:** production deployment, CI/CD (the CD half).

**Learning note:** VPS-over-PaaS was chosen explicitly for learning (Linux,
TLS, networking, backups). Expect this phase to feel slower than the code
phases; that's the point.

---

## Phase 5 — Real-Time Collaboration

**Status:** planned. The transport choice remains open until this phase starts.

**Goal:** members viewing the same farm see each other's changes within ~2
seconds, no refresh. **Milestone M3.**

**What:**

- An authenticated push channel scoped per farm: connecting requires a valid
  session, subscribing to a farm requires membership (reusing the Phase 2
  policy — the authz layer must cover both HTTP and the socket).
- Server-side events for the things that change a board: slot collected /
  uncollected, claim changes, membership/role changes; clients apply them to
  local state rather than blindly refetching everything.
- Resilience semantics decided and implemented: reconnect with resync (a
  rejoining client must end up consistent, not just receive future events),
  and a defined answer for events missed while disconnected.
- Frontend integration with the existing query cache and mutation flow,
  including how optimistic local updates reconcile with echoed server events.
- Optional stretch, only if the phase lands early: presence ("who's looking
  at the board now").
- Tests: gateway authorization (non-members can't subscribe), event flow
  integration coverage, reconnection/resync behavior.

**Done when:** two browsers on two accounts see each other's changes in ≤ 2
seconds in production; killing and restoring a connection leaves the board
consistent; socket-level authorization has test coverage; deployment topology
(proxy) supports the persistent connections.

**Resume signal:** the headline — real-time collaboration, done with auth,
resync, and tests rather than as a demo.

**Open decision (start of phase):** transport choice — WebSockets vs.
server-sent events. Lean WebSockets for the richer resume story and presence
option; SSE is the fallback if proxy/ops friction eats the phase.

---

## Phase 6 — Hardening & v1 Close-Out

**Status:** planned.

**Goal:** close the gap between "works" and "finished"; check off PRD §10.
**Milestone M4.**

**What:**

- End-to-end browser tests for the critical flows (invite → join → mark →
  claim → see it live), running in CI against a production-like stack.
- A deliberate pass over error, loading, empty, and offline-ish states
  (connection lost banners, retry affordances) and a final mobile polish pass.
- Light operational hardening appropriate to scale: rate limiting on auth and
  invite redemption, structured logs, a health endpoint wired into deploy
  smoke checks.
- Keep the engineering handbook aligned with delivered behavior and add
  production operations, backup, and restore documentation from the topology
  implemented in Phase 4.
- A v1 review against PRD §10, item by item, with whatever small fixes fall
  out of a real season of group usage.

**Done when:** every PRD §10 criterion is demonstrably true, and the E2E suite
guards the flows that would embarrass you in a demo or an interview.

**Resume signal:** testing (the E2E layer); the overall "this person finishes
things" signal.

---

## Cross-Cutting Concerns (all phases)

- **Layering:** new backend modules follow the established
  domain / application / infrastructure / presentation structure with
  dependencies pointing inward; the frontend follows
  [architecture/frontend.md](./architecture/frontend.md) — new features as
  `features/<name>` with pages/components/hooks/services, shared primitives
  only when genuinely shared.
- **Migrations:** from Phase 0 onward, every schema change is a committed,
  generated migration; production migrations run only through the deploy
  pipeline from Phase 4 onward.
- **Testing pyramid:** domain rules → unit tests; API contract and permission
  matrix → integration tests; a thin set of E2E flows in Phase 6. Each phase's
  "done" includes its tests green in CI — no test-debt phases.
- **Scope discipline:** anything from PRD "non-goals" that starts looking
  tempting mid-phase (activity feed, notifications, remix support) gets a note
  in a backlog section of this file instead of code.

## Post-v1 Backlog (explicitly deferred, not rejected)

- Activity feed / history of who did what.
- Notifications when the app is closed.
- Remixed bundle variant support (the catalog versioning already leaves the
  door open).
- Installable PWA packaging.
- Item artwork, subject to resolving asset licensing.
