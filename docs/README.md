# Documentation handbook

This handbook explains the product and its implemented system. It is organized
so a reader can stop at the level of detail they need.

## Evaluate the project

- [Repository overview](../README.md) — product, current capabilities, stack,
  and engineering highlights
- [Architecture decisions](./decisions.md) — why the consequential technical
  choices were made

## Understand the system

1. [Architecture overview](./architecture/overview.md) — runtime boundaries,
   request flow, module ownership, and intended evolution
2. [Frontend architecture](./architecture/frontend.md) — feature ownership,
   state, session handling, and UI composition
3. [Backend architecture](./architecture/backend.md) — modules, layers, ports,
   authorization, and request lifecycle
4. [Data architecture](./architecture/data.md) — schema ownership, invariants,
   catalog releases, and persistence workflow
5. [API contract](./reference/api.md) — implemented route groups, session
   behavior, permissions, validation, and errors

## Run or change the project

- [Development setup](./development/setup.md) is the source of truth for
  installation, environment variables, PostgreSQL, seeding, and troubleshooting.
- [Testing strategy](./development/testing.md) separates the suite that exists
  today from the v1 testing target.
- [Contributing](../CONTRIBUTING.md) defines placement rules, expected checks,
  documentation ownership, and the definition of done.
- [Catalog seed provenance](../apps/backend/src/modules/catalogs/infrastructure/seed/README.md)
  documents the source dataset and its guarded update policy.

## How these documents stay honest

Architecture pages describe the current implementation first and label
potential improvements clearly. A missing feature should not be described as
available merely because its shape is known.

Package READMEs are local signposts. Setup defaults, API behavior, and
architecture conventions remain authoritative here so they do not drift across
several copies.
