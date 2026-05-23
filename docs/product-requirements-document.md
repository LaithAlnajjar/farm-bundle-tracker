Below is a lighter, standalone architecture document for rebuilding the Stardew tracker from scratch using a **separate React frontend + NestJS backend + Drizzle ORM**.

---

# Architecture Brief — Stardew Community Center Tracker

## 1. Purpose

Build a small collaborative Stardew Valley Community Center tracker as a learning project.

The goal is not to ship the fastest possible MVP. The goal is to practice building a clean full-stack application by hand with clear separation between frontend, backend, database, and domain logic.

---

## 2. Tech stack

| Layer    | Choice                                                                                |
| -------- | ------------------------------------------------------------------------------------- |
| Frontend | React + Vite                                                                          |
| Backend  | NestJS                                                                                |
| ORM      | Drizzle ORM                                                                           |
| Database | PostgreSQL, preferably Supabase Postgres                                              |
| Auth     | Backend-managed auth using JWT/session cookies                                        |
| Styling  | Tailwind CSS + shadcn/ui                                                              |
| Hosting  | Vercel/Netlify for frontend, Render/Fly.io/Railway for backend, Supabase for database |

Use **React + Vite** instead of Next.js because the goal is to practice a clearly separated frontend/backend architecture. Vite is a modern frontend build tool commonly used for standalone React apps. React’s own docs list Vite as one of the recommended build tools for building a React app from scratch. ([vitejs][1])

Use **NestJS** because it encourages modular backend structure through modules, controllers, and providers, which fits well with a clean architecture learning project. ([NestJS Documentation][2])

Use **Drizzle** because schemas are written in TypeScript and can act as the source of truth for migrations and type-safe database access. ([Drizzle ORM][3])

---

# Part 1 — Frontend Architecture

## 3. Frontend responsibilities

The frontend is responsible for:

| Responsibility      | Description                                             |
| ------------------- | ------------------------------------------------------- |
| UI rendering        | Show farms, bundles, items, progress, members, settings |
| User interactions   | Forms, filters, buttons, dialogs                        |
| Client validation   | Basic form validation before API calls                  |
| API communication   | Talk only to the NestJS backend                         |
| Local UI state      | Filters, modals, selected bundle, loading states        |
| Styling consistency | Reusable components and design tokens                   |

The frontend must **not** talk directly to the database.

The frontend must **not** contain business rules that are required for security.

The frontend may contain display helpers, but the backend remains the source of truth.

---

## 4. Frontend folder structure

```txt
frontend/
  src/
    app/
      App.tsx
      router.tsx
      providers.tsx

    pages/
      LoginPage.tsx
      FarmsPage.tsx
      CreateFarmPage.tsx
      FarmDashboardPage.tsx
      BundlesPage.tsx
      NeededItemsPage.tsx
      HistoryPage.tsx
      SettingsPage.tsx

    features/
      auth/
      farms/
      bundles/
      progress/
      members/
      invites/

    components/
      ui/
      layout/
      stardew/
      forms/

    api/
      client.ts
      auth.api.ts
      farms.api.ts
      bundles.api.ts
      progress.api.ts
      members.api.ts

    domain/
      bundles/
      items/
      progress/

    hooks/
      useAuth.ts
      useFarm.ts
      useDebounce.ts

    lib/
      cn.ts
      constants.ts

    styles/
      globals.css
```

---

## 5. Frontend rules

### Rule 1 — Pages compose features

Pages should be thin.

Good:

```tsx
export function BundlesPage() {
  return <BundlesScreen />;
}
```

Avoid putting all page logic directly inside the route component.

---

### Rule 2 — Features own feature-specific components

Example:

```txt
features/bundles/
  components/
    BundleCard.tsx
    BundleRequirementRow.tsx
    BundleProgressBar.tsx
  hooks/
    useBundles.ts
  types.ts
```

Only move something to `components/` when it is reused across multiple features.

---

### Rule 3 — API calls live in `api/`

Do not call `fetch()` randomly from components.

Use this pattern:

```ts
// api/progress.api.ts
export async function updateRequirementProgress(input: UpdateProgressInput) {
  return apiClient.patch("/progress/requirements", input);
}
```

Components should call hooks or API functions, not manually build URLs.

---

### Rule 4 — Use shadcn/ui as a base, not the design system

shadcn/ui components should be wrapped by Stardew-themed components when reused often.

Example:

```tsx
<StardewPanel>
  <BundleCard />
</StardewPanel>
```

Instead of repeating this everywhere:

```tsx
<Card className="border-yellow-900 bg-amber-100 shadow-md">
```

Recommended reusable Stardew components:

```txt
components/stardew/
  StardewPanel.tsx
  StardewButton.tsx
  StardewProgress.tsx
  ItemIcon.tsx
  BundleBadge.tsx
  SeasonBadge.tsx
```

---

## 6. Frontend state management

Use simple tools first.

| State type       | Tool                           |
| ---------------- | ------------------------------ |
| Server data      | TanStack Query                 |
| Auth state       | Auth provider + `/me` endpoint |
| Forms            | React Hook Form + Zod          |
| UI state         | `useState`                     |
| URL filters      | Search params                  |
| Global app state | Avoid unless needed            |

Recommended:

```bash
npm install @tanstack/react-query react-hook-form zod @hookform/resolvers
```

Do **not** use Redux for this project.

---

## 7. Frontend routing

Recommended routes:

```txt
/login
/farms
/farms/new
/farms/:farmId
/farms/:farmId/bundles
/farms/:farmId/needed
/farms/:farmId/history
/farms/:farmId/settings
/join/:inviteCode
```

Protected routes should require an authenticated user.

Farm routes should also require farm membership.

---

## 8. Frontend component conventions

### Component naming

Use PascalCase:

```txt
BundleCard.tsx
FarmSidebar.tsx
RequirementCounter.tsx
```

### Props naming

Use explicit prop names:

```tsx
type BundleCardProps = {
  bundle: BundleViewModel;
  userRole: FarmRole;
  onUpdateRequirement: (input: UpdateProgressInput) => void;
};
```

Avoid vague props:

```tsx
data
item
thing
onClick
```

### Component size

A component should usually stay under 150 lines.

If it grows too much, split into:

```txt
Header
Body
Actions
Row
Dialog
```

---

# Part 2 — Backend Architecture

## 9. Backend responsibilities

The NestJS backend owns:

| Responsibility  | Description                            |
| --------------- | -------------------------------------- |
| Authentication  | Login, register, logout, current user  |
| Authorization   | Farm roles and permissions             |
| Business rules  | Bundle completion, progress validation |
| Database access | All Drizzle queries                    |
| API responses   | Stable DTOs for frontend               |
| Invite logic    | Create, validate, revoke invites       |
| Audit history   | Track contribution events              |

The backend must protect all farm data.

The frontend should never decide whether a user is allowed to mutate farm data.

---

## 10. Backend architecture style

Use a clean architecture-inspired structure:

```txt
backend/
  src/
    main.ts
    app.module.ts

    modules/
      auth/
      users/
      farms/
      bundles/
      progress/
      invites/
      members/

    domain/
      entities/
      value-objects/
      services/
      errors/

    application/
      use-cases/
      dto/
      ports/

    infrastructure/
      database/
      repositories/
      auth/
      config/

    presentation/
      http/
      guards/
      decorators/
      filters/
```

The important idea:

```txt
Presentation → Application → Domain
Infrastructure → Application
Domain depends on nothing
```

No layer should leak details upward.

---

## 11. Layer responsibilities

## Domain layer

The domain layer contains pure business rules.

It should not import:

```txt
NestJS
Drizzle
Express
HTTP types
Database schemas
```

Examples:

```txt
domain/
  entities/
    Farm.ts
    Bundle.ts
    BundleRequirement.ts
  services/
    BundleCompletionService.ts
    ProgressValidationService.ts
  errors/
    PermissionDeniedError.ts
    InvalidProgressError.ts
```

Example:

```ts
export class BundleCompletionService {
  isComplete(params: {
    completedRequirements: number;
    requiredSlots: number;
  }): boolean {
    return params.completedRequirements >= params.requiredSlots;
  }
}
```

---

## Application layer

The application layer contains use cases.

Examples:

```txt
application/use-cases/
  CreateFarmUseCase.ts
  JoinFarmByInviteUseCase.ts
  UpdateRequirementProgressUseCase.ts
  ChangeMemberRoleUseCase.ts
  GetFarmDashboardUseCase.ts
```

Use cases coordinate:

```txt
permissions
repositories
domain services
transactions
return DTOs
```

Example flow:

```txt
UpdateRequirementProgressUseCase
  1. Load farm membership
  2. Check user role
  3. Load requirement
  4. Validate quantity
  5. Update progress
  6. Insert contribution event
  7. Return updated progress
```

---

## Infrastructure layer

The infrastructure layer contains external details.

Examples:

```txt
infrastructure/
  database/
    db.ts
    schema/
      farms.schema.ts
      bundles.schema.ts
      progress.schema.ts
      users.schema.ts
    migrations/

  repositories/
    DrizzleFarmRepository.ts
    DrizzleProgressRepository.ts
    DrizzleMemberRepository.ts

  auth/
    JwtServiceAdapter.ts
    PasswordHasher.ts

  config/
    env.ts
```

Only this layer knows about Drizzle.

Drizzle has native PostgreSQL support and works with drivers such as `node-postgres` and `postgres.js`. ([Drizzle ORM][4])

---

## Presentation layer

The presentation layer contains HTTP concerns.

Examples:

```txt
presentation/http/
  controllers/
    AuthController.ts
    FarmsController.ts
    BundlesController.ts
    ProgressController.ts
    InvitesController.ts

  guards/
    JwtAuthGuard.ts
    FarmRoleGuard.ts

  decorators/
    CurrentUser.ts
    FarmRole.ts

  filters/
    HttpExceptionFilter.ts
```

Controllers should be thin.

Good:

```ts
@Post(":farmId/progress")
updateProgress(@Body() dto: UpdateProgressDto) {
  return this.updateProgressUseCase.execute(dto);
}
```

Avoid putting database queries in controllers.

---

# 12. NestJS module structure

NestJS uses modules to organize application structure. A module is defined with the `@Module()` decorator and groups related controllers/providers together. ([NestJS Documentation][2])

Recommended modules:

```txt
AuthModule
UsersModule
FarmsModule
BundlesModule
ProgressModule
InvitesModule
MembersModule
DatabaseModule
ConfigModule
```

Example:

```txt
modules/farms/
  farms.module.ts
  farms.controller.ts
  farms.service.ts
```

For this project, `service.ts` can either:

1. act as a small adapter around use cases, or
2. be skipped if controllers inject use cases directly.

Prefer direct use cases for practice.

---

# 13. Database design

Use PostgreSQL.

Supabase is a good option because each project gives you a full Postgres database with direct database access. ([Supabase][5])

Core tables:

```txt
users
farms
farm_members
farm_invites

catalog_versions
catalog_rooms
catalog_bundles
catalog_items
catalog_bundle_requirements
catalog_item_sources

farm_requirement_progress
farm_contribution_events
```

Keep two types of data separate:

| Data type    | Meaning                                      |
| ------------ | -------------------------------------------- |
| Catalog data | Static Stardew bundle/item data              |
| Farm data    | User-created progress and collaboration data |

---

## 14. Drizzle conventions

Recommended structure:

```txt
infrastructure/database/
  db.ts
  schema/
    index.ts
    users.schema.ts
    farms.schema.ts
    catalog.schema.ts
    progress.schema.ts
  migrations/
```

Schema files should only define tables and relations.

Repositories should contain queries.

Do not put business logic inside Drizzle query files.

Drizzle Kit can generate and run migrations from TypeScript schema definitions. ([Drizzle ORM][6])

Recommended commands:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

# 15. API shape

Use REST for simplicity.

Base URL:

```txt
/api
```

## Auth

```txt
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

## Farms

```txt
GET    /farms
POST   /farms
GET    /farms/:farmId
PATCH  /farms/:farmId
DELETE /farms/:farmId
```

## Bundles

```txt
GET    /farms/:farmId/bundles
GET    /farms/:farmId/needed-items
GET    /farms/:farmId/history
```

## Progress

```txt
PATCH  /farms/:farmId/requirements/:requirementId/progress
```

## Invites

```txt
POST   /farms/:farmId/invites
POST   /invites/:code/join
DELETE /farms/:farmId/invites/:inviteId
```

## Members

```txt
GET    /farms/:farmId/members
PATCH  /farms/:farmId/members/:userId
DELETE /farms/:farmId/members/:userId
```

---

# 16. DTO conventions

Use DTOs for every request body.

Example:

```ts
export class UpdateProgressDto {
  quantity: number;
  note?: string;
}
```

Use response DTOs instead of returning raw database rows.

Example:

```ts
export type BundleRequirementDto = {
  id: string;
  itemName: string;
  itemIconUrl: string | null;
  quantityRequired: number;
  quantityCollected: number;
  isComplete: boolean;
};
```

This prevents database structure from leaking into the frontend.

---

# 17. Authorization rules

Roles:

```txt
owner
editor
viewer
```

Rules:

| Action           | Owner | Editor | Viewer |
| ---------------- | ----: | -----: | -----: |
| View farm        |   Yes |    Yes |    Yes |
| Update progress  |   Yes |    Yes |     No |
| Update farm date |   Yes |    Yes |     No |
| Invite members   |   Yes |     No |     No |
| Change roles     |   Yes |     No |     No |
| Delete farm      |   Yes |     No |     No |

Authorization should happen inside the backend use case, not only inside route guards.

The guard can reject obvious invalid access, but the use case should still enforce the rule.

---

# 18. Error handling

Use consistent API errors.

Example response:

```json
{
  "error": {
    "code": "PROGRESS_QUANTITY_INVALID",
    "message": "Progress quantity must be between 0 and the required quantity."
  }
}
```

Recommended error codes:

```txt
AUTH_REQUIRED
PERMISSION_DENIED
FARM_NOT_FOUND
INVITE_INVALID
INVITE_EXPIRED
MEMBER_NOT_FOUND
PROGRESS_QUANTITY_INVALID
REQUIREMENT_NOT_FOUND
```

---

# 19. Development order

Build the project in this order:

```txt
1. Create backend NestJS app
2. Create frontend React Vite app
3. Add PostgreSQL + Drizzle
4. Create database schema
5. Add auth
6. Add farms
7. Add memberships
8. Seed one test bundle
9. Add bundle read endpoint
10. Add progress update endpoint
11. Add frontend farm dashboard
12. Add frontend bundles page
13. Add contribution history
14. Add invites
15. Add roles
16. Seed full Community Center data
17. Add Stardew styling
18. Deploy
```

First vertical slice:

```txt
User registers
User logs in
User creates farm
User sees one seeded bundle
User updates one item
Progress persists
History event is created
```

Do not seed the full Stardew dataset until that works.

---

# 20. Project repo structure

Use a monorepo:

```txt
stardew-bundle-tracker/
  apps/
    web/
    api/

  packages/
    shared/
      src/
        types/
        constants/
        validation/

  docs/
    architecture.md
    api.md
    database.md

  package.json
  README.md
```

Recommended tooling:

```txt
pnpm workspaces
TypeScript
ESLint
Prettier
Docker Compose for local Postgres
```

---

# 21. Main principle

This rebuild should optimize for learning and discipline.

The rule to keep repeating:

```txt
Frontend displays.
Backend decides.
Domain rules stay pure.
Database details stay in infrastructure.
```

That is the architecture.

[1]: https://vite.dev/guide/?utm_source=chatgpt.com "Getting Started"
[2]: https://docs.nestjs.com/modules?utm_source=chatgpt.com "Modules | NestJS - A progressive Node.js framework"
[3]: https://orm.drizzle.team/docs/sql-schema-declaration?utm_source=chatgpt.com "Schema - Drizzle ORM"
[4]: https://orm.drizzle.team/docs/get-started/postgresql-new?utm_source=chatgpt.com "Get Started with Drizzle and PostgreSQL"
[5]: https://supabase.com/docs/guides/database/overview?utm_source=chatgpt.com "Database | Supabase Docs"
[6]: https://orm.drizzle.team/docs/migrations?utm_source=chatgpt.com "Migrations - Drizzle ORM"
