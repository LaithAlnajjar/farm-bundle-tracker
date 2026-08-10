# Contributing

Farm Bundle Tracker favors changes that are easy to place, explain, and test.
This guide is the shared workflow for every contributor.

## Before changing code

Read the document closest to the work:

| Work | Start here |
| --- | --- |
| Frontend feature or shared UI | [Frontend architecture](./docs/architecture/frontend.md) |
| API module or use case | [Backend architecture](./docs/architecture/backend.md) |
| Schema or catalog data | [Data architecture](./docs/architecture/data.md) |
| HTTP route or session behavior | [API contract](./docs/reference/api.md) |
| Tests or CI | [Testing strategy](./docs/development/testing.md) |

## Keep dependencies pointing inward

Frontend imports flow from `main.tsx` to `app`, then `features`, then `shared`.
A feature may use another feature only through an intentional public export.
Do not promote code to `shared` in anticipation of reuse.

Backend presentation calls application use cases. Use cases depend on domain
contracts; infrastructure implements those contracts. Domain code must not
import NestJS, Drizzle, HTTP DTOs, or database schemas. Nest modules and
injection tokens compose the layers at the edge.

## Working agreement

1. Confirm the current behavior against the relevant architecture and API
   documentation.
2. Put the change in the layer that owns it; avoid opportunistic refactors in
   unrelated modules.
3. Add tests at the narrowest level that proves the behavior.
4. Run the relevant checks from the repository root.
5. Update documentation when a command, contract, boundary, or decision
   changed.

Useful checks currently available:

```bash
npm test -w backend -- --runInBand
npm run build -w backend
npm run build -w frontend
npm run lint -w frontend
```

`npm run lint -w backend` and `npm run format -w backend` rewrite matching
files. Review the resulting diff if you intentionally run either command.
The current CI pipeline runs only backend Jest tests; the broader gate described
in the testing strategy is not implemented yet.

## Documentation changes

Keep each fact in one authoritative place:

- Setup commands and environment behavior belong in the setup guide.
- Runtime boundaries belong in architecture documents.
- HTTP behavior belongs in the API contract.
- A consequential choice and its tradeoff belong in the decision log.

Entry-point READMEs should summarize and link, not duplicate those sources.
Write about implemented behavior in the present tense and future behavior as a
potential improvement. Do not describe proposed behavior as though it already
exists.

## Definition of done

A change is ready when its behavior matches the agreed scope, dependency
direction remains intact, relevant tests and builds pass, failure and permission
paths are considered, and affected documentation links and claims are current.
The working tree should contain no unrelated generated or formatting changes.
