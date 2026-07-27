# Testing strategy

Testing is a v1 engineering requirement, but the repository is still building
the full test foundation. This document separates what runs today from the
target so contributors neither overlook existing coverage nor overstate it.

## Current suite

Backend Jest tests live beside source as `*.spec.ts`. They cover authentication,
farm application behavior, catalog validation, and board completion rules with
explicit fakes or pure domain inputs.

Run them from the repository root:

```bash
npm test -w backend -- --runInBand
```

PostgreSQL-backed HTTP tests live in `apps/backend/test` under a separate Jest
configuration. They boot the same application pipes and filters as production
and cover catalog completeness, version binding, permissions, claims,
collection, N-of-M cleanup, attribution, and both farm join paths.

The frontend has no automated test suite. It is gated by lint and the
type-checked production build only; board logic is reviewed through the
development fixture route below. Browser E2E remains Phase 6 work.

```bash
npm run test:integration -w backend
```

During local frontend development, `/__design/board` renders representative
mixed, optional, completed, viewer, and pending board states without requiring
API setup. The route is development-only and is intended for responsive and
accessibility review, not as a substitute for the real two-account acceptance
flow.

## Target test pyramid

| Level | Proves | Dependencies | Intended examples |
| --- | --- | --- | --- |
| Domain unit | Invariants and deterministic rules | None | Refresh reuse, invite activity, N-of-M completion, claim rules |
| Application unit | Use-case orchestration and failure paths | Port fakes | Token rotation, ownership transfer, authorization decisions |
| HTTP integration | Routes, validation, auth, permissions, transactions, DTO contract | Nest application and real PostgreSQL | Register → sign in → create farm; full role matrix |
| Browser E2E | A few critical user journeys across both apps | Production-like stack | Invite → join → mark → claim → observe live update |

The narrowest level that can prove a behavior should own most cases. An HTTP
test is justified when middleware, serialization, cookies, validation,
permissions, or database behavior is part of the risk. Browser tests remain
thin and protect journeys that would be costly to break.

## Placement and naming

- Pure domain and application tests stay beside the implementation as
  `*.spec.ts`.
- HTTP/database integration tests belong under `apps/backend/test` with a
  dedicated Jest configuration and isolated database lifecycle.
- Any future frontend unit or component tests should stay beside the feature
  they exercise.
- Future browser journeys should live in a top-level E2E area because they span
  both applications.

Name tests after observable behavior, not method implementation. Arrange fakes
so the reader can see the relevant contract without a general-purpose mocking
framework hiding it.

## Permission coverage

The board and farm-management capability matrices run through the real HTTP
harness. For farm-scoped behavior they prove:

- Owner, editor, and viewer access according to the documented capability.
- Unauthenticated callers receive `401`.
- Authenticated non-members receive `404`, not a farm-existence signal.
- Members without the capability receive `403`.
- Deleted farms behave as absent.

Special workflows also need transaction and edge coverage: only one owner,
ownership transfer before owner departure, duplicate membership handling,
invite expiry and revocation, idempotent invite redemption, and concurrent
attempts that could violate an invariant.

## Catalog coverage

Manifest validation runs whenever the seed loads, and dedicated tests make its
contract visible without database writes: expected
room/bundle/slot totals, all references resolved, required slots within bounds,
quality-crop quantities, N-of-M choice bundles, and version-sensitive rewards.

Database integration coverage proves completeness and idempotency. Metadata
update, structural-drift, and rollback cases remain useful extensions.

## CI

CI runs backend/frontend lint, backend unit tests, PostgreSQL-backed HTTP
tests, and both builds. It applies committed migrations to a fresh service and
seeds the catalog before integration tests. Browser coverage joins in Phase 6.
