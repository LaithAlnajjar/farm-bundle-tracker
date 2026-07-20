# Testing strategy

Testing is a v1 engineering requirement, but the repository is still building
the full test foundation. This document separates what runs today from the
target so contributors neither overlook existing coverage nor overstate it.

## Current suite

Backend Jest tests live beside source as `*.spec.ts`. They cover authentication
and farm application behavior with explicit fakes for repository and crypto
ports. The strongest current cases include refresh rotation and reuse handling,
sign-in and registration failures, duration parsing, refresh-token entity
behavior, and core farm create/read/update/delete use cases.

Run them from the repository root:

```bash
npm test -w backend -- --runInBand
```

The backend also retains Nest's generated `test/app.e2e-spec.ts`, which checks
only the `Hello World` route. It is a harness placeholder, not meaningful HTTP
integration coverage, and it is not part of the current CI job.

The frontend has no test runner or component/browser test configuration yet.
Current CI installs dependencies and runs the backend Jest suite only. It does
not yet gate lint, type checking, application builds, real-database integration
tests, or browser tests.

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
- Future frontend unit or component tests should stay beside the feature they
  exercise.
- Future browser journeys should live in a top-level E2E area because they span
  both applications.

Name tests after observable behavior, not method implementation. Arrange fakes
so the reader can see the relevant contract without a general-purpose mocking
framework hiding it.

## Permission coverage

The farm capability matrix is a contract and should become a table-driven HTTP
integration suite. For each farm-scoped route it must prove:

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

Manifest validation currently runs whenever the seed loads. Dedicated tests
should make its contract visible without requiring database writes: expected
room/bundle/slot totals, all references resolved, required slots within bounds,
quality-crop quantities, N-of-M choice bundles, and version-sensitive rewards.

Database integration coverage should prove that a fresh seed is complete, a
repeat seed is idempotent, metadata changes update safely, structural drift is
rejected, and any failure rolls back the entire seed.

## CI direction

Phase 0 expands CI into independent, readable gates for backend and frontend
lint/type checks, unit tests, PostgreSQL-backed integration tests, and builds.
Committed migrations must be applied to a fresh CI database before integration
tests. Browser coverage joins later when the critical product loop exists.

Until those gates land, contributors should run the checks listed in
[CONTRIBUTING.md](../../CONTRIBUTING.md) and report any check they could not run.
