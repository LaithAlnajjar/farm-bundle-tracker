# Farm Bundle Tracker — Product Requirements Document (v1)

Status: agreed scope for v1 (2026-07-09)
Companion document: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

## 1. Problem Statement

A friend group playing a shared Stardew Valley save works on Community Center
bundles together, but coordination happens in chat messages and memory. The
result: two people grow the same crop for the same bundle slot, nobody
remembers who promised to catch the walleye, and no one can see at a glance
what the group still needs this season.

Farm Bundle Tracker gives each shared save ("farm") a live, shared bundle
board: what's been collected, what's still needed, and who has claimed what —
updatable in a couple of taps from a phone while the game is running.

## 2. Target Users

- **Primary:** the maintainer and their friend group — roughly 2–6 players per
  farm, a handful of farms total, well under 20 registered users. Everyone is
  trusted; this is a coordination tool, not a product hardened against
  strangers.
- **Secondary:** engineers and hiring managers reading the codebase. The
  project doubles as a resume artifact, so the *way* it is built (see §9) is a
  requirement, not an accident.

## 3. Goals (in priority order)

1. **A tool the group actually keeps using** across a full playthrough: low
   friction to update, clear at a glance who's getting what.
2. **A strong, specific resume signal** with demonstrable depth in: real-time
   collaboration, automated testing, CI/CD, production deployment, and clean
   architecture / domain modeling.
3. **A learning vehicle** — where a choice trades speed for learning, the plan
   says so explicitly so the maintainer can weigh in.

## 4. Scope

### In scope for v1

- **Full vanilla Community Center catalog**, seeded as shared reference data:
  all rooms, all bundles, all bundle items — including per-item quantity and
  quality requirements and each bundle's "N of M slots required" rule (e.g.
  Quality Crops requires 3 of its 4 slots).
- **Farm membership**: joining via shareable invite code/link *and* manual add
  by username/email. Three roles: **owner**, **editor**, **viewer**.
- **Item tracking**: each bundle item slot on a farm is either *needed* or
  *collected* — a single self-reported toggle, reversible.
- **Claims**: any editor can claim an outstanding item ("I'll get this"),
  unclaim it, or reassign it to someone else. Trust-based; no approval step.
- **Real-time sync**: people viewing the same farm see each other's changes
  within a couple of seconds, without refreshing.
- **Responsive web UI** that works well in a phone browser; online-only.
- **Derived progress**: bundle completion (collected slots ≥ slots required),
  room completion, and overall farm completion are computed, never manually
  set.

### Explicit non-goals for v1

- **Anything beyond Community Center bundles** — no Joja route, museum
  donations, shipping collections, or perfection tracking.
- **Remixed (randomized per-save) bundle variants** — every farm gets the
  vanilla set. The domain model must not paint us into a corner (the catalog
  is versioned and farms track progress against catalog entries, so per-farm
  bundle selection can be added later), but v1 builds no UI or data for it.
- **Offline support** — the app assumes a connection; no queued writes.
- **Notifications outside the open page** — no push/email. (Candidate for
  post-v1, not rejected forever.)
- **Activity feed / audit history** — post-v1 candidate.
- **Game artwork/sprites** — avoids asset-licensing questions; the existing
  farm-ui visual language (wood boards, note cards, season tags) carries the
  theme. Item facts (names, categories, requirements) come from community
  reference data.
- **Native or installable app** — plain responsive web.

## 5. Core User Flows

1. **Create a farm and invite friends.** Owner creates a farm; the vanilla
   bundle board exists immediately. Owner generates an invite link/code (which
   can be revoked or expire) or adds a registered friend directly by
   username/email.
2. **Join a farm.** A friend opens the invite link (registering first if
   needed) and lands on the farm's bundle board as an editor.
3. **Browse the bundle board.** Rooms → bundles → item slots, with progress
   visible at every level and season-relevant items easy to spot. Readable and
   tappable on a phone.
4. **Update an item.** One tap marks a slot collected (or un-marks it —
   mistakes happen). Everyone else viewing the farm sees the change within a
   couple of seconds, including updated bundle/room progress.
5. **Claim work.** An editor claims an outstanding item; the board shows who
   has claimed what. A "my claims" view answers "what am I supposed to be
   getting?" and a per-person view answers "what is everyone getting this
   season?" Claims can be released or handed to someone else by any editor.
6. **Manage the farm.** The owner renames the farm, manages invites, changes
   member roles, removes members, or deletes the farm.
7. **Celebrate completion.** When a bundle's required slots are filled it
   reads as done; same for rooms and, eventually, the whole Community Center.

## 6. Conceptual Domain Model

Two clearly separated areas, matching the existing module layout:

**Catalog (static, versioned, shared reference data — no user writes):**

- `CatalogVersion` — a dataset release tied to a game version.
- `Room` — e.g. Pantry, Crafts Room; ordered; has a completion reward.
- `Bundle` — belongs to a room; ordered; has a completion reward and a
  **slots-required count** (how many of its items are needed).
- `Item` — a game item with a category (crops, fish, minerals, …).
- `BundleItem` — the association: which item, in which bundle, at what
  **quantity** and **minimum quality**. This is the unit everything per-farm
  points at. The implemented schema names this record `bundle_item_slots` and
  already stores both the slot requirements and each bundle's required count.

**Farm collaboration (per-farm, user-written):**

- `Farm` — a shared save. In v1 it gains a reference to the catalog version it
  plays against and a shared current season, initially Spring.
- `FarmMembership` — user ↔ farm with a role (owner / editor / viewer).
- `FarmInvite` — a shareable, multi-use code with lifecycle (created, expires,
  revoked). Redemption creates an editor membership and does not consume an
  otherwise active invite.
- `ItemCollection` — per farm × bundle-item slot: collected or not, by whom,
  when. Absence of a record means "needed."
- `Claim` — per farm × bundle-item slot: which owner/editor intends to get it.
  At most one claimant per slot. Collecting the slot releases its claim; when
  an N-of-M bundle completes, all claims in that bundle are released and the
  remaining alternatives become optional.

**Derived, never stored as user-editable state:** bundle completion, room
completion, farm completion percentage.

## 7. Roles & Permissions

| Capability | Owner | Editor | Viewer |
|---|---|---|---|
| View board, progress, claims (live) | ✓ | ✓ | ✓ |
| Mark items collected / un-collected | ✓ | ✓ | — |
| Claim / unclaim / reassign items | ✓ | ✓ | — |
| Create & revoke invites, add members | ✓ | — | — |
| Change roles, remove members | ✓ | — | — |
| Rename / delete farm | ✓ | — | — |

Every farm-scoped read and write — over HTTP *and* over the real-time
connection — must enforce membership and role. This authorization layer is
itself one of the resume-signal surfaces.

## 8. Non-Functional Requirements

- **Scale:** friend-group scale. A handful of farms, <20 users, single
  Postgres instance. No performance engineering beyond not doing anything
  obviously wasteful.
- **Latency of collaboration:** a change made by one member appears for others
  viewing the same farm in ≤ 2 seconds under normal conditions; on reconnect,
  the client resyncs so nothing is silently stale.
- **Mobile:** every core flow (§5, flows 3–5) is comfortable one-handed in a
  phone browser.
- **Availability:** best-effort hobby hosting, but deployed properly: HTTPS,
  automated deploys, database backups with a documented restore path.
- **Security:** existing JWT-cookie auth stays; farm data is only visible to
  members; invite codes are unguessable and revocable.

## 9. Engineering Requirements (resume targets)

These are product requirements for this project, chosen deliberately:

1. **Real-time collaboration** — an authenticated, farm-scoped push channel
   done properly (reconnect, resync, authorization on subscribe), not a demo.
2. **Automated testing** — domain unit tests, API integration tests against a
   real database, and end-to-end coverage of the critical flows; a testing
   story that can be defended in an interview.
3. **CI/CD** — every change gated by lint/typecheck/tests; merges to main
   deploy automatically, including safe database migrations.
4. **Production deployment** — Dockerized services on a VPS behind a reverse
   proxy with TLS, managed secrets, and backups.
5. **Clean architecture** — the existing domain / application /
   infrastructure / presentation layering extended honestly to the new
   modules, with dependencies pointing inward and framework concerns kept at
   the edges.

## 10. Success Criteria for v1

v1 is done when all of the following are true:

1. The friend group uses the tracker across at least one real in-game season
   without falling back to chat coordination for bundle items.
2. From a phone, marking an item collected or claiming it takes ≤ 2 taps from
   the farm board.
3. A change made by one member is visible to another member viewing the same
   farm in ≤ 2 seconds, no refresh.
4. A new friend can go from receiving an invite link to seeing the live board
   in under ~2 minutes, including registration.
5. The full vanilla Community Center dataset is present and correct (rooms,
   bundles, slot rules, quantities, qualities), verified by automated checks.
6. The app is live at a public HTTPS URL; merging to main deploys it without
   manual steps; the database has backups and a tested restore procedure.
7. CI blocks merges on lint/typecheck/test failures; the test suite covers
   the domain rules, the API contract (including the permission matrix in
   §7), and the critical end-to-end flows.

## 11. Assumptions

- Trusted users only; no abuse or grief protection beyond role checks.
- English only.
- Bundle facts sourced from community reference data (names, quantities,
  qualities); no copyrighted assets shipped.
- One catalog version live at a time in v1; the versioning exists so a future
  game update or remix support doesn't require reworking farm progress data.
