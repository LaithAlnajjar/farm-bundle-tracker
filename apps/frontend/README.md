# Frontend workspace

The frontend workspace contains the React and Vite web client. Product code is
feature-first under `src/features`; application composition lives in `src/app`,
and reusable primitives and utilities live in `src/shared`.

Run workspace commands from the repository root:

```bash
npm run dev -w frontend
npm run build -w frontend
npm run lint -w frontend
```

Use the repository-level [`dev:frontend`](../../package.json) script during
normal development so the root environment file is selected consistently.

- [Frontend architecture](../../docs/architecture/frontend.md)
- [Development setup](../../docs/development/setup.md)
- [Testing strategy](../../docs/development/testing.md)
