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

Query defaults currently retry once and do not refetch on window focus. The
farm feature explicitly invalidates queries after writes. The future board
will begin with the same request/refetch model; real-time events will reconcile
the query cache after the HTTP product is usable.

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

## Naming

- React components and pages: `PascalCase`, with route pages ending in `Page`
- Hooks: `useThing`
- Feature folders: `kebab-case`
- Type modules: `*.types.ts`
- Feature services: an action-oriented name such as `listFarmsService.ts`
- Static feature content: `thingContent.ts`

Names should communicate ownership or intent. Avoid folders such as `misc`,
`common`, or `helpers` when a more precise home exists.

## Adding a feature

For a new board feature:

1. Create `features/board` with a route page and only the folders required by
   its first workflow.
2. Add the route in `app/routes.tsx` and protect it at route level.
3. Put board API operations in feature services and query/mutation behavior in
   board hooks.
4. Compose existing farm UI primitives; keep bundle- or claim-specific UI in
   the board feature.
5. Promote a component or utility to `shared` only after another feature needs
   the same stable abstraction.
6. Add tests according to the [testing strategy](../development/testing.md)
   and update this guide if a boundary changes.
