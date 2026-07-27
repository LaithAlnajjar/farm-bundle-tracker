# Frontend architecture

The frontend uses a feature-first layout. File paths communicate product
ownership, while `app` composes features and `shared` provides stable,
cross-feature building blocks.

## Source layout

```text
src/
├── app/                 # providers, routes, root composition
├── features/            # product workflows
│   ├── auth/
│   ├── board/
│   ├── farms/
│   └── marketing/
├── shared/
│   ├── components/
│   │   ├── ui/          # generic Radix/shadcn-style primitives
│   │   └── farm-ui/     # reusable themed components
│   └── lib/             # generic utilities and HTTP client
├── index.css            # theme tokens, fonts, global utilities
└── main.tsx
```

`app` owns application composition, not product behavior. Routes render page
components exported by features. Providers establish the router, React Query
client, and authenticated session context around those routes.

## Dependency boundaries

Imports flow in one direction:

```text
main.tsx -> app -> features -> shared
```

Allowed dependencies:

- `app` imports feature pages, route guards, and application providers.
- A feature imports its own modules and stable shared components or utilities.
- `shared` imports only other shared code or third-party libraries.
- Another feature may use an intentional public export from a feature's
  `index.ts`; it must not reach into that feature's internal folders.

Disallowed dependencies include `shared` importing product features, route
behavior hidden inside shared components, and features importing app
composition. Keep a helper local until at least two real consumers reveal a
stable cross-feature purpose.

## Feature ownership

A feature adds only the folders it needs:

```text
features/farms/
├── pages/          # route-level workflows
├── components/     # farm-only UI
├── hooks/          # queries, mutations, workflow state
├── services/       # HTTP operations
├── types/          # farm-facing client types
└── index.ts        # intentional public surface
```

Pages assemble a user workflow. Components render feature-owned concepts.
Hooks own query keys, server-state lifecycle, and mutations. Services perform
one transport operation and return typed data; they do not display errors or
mutate caches.

Static copy, option lists, or demo content may use a feature `content` folder.
Do not create every conventional folder in advance.

## Routing and providers

Routes live in `src/app/routes.tsx`. Public routes currently cover the landing,
registration, sign-in, and invite-preview screens. `RequireAuth` protects farm
list and management screens. A route definition composes paths and guards; its
page owns loading, error, empty, and interaction states.

`AppProviders` nests providers in this order:

1. `BrowserRouter` supplies navigation.
2. `QueryClientProvider` owns server-state caching.
3. `AuthProvider` hydrates and exposes the session while using the query client
   to clear private cached data on logout.
4. `FarmToastProvider` supplies an accessible application toast queue for
   mutation, copy, refresh, and collaboration feedback.

Provider order is a dependency decision. A provider may use only contexts
outside it in the tree.

## Server state and local state

TanStack Query owns data fetched from the API: farms, members, and invites.
Feature hooks define query keys and enabled conditions. Mutations invalidate
the smallest set of affected keys through the feature's invalidation helper.

Use local React state for transient interface state such as the newly created
invite link. Use forms for draft input. Do not copy server results into local
state merely to render them, and do not introduce a global store until a real
cross-feature client-state requirement exists.

Query defaults retry once and do not refetch on window focus. Farm management
explicitly invalidates affected queries. The board opts into focus refetch and
a 15-second foreground interval; mutations replace its single farm-board cache
entry with the server response and then invalidate it in the background.

## HTTP and session lifecycle

Feature services call the shared `apiClient`; components do not call `fetch`
directly. The client builds URLs from `VITE_API_URL`, includes cookies, encodes
JSON bodies, and converts non-success responses into `ApiError` instances.

The access token exists only in module memory. On application load,
`AuthProvider` calls the refresh endpoint, stores the returned access token,
then fetches the current user. Until that completes, authentication is
`loading`, not implicitly signed out.

When an authenticated request receives `401`, all requests share one in-flight
refresh promise. A successful refresh retries each original request once. A
failed refresh clears the token; refresh calls and explicitly public requests
never recurse into this behavior. Logout clears both session state and the
entire query cache.

## Component placement

Use this sequence when placing UI:

1. A route-level screen belongs in `features/<feature>/pages`.
2. UI meaningful only to one feature belongs in that feature's `components`.
3. A generic behavior primitive with no product language belongs in
   `shared/components/ui`.
4. A reusable component that expresses the farm visual language belongs in
   `shared/components/farm-ui`.
5. A tiny helper used by one component stays beside that component.

The farm UI kit may encode wood boards, note cards, pixel icons, pins, and
seasonal styling. It must not import farm membership, claims, routes, or other
feature state.

## Styling

Tailwind is the primary styling tool. Prefer canonical utilities when the scale
already expresses a value:

```tsx
className="inset-1.5 border-3 py-18"
```

Arbitrary values remain appropriate for genuinely custom values or complex
third-party selectors. Repeated named effects belong in `src/index.css` as
tokens or `@utility` definitions rather than repeated gradients and shadows in
components.

Use `cn` for conditional class composition and
`class-variance-authority` for reusable component variants. Product copy and
feature behavior must not leak into generic UI primitives.

## Sprites

Artwork lives under `public/assets` and is served as plain files, never bundled:

```text
assets/items/<catalog-slug>.png   # 16×16, one per catalog item
assets/icons/<name>.png           # 16×16 UI glyphs (IconName)
assets/rooms/bundle-<tone>.png    # 16×16 Junimo Note bundle pouches
assets/avatars/<villager>.png     # 64×64 portraits (AvatarName)
```

Four components read them, and nothing else should build these paths by hand:

- `ItemSprite` — an item's own sprite by catalog slug, falling back to the
  category glyph via `categoryIcon` when a custom catalog carries a slug we
  have no artwork for
- `PixelIcon` — a UI glyph from the `IconName` union
- `BundleSprite` — a room's pouch, chosen by `roomTone`
- `PixelAvatar` / `UserBadge` — a villager portrait; `avatarForUser` deals one
  per account id so a member always wears the same face

Every sprite renders with `image-rendering: pixelated`. Sizes should stay whole
multiples of the source (16/32/48 for sprites, 64 for portraits) so pixels land
on a clean grid. See `public/assets/README.md` for where the art came from and
how to refresh it.

## Naming

- React components and pages: `PascalCase`, with route pages ending in `Page`
- Hooks: `useThing`
- Feature folders: `kebab-case`
- Type modules: `*.types.ts`
- Feature services: an action-oriented name such as `listFarmsService.ts`
- Static feature content: `thingContent.ts`

Names should communicate ownership or intent. Avoid folders such as `misc`,
`common`, or `helpers` when a more precise home exists.

## Board feature

The board is owned by `features/board` and routed at `/farms/:farmId`. It is a
single room-at-a-time dashboard with its own full-height chrome: a room sidebar,
a top bar carrying search and the shared season, a bundle ledger, and a rail of
board activity, personal claims, the next reward, and items leaving with the
season. Query parameters are the canonical shareable state:

```text
room, q, filter
```

`filter` is one of `all`, `needed`, `mine`, or `season`. Normalized preferences
are persisted under a user-and-farm-scoped
`bundle-board:preferences:v2:<userId>:<farmId>` key. An explicit board URL wins
over storage and starts unspecified fields from defaults; a URL without board
parameters restores the last normalized preferences. Recognized legacy `view`,
`tab`, `status`, `season`, and `assignee` values collapse onto the nearest
current filter.

Pure selectors derive the room ledger, summary counts, next reward, and
leaving-soon list from the one authoritative board response. The activity feed
is reconstructed from the claim and collection timestamps the response already
carries, so no separate event log is needed and an entry disappears exactly when
the thing it describes is undone. Mutations track pending state per slot,
replace the board cache with the response, then invalidate in the background.
In-memory fingerprints distinguish a local mutation from later polling/focus
changes so the interface can show one useful completion or collaboration notice.

The same compact item row renders collection, claim, attribution, and optional
states everywhere it appears. Shared farm UI primitives provide progress, user
badges, dialogs, and toast surfaces while remaining unaware of board
repositories or transport concerns. `FarmAppShell` still wraps the farm list and
farm settings pages, which sit outside the dashboard.

A representative fixture route is available only in development at
`/__design/board` for phone and desktop visual review. It is omitted from the
production route table.
