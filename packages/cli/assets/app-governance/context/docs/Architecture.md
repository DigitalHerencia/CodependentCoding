---
title: {{appName}} — Architecture
doc: architecture
status: active
updated: {{createdAt}}
compiles_to: .claude/contracts/application.yaml (architecture), .claude/contracts/validation.yaml
---

# {{appName}} — Architecture

Sections 2 to 5 are the Codependent Coding doctrine, shipped with the app and enforced by `pnpm lint` (`eslint/`). Change them only with a decision record and the matching lint change. Sections 1 and 6 belong to this app.

## 1. System map

<!-- Fill from the PRD: the domains, who uses each, and the outside systems they talk to. -->

TODO

## 2. Governing sentence

> Routes own URL and HTTP boundaries. Features orchestrate application capabilities. Components render. Fetchers read persisted data. Actions own ordinary CRUD mutation boundaries. Schemas validate runtime input. Workflows constitute reusable application logic from server operations and helpers. Transactions preserve atomic database invariants. Authentication establishes identity. Authorization decides access. Integrations own provider mechanics. Webhooks own provider HTTP request lifecycles.

## 3. Template layer model

```text
URL ─► app/ (route) ─► features/ ─► components/blocks ─► components/ui
                          │
                          ├─► lib/fetchers   (reads)
                          ├─► lib/actions    (CRUD writes, "use server")
                          ├─► lib/workflows  (named application logic)
                          │      ├─► lib/db/transactions (atomic writes)
                          │      └─► lib/integrations/<provider>
                          ├─► lib/auth / lib/authz
                          └─► schemas/ · types/ · lib/cache · lib/constants · lib/utils
```

### 3.1 Responsibility map

| Concern                  | Home                                                                           | Rule                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| URL / page               | `app/**/page.tsx`                                                              | Thin: Suspense + feature, or blocks for static public pages                 |
| Provider webhook         | `app/api/<provider>/webhooks/route.ts`                                         | Raw-body verify → idempotent persistence → ack                              |
| Capability orchestration | `features/<domain>/<domain><Thing>Feature.tsx`                                 | Server component; renders blocks                                            |
| Browser behavior         | `features/<domain>/<name>.client.tsx`                                          | `"use client"`; UI controls + actions only                                  |
| Form                     | `features/<domain>/<domain><Verb><Thing>Form.tsx`                              | React Hook Form + Zod + action; may use UI primitives                       |
| Loading                  | `features/<domain>/<domain><Thing>Skeleton.tsx`                                | Mirrors real layout; `ui/skeleton` only                                     |
| Domain presentation      | `components/templates/<domain><Thing>Template.tsx`                             | Pure; composed from blocks                                                  |
| Reusable composition     | `components/blocks/<kebab>.tsx`                                                | Pure presentation                                                           |
| Structure                | `components/nav`, `components/shells`                                          | Frames; Clerk UI widgets allowed                                            |
| Primitive                | `components/ui/<kebab>.tsx`                                                    | shadcn/BoldKit-derived                                                      |
| Read                     | `lib/fetchers/<domain>Fetchers.ts`                                             | `server-only`; auth → authz → scoped select → DTO                           |
| CRUD write               | `lib/actions/<domain>Actions.ts`                                               | `"use server"`; auth → authz → Zod → write/tx → invalidate → `ActionResult` |
| Application logic        | `lib/workflows/<domain>Workflows.ts` or `lib/workflows/<domain>/<verbNoun>.ts` | `server-only`; arranges operations; no Prisma client, no SDKs               |
| Atomic write             | `lib/db/transactions/<domain>-<verb>-<noun>.tx.ts`                             | DB-only; no network                                                         |
| DB runtime               | `lib/db/client.ts`, `provider.ts`, `tenant.ts`                                 | Prisma client, adapter, RLS context                                         |
| Projection               | `lib/db/selects/<domain>.selects.ts`                                           | Precise selects                                                             |
| Mapping                  | `lib/db/dto/<domain>.dto.ts`                                                   | Record → transport-safe DTO                                                 |
| Identity                 | `lib/auth/{clerk,auth,redirects,clerk-webhooks}.ts`                            | Clerk only here                                                             |
| Access                   | `lib/authz/{roles,permissions,resources,policies,attributes?}.ts`              | App-owned RBAC/ABAC                                                         |
| Provider                 | `lib/integrations/<provider>/<kebab>.ts`                                       | SDK only here                                                               |
| Cache                    | `lib/cache/{tags,life,invalidate}.ts`                                          | Semantics only                                                              |
| Module contribution      | `lib/modules/<id>.module.ts`, `registry.ts`                                    | Nav, dashboard widgets, permissions                                         |
| Env                      | `lib/env/<owner>.ts`                                                           | Zod-validated, `server-only`                                                |
| Validation               | `schemas/<domain>Schemas.ts`                                                   | Zod; client- and server-safe                                                |
| Shared types             | `types/<domain>Types.ts`                                                       | Compile-time contracts                                                      |
| Schema                   | `prisma/schema/<owner>.prisma`, `prisma/rls/<owner>.sql`, `prisma/seed.ts`     | Prisma lifecycle                                                            |

### 3.2 Exceptions

1. Static public pages compose blocks directly (no feature).
2. Form features compose UI primitives directly and may declare `"use client"`.
3. Skeletons may import `components/ui/skeleton`.
4. `.client.tsx` companions may import interactive UI controls (button, input, label, select, checkbox, switch, textarea, toggle, date/time pickers, etc.).

### 3.3 Classifier (use before creating a file)

```text
Static public presentation?      app/(public) page + components/blocks
React Hook Form?                 features/<d>/<d><Verb><Thing>Form.tsx
Browser-only behavior?           features/<d>/<name>.client.tsx
Capability orchestration?        features/<d>/<d><Thing>Feature.tsx
Persisted read?                  lib/fetchers/<d>Fetchers.ts
Ordinary CRUD write?             lib/actions/<d>Actions.ts
Named application logic?         lib/workflows/<d>Workflows.ts
Multi-write atomicity?           lib/db/transactions/<d>-<verb>-<noun>.tx.ts
Prisma select / DTO?             lib/db/selects | lib/db/dto
Identity?                        lib/auth
Access decision?                 lib/authz
Provider SDK?                    lib/integrations/<provider>
Webhook HTTP lifecycle?          app/api/<provider>/webhooks/route.ts
Runtime validation?              schemas/<d>Schemas.ts
Shared type?                     types/<d>Types.ts
Cache tag / lifetime?            lib/cache
Constant / pure util?            lib/constants | lib/utils
None of the above?               Stop. Do not invent a layer (CC-NAME-002).
```

## 4. Doctrine enforcement

Doctrine is code. `eslint/doctrine-map.mjs` is the machine table (layers, import categories, boundaries, naming); `eslint/codependent-plugin.mjs` is the mechanics; `.claude/contracts/validation.yaml` is the contract. Every finding prints its rule ID.

| ID               | Rule                                                                                       | Enforcement                          |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------------------------ |
| CC-ROUTE-001     | Routes never import DB, fetchers, actions, workflows, integrations, SDKs, or UI primitives | `codependent/layer-boundaries`       |
| CC-ROUTE-002     | `proxy.ts` only gates routes                                                               | layer-boundaries                     |
| CC-HOOK-001      | Route handlers: no Prisma, SDKs, Clerk server, presentation                                | layer-boundaries                     |
| CC-FEAT-001      | Normal features: no DB, transactions, integrations, SDKs, UI primitives, RHF               | layer-boundaries                     |
| CC-FEAT-002      | Forms: no DB, fetchers, workflows, integrations                                            | layer-boundaries                     |
| CC-FEAT-003      | Skeletons: `ui/skeleton` + blocks only                                                     | layer-boundaries                     |
| CC-FEAT-004      | Client companions: controls + actions; no server reads                                     | layer-boundaries                     |
| CC-BLOCK-001     | Blocks/templates are pure presentation                                                     | layer-boundaries                     |
| CC-BLOCK-002     | Nav/shells pure presentation (+ Clerk UI)                                                  | layer-boundaries                     |
| CC-UI-001 / CC-UI-002 | Primitives and hooks stay presentation/browser-side                                        | layer-boundaries                     |
| CC-READ-001      | Fetchers: no actions, workflows, integrations, transactions                                | layer-boundaries                     |
| CC-READ-002      | Fetchers never call Prisma write methods                                                   | `codependent/no-fetcher-writes`      |
| CC-WRITE-001     | Actions: no integrations or SDKs                                                           | layer-boundaries                     |
| CC-WRITE-002     | Actions start with `"use server"`                                                          | `codependent/use-server-actions`     |
| CC-FLOW-001      | Workflows: no Prisma client, no SDKs                                                       | layer-boundaries                     |
| CC-TX-001        | Transactions: DB only                                                                      | layer-boundaries                     |
| CC-TX-002        | No `fetch()` in transactions                                                               | `codependent/no-transaction-network` |
| CC-DB-001        | `lib/db` does not reach up into app layers                                                 | layer-boundaries                     |
| CC-DB-002        | No unsafe raw SQL; tagged raw SQL only in `lib/db`                                         | `codependent/no-raw-sql`             |
| CC-AUTH-001      | Authentication never decides access                                                        | layer-boundaries                     |
| CC-AUTHZ-001     | Authorization never reads Clerk server state                                               | layer-boundaries                     |
| CC-INT-001       | Integrations never persist                                                                 | layer-boundaries                     |
| CC-CACHE-001     | Cache helpers hold semantics only                                                          | layer-boundaries                     |
| CC-PURE-001      | Constants/utils/types are dependency-free                                                  | layer-boundaries                     |
| CC-SCHEMA-001    | Schemas are pure                                                                           | layer-boundaries                     |
| CC-SRV-001       | Server modules import `server-only` (auto-fix)                                             | `codependent/require-server-only`    |
| CC-CLIENT-001    | `"use client"` placement                                                                   | `codependent/use-client-placement`   |
| CC-NAME-001      | Directory naming conventions                                                               | `codependent/filename-convention`    |
| CC-NAME-002      | No `services/`, `managers/`, `helpers/`...                                                 | `codependent/no-generic-names`       |
| CC-STYLE-001     | Named exports only (framework files excepted)                                              | `codependent/no-default-export`      |
| CC-STYLE-002     | `@/` alias, no parent-relative imports (auto-fix)                                          | `codependent/no-parent-imports`      |
| CC-MOD-001       | A module imports another module only if declared in `dependsOn`                            | `codependent/module-boundaries`      |
| CC-MOD-002       | Base never imports module-owned files (registry excepted)                                  | `codependent/module-boundaries`      |
| CC-MOD-003       | Every file has exactly one owner                                                           | `pnpm check:ownership`               |
| CC-FMT-001 / CC-FMT-002 | Prettier formatting; Tailwind class order                                                  | Prettier + plugin                    |
| CC-TS-001        | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`                         | tsconfig                             |

Review-only rules (not mechanizable, checked in review): actions validate with Zod before writing; tenant scope lives in the query predicate; consequential decisions never read stale cache; webhooks reconcile current provider truth.

## 5. Module system

- `hipster.modules.json` lists the installed modules ({{modules}}): id, kind (`domain` or `addon`), `dependsOn`, `owns` globs, provider `packages`, and `env`. `pnpm check:modules` validates it.
- Every file has exactly one owner, computed from its path (`pnpm check:ownership`, CC-MOD-003): an explicit `owns` glob, else a directory segment equal to a module id, else a basename that starts with the id, else base.
- A module imports only base, itself and its `dependsOn` (CC-MOD-001). Base reaches modules only through `lib/modules/registry.ts` (CC-MOD-002), which `hipster-stack` generates.
- Prisma models live in `prisma/schema/<owner>.prisma`; a relation field that points at another module carries `// @module <id>`. RLS lives in `prisma/rls/<owner>.sql`.
- Env is declared per owner in the manifest and read through `lib/env/<owner>.ts` (`pnpm check:env`).
- New domain slices come from `hipster-stack slice <entity> --module <id> --fields "<dsl>"`, derived from the golden `projects` slice.

## 6. App-specific architecture

<!-- Fill as the app grows. Each new domain gets a row; each deviation from sections 2 to 5 gets a decision in .claude/execution/decisions.json. -->

| Domain (module id) | Entities | Routes | Notes |
| ------------------ | -------- | ------ | ----- |
| TODO               | TODO     | TODO   | TODO  |
