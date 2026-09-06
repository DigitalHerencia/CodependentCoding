# Technical Requirements — The Maximal Template™

## 1. Scope

This document defines repository-specific technical requirements for implementing and maintaining The Maximal Template™.

The architecture document owns responsibility boundaries. The numbered specs own the active build/repair sequence.

## 2. Current technical baseline

The repository currently targets:

- Next.js App Router;
- React Server Components by default;
- React 19;
- TypeScript;
- pnpm;
- Tailwind CSS 4;
- shadcn/BoldKit-style UI primitives;
- React Hook Form;
- Zod;
- Prisma ORM 7+;
- Neon Serverless PostgreSQL;
- Clerk;
- Stripe;
- Vercel deployment.

Current repository package versions are controlled by `package.json` and the lockfile. Do not duplicate package-version authority into governance unless a compatibility rule requires it.

## 3. Server-first requirement

React Server Components are the default.

Client Components exist only when browser-side behavior requires them, including:

- local interaction state;
- browser APIs;
- drag/drop;
- rich editor behavior;
- streaming UI coordination;
- client-only search/filter/sort interaction;
- React Hook Form feature forms.

A `.client.tsx` suffix should communicate an actual browser boundary, not stylistic preference.

## 4. Route requirements

`app/` owns:

- URL topology;
- route groups;
- route parameters;
- search parameters;
- layouts;
- metadata;
- `loading.tsx`;
- error/not-found boundaries;
- HTTP Route Handlers;
- Suspense placement;
- redirects/not-found framework outcomes.

Pages remain thin and do not own persisted data access, provider SDK calls, authorization policy, or multi-step business logic.

## 5. Static public content

Static public routes live under `app/(public)/`.

When a public page has no persisted data, mutation, auth/authz orchestration, provider behavior, or business workflow:

- the page directly imports blocks;
- no feature wrapper is created;
- no actions, fetchers, schemas, or types are created merely for symmetry.

## 6. Application route pattern

Domain resources should use the recognizable list/detail/new/edit grammar where applicable.

Example:

```text
app/(tenant)/crm/contacts/page.tsx
app/(tenant)/crm/contacts/[contactId]/page.tsx
app/(tenant)/crm/contacts/new/page.tsx
app/(tenant)/crm/contacts/[contactId]/edit/page.tsx
```

Expected feature family:

```text
contactsFeature.tsx
contactsClientFeature.tsx
contactDetailFeature.tsx
contactDetailClientFeature.tsx
contactNewForm.tsx
contactEditForm.tsx
```

Only create the client companion that is actually needed.

## 7. Suspense and loading

- static/content routes may use Next.js `loading.tsx`;
- dynamic or persisted-read routes should use Suspense around server feature entrypoints where streaming/loading behavior is useful;
- custom skeletons should match the real feature layout and live with the relevant feature.

## 8. Persistence requirements

All persisted application reads are read-only fetchers under `lib/fetchers/`.

Ordinary application CRUD writes are actions under `lib/actions/`.

`lib/db/` owns reusable database mechanics:

```text
lib/db/
├── client.ts
├── selects/
├── dto/
└── transactions/
```

Prisma lifecycle remains under root `prisma/`.

Do not invent a second repository/query/service architecture.

## 9. Runtime validation

Untrusted boundaries use Zod or an equivalent explicit runtime schema.

Shared schemas live in `schemas/` and are organized by useful domain responsibility.

TypeScript types do not substitute for runtime validation.

## 10. Type contracts

Shared application contracts live in `types/` and are organized by useful domain responsibility.

Do not wrap generated Prisma types simply to create symmetry.

Persistence representations should not leak into UI surfaces when a transport-safe DTO is required.

## 11. Authentication and authorization

Clerk owns external identity/session truth.

The application database owns:

- local users;
- organizations/workspaces;
- memberships;
- product roles/capabilities;
- tenant/resource relationships;
- workflow/product state.

Application authz remains under `lib/authz/`.

PostgreSQL RLS provides tenant containment and defense in depth; it does not replace application authorization.

## 12. Provider requirements

Provider-specific behavior belongs under `lib/integrations/{provider}` with three explicit exceptions:

```text
Clerk  → lib/auth
Neon   → lib/db
Prisma → lib/db runtime + root prisma lifecycle
```

Provider SDK objects do not become application-domain contracts.

Missing provider configuration must not crash unrelated public demo surfaces.

## 13. Webhook requirements

Webhook HTTP lifecycle remains in `app/api/{provider}/.../route.ts`.

A webhook route owns:

- request receipt;
- signature/authenticity verification;
- payload parsing and validation;
- event type interpretation;
- idempotency lifecycle coordination;
- invocation of reusable provider/database helpers;
- provider-compatible response.

Reusable atomic persistence belongs in `lib/db/transactions/`.

Do not hide the entire webhook HTTP lifecycle in `lib`.

## 14. Naming requirements

Use domain + responsibility names where useful:

```text
crmActions.ts
crmFetchers.ts
crmTypes.ts
crmSchemas.ts
projectsActions.ts
projectsFetchers.ts
```

Workflow directories remain shallow:

```text
lib/workflows/crm/
lib/workflows/projects/
```

Block filenames use lowercase kebab-case category names:

```text
hero-sections.tsx
cta-sections.tsx
data-tables.tsx
record-details.tsx
```

## 15. Environment requirements

- secrets remain server-only;
- `.env.example` documents required/optional keys without real credentials;
- provider code must fail locally and narrowly when its required secret is used but missing;
- unrelated public-demo routes must remain usable when optional provider secrets are absent;
- environment variable names in code and `.env.example` must match exactly.

## 16. Repository-native validation

Current package scripts are the source of truth for available commands.

At minimum, affected implementation work should use the narrowest relevant subset of:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm prisma:validate
pnpm build
```

Do not claim a check passed unless it actually ran.

Do not invent a parallel validation system solely to create activity. Machine contracts may define deterministic expectations that repository-native validators can enforce when such validators exist or are deliberately added by an approved spec.

### Template tooling

Run package commands from `template/`, which has its own pnpm workspace and lockfile.
Install explicitly with `pnpm install` after dependency changes; pnpm reports stale
dependencies before running scripts instead of silently reinstalling them.
Keep TypeScript and ESLint within the peer ranges supported by Next's lint plugins;
do not disable rules or parser diagnostics to accommodate an unsupported major.
Node typings follow the Node runtime major declared in `package.json`.

ESLint combines Next Core Web Vitals, TypeScript, and template architecture rules.
Prettier owns formatting: two spaces, double quotes, semicolons, trailing commas,
and LF endings. Its Tailwind plugin reads `app/globals.css` and sorts classes in
JSX and `cn`, `clsx`, and `cva` calls. Generated output and local provider state
are excluded from formatting and linting. `pnpm typecheck` regenerates Next route
types before checking TypeScript so route edits do not leave stale validators.

Tailwind v4 configuration stays in `app/globals.css`; shadcn's
`tailwind.config` field is intentionally empty. The Tailwind import scopes source
detection to this template and supplies the standard mobile-first `sm`, `md`,
`lg`, `xl`, and `2xl` breakpoints (40, 48, 64, 80, and 96rem). Add custom
breakpoints through CSS `@theme` only when the design requires them. Do not
duplicate the CSS theme, animations, or breakpoints in a legacy config file.

## 17. Destructive/live operations

Do not perform without explicit user instruction:

- production deployment;
- destructive database change;
- live provider mutation;
- secret rotation;
- provider account provisioning;
- irreversible migration.

Normal Prisma migration generation is allowed only when the active implementation spec requires a schema change and the user has authorized that work.
