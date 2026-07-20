# Backend workspace

The backend workspace contains the NestJS HTTP API, application use cases,
domain contracts, Drizzle persistence adapters, and catalog seeding command.

Run workspace commands from the repository root:

```bash
npm run dev:backend
npm run build -w backend
npm test -w backend -- --runInBand
npm run db:push -w backend
npm run db:seed:catalog -w backend
```

The repository-level [`dev:backend`](../../package.json) script selects the
root environment file. Direct Nest start commands require
`DOTENV_CONFIG_PATH=../../.env`. The backend lint and format scripts rewrite
matching files.

- [Backend architecture](../../docs/architecture/backend.md)
- [Data architecture](../../docs/architecture/data.md)
- [API contract](../../docs/reference/api.md)
- [Development setup](../../docs/development/setup.md)
