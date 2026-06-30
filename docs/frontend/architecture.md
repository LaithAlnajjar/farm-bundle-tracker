# Frontend Architecture

This document defines the frontend architecture conventions for the repository. It should be treated as a stable guide for adding, moving, or reviewing frontend code.

## Source Layout

Frontend source code should use this top-level shape:

```text
src/
├── app/
├── features/
├── shared/
├── index.css
└── main.tsx
```

### `src/app`

`app` owns application composition.

Use this area for:

- Route declarations
- Application-level providers
- Global shell composition
- Root app setup that connects features together

Avoid placing feature-specific UI, business logic, API calls, or reusable primitives in `app`.

### `src/features`

`features` owns product domains and user-facing workflows. Each feature should be isolated enough that a developer can work on it without scanning unrelated features.

Use this shape for feature modules when needed:

```text
features/
└── feature-name/
    ├── pages/
    ├── components/
    ├── hooks/
    ├── services/
    ├── content/
    ├── types/
    └── index.ts
```

Not every feature needs every folder. Add folders when they clarify ownership.

Recommended responsibilities:

- `pages`: route-level components rendered by `app` routes
- `components`: feature-only UI components
- `hooks`: feature-specific React hooks
- `services`: feature-specific API clients or data access helpers
- `content`: static copy, option lists, demo data, or constants owned by the feature
- `types`: feature-specific TypeScript types
- `index.ts`: optional public exports for code intentionally consumed outside the feature

Feature code may import from `shared`. Feature code should avoid importing directly from another feature unless that feature intentionally exposes a public export.

### `src/shared`

`shared` contains code that is reusable across multiple features and does not belong to one product workflow.

Suggested structure:

```text
shared/
├── components/
│   ├── ui/
│   └── design-system-name/
├── hooks/
├── lib/
└── types/
```

Use `shared/components/ui` for generic primitives such as Radix or shadcn-based components. These components should be broadly reusable and should not contain product copy or feature-specific behavior.

Use a separate shared component folder for branded or themed components. These components may encode the application's visual language, but they should still avoid importing from feature modules.

Use `shared/lib` for small cross-feature utilities, such as class name merging, formatting helpers, or generic client helpers.

## Dependency Boundaries

Imports should flow in one direction:

```text
main.tsx -> app -> features -> shared
```

Allowed:

- `app` imports feature pages and app-level providers
- `features` import shared components, shared hooks, shared utilities, and their own local modules
- `shared` imports other shared modules

Avoid:

- `shared` importing from `features`
- `shared` importing from `app`
- Feature modules reaching into another feature's internal folders
- Route-level behavior hidden inside shared components

When code starts being used by more than one feature, move it to `shared` only after it has a stable purpose. Do not move feature code into `shared` just because it might be reused later.

## Routing

Route definitions belong in `app`. Route elements should normally render page components from feature modules.

Good route ownership:

```tsx
<Route path="/example" element={<ExamplePage />} />
```

The page component owns the feature workflow. The route file owns only path composition.

## Component Placement

Use this decision tree when creating a component:

1. Is it a route-level screen? Put it in `features/<feature>/pages`.
2. Is it only useful inside one feature? Put it in `features/<feature>/components`.
3. Is it a generic primitive with no product meaning? Put it in `shared/components/ui`.
4. Is it a reusable branded/themed component? Put it in a named folder under `shared/components`.
5. Is it only a tiny local helper? Keep it near the component that uses it.

Prefer small components with explicit props over large components that import unrelated content, state, and layout concerns.

## State And Data

Keep state as close as possible to the workflow that owns it.

Recommended placement:

- Local component state stays inside the component.
- Feature workflow state belongs in feature hooks.
- Feature API calls belong in feature services.
- Generic HTTP/client setup belongs in `shared/lib`.
- Cross-feature domain types may live in `shared/types` only when they are genuinely shared.

Avoid introducing global state until there is a clear cross-feature need.

## Styling

Tailwind is the primary styling tool. Styles should be readable, canonical, and consistent.

Use canonical Tailwind utilities whenever possible:

```tsx
className="inset-1.5 border-3 py-18"
```

Avoid arbitrary values when Tailwind already has a canonical class:

```tsx
className="inset-[6px] border-[3px] py-[72px]"
```

Arbitrary values are acceptable when the value is genuinely custom, difficult to express with the Tailwind scale, or required by a third-party primitive selector.

Repeated visual effects should become named utilities in `src/index.css`:

```css
@utility card-shadow {
  box-shadow: 4px 4px 0 rgb(0 0 0 / 0.2);
}
```

Then use the named utility in components:

```tsx
className="card-shadow border-2"
```

Use `cn` for conditional class composition. Use `class-variance-authority` for reusable component variants.

## CSS Tokens And Utilities

`src/index.css` is the source of truth for:

- Theme tokens
- Fonts
- Global base styles
- Custom Tailwind utilities
- Reusable textures, shadows, and visual effects

Component files should not repeatedly inline long gradients, shadows, or texture definitions. If a visual effect has a name in the design language, give it a named utility.

## Naming Conventions

Use clear, predictable names.

- React components: `PascalCase`
- Hooks: `useThing`
- Feature folders: `kebab-case`
- Type files: `*.types.ts`
- Route pages: `ThingPage.tsx`
- Static feature content: `thingContent.ts`
- Shared utilities: descriptive function names

Avoid vague folder names. A folder name should describe ownership or purpose, not mood or implementation detail.

## Adding A Feature

When adding a feature:

1. Create `features/<feature-name>`.
2. Add a route-level page in `pages` if the feature has a route.
3. Keep feature-only components inside the feature folder.
4. Put reusable primitives in `shared`, not inside the feature.
5. Keep API calls and workflow hooks close to the feature.
6. Export only the pieces that other parts of the app are intended to use.
7. Add or update tests and documentation according to the size of the change.

The result should make ownership obvious from the file path alone.
