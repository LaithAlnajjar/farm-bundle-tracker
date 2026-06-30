# Frontend

The frontend follows a feature-first layout, with app composition and shared UI kept separate from domain screens.

## Source Layout

- `src/app` owns application composition: providers, routes, and the root app component.
- `src/features/<feature>` owns feature-specific pages, components, content, hooks, and types.
- `src/shared/components/ui` contains shadcn/Radix primitives that should stay generic.
- `src/shared/components/farm-ui` contains the themed pixel/farm UI kit used by product features.
- `src/shared/lib` contains cross-feature utilities.
- `src/index.css` is the Tailwind v4 token and utility source of truth.

## Styling

Prefer canonical Tailwind utilities for spacing, borders, sizing, z-index, and transforms. Use custom `@utility` classes in `src/index.css` for named visual effects such as pixel shadows, textures, and glows instead of repeating long arbitrary class strings in components.

Feature components should compose shared UI primitives and feature content; shared UI should not import from feature folders.
