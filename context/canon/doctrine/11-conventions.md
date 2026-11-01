---
title: Conventions
slug: conventions
order: 11
summary: Names, files, exports, imports, functions and TypeScript style — and the ownership rule that makes them computable.
rules:
  [
    CC-FMT-001,
    CC-FMT-002,
    CC-MOD-001,
    CC-MOD-002,
    CC-MOD-003,
    CC-NAME-001,
    CC-NAME-003,
    CC-NAME-004,
    CC-PURE-001,
    CC-SCHEMA-001,
    CC-STYLE-001,
    CC-STYLE-002,
    CC-STYLE-003,
    CC-STYLE-004,
    CC-STYLE-005,
  ]
---

# Conventions

## The ownership rule behind every name

A file belongs to module `<id>` when, in order: it matches an explicit `owns` glob in `hipster.modules.json`; any path segment equals `<id>`; or its basename starts with `<id>` followed by an uppercase letter, `.` or `-`. Otherwise it belongs to **base**. Two matches are an error.

Names are therefore not style; they are the module system. `crmFetchers.ts`, `crm.selects.ts`, `crm-blocks.tsx` and `features/crm/` are all owned by `crm` without a catalog.

> **CC-MOD-003** · `now` · `pnpm check:ownership`
> Every file has exactly one owner.

> **CC-MOD-001** · `now` · `codependent/module-boundaries`
> A module imports another module only if it declares it in `dependsOn`.

> **CC-MOD-002** · `now` · `codependent/module-boundaries`
> Base never imports module-owned files, except through `lib/modules/registry.ts`.

## File names

| Where                                        | Case               | Shape                                                                          | Example                            |
| -------------------------------------------- | ------------------ | ------------------------------------------------------------------------------ | ---------------------------------- |
| `components/ui`                              | kebab              | shadcn name                                                                    | `dropdown-menu.tsx`                |
| `components/blocks`, `templates`             | kebab              | `<slice>-blocks.tsx`, `<slice>-templates.tsx`                                  | `crm-blocks.tsx`                   |
| `components/{nav,shells,brand,chart}`        | kebab              | thing name                                                                     | `tenant-shell.tsx`                 |
| `features/<slice>`                           | camel, slice first | `<slice><Thing>Feature.tsx`, `…Form.tsx`, `…Skeleton.tsx`, `<name>.client.tsx` | `crmContactFeature.tsx`            |
| `lib/{fetchers,actions,workflows}`           | camel              | `<slice>Fetchers.ts`                                                           | `crmActions.ts`                    |
| `lib/db/selects`, `dto`                      | dotted             | `<slice>.selects.ts`, `<slice>.dto.ts`                                         | `crm.dto.ts`                       |
| `lib/db/transactions`                        | kebab              | `<slice>-<verb>-<noun>.tx.ts`                                                  | `crm-update-deal-stage.tx.ts`      |
| `lib/{auth,authz,cache,env,utils,constants}` | camel              | concern                                                                        | `actionResult.ts`, `pagination.ts` |
| `schemas`, `types`, `content`                | camel              | `<slice>Schemas.ts`, `<slice>Types.ts`, `<slice>.ts`                           | `crmSchemas.ts`                    |
| `prisma/schema`, `prisma/rls`                | lower              | `<owner>.prisma`, `<owner>.sql`                                                | `crm.sql`                          |
| `tests/{unit,integration,e2e}/<slice>`       | mirrors the module | `<module>.test.ts` / `.spec.ts`                                                | `crmActions.test.ts`               |
| folders                                      | kebab              | —                                                                              | `hugging-face/`                    |

Why two cases: shadcn names presentation files in kebab-case and the doctrine does not rename primitives; everything owned by a slice is slice-first so its owner is computable and so it sorts beside its siblings.

> **CC-NAME-001** · `now` · `codependent/filename-convention`
> File and folder names match the table.

> **CC-NAME-003** · `now` · `codependent/filename-convention`
> No version-shaped names (`v2`, `new`, `old`, `final`, `-copy`).

> **CC-NAME-004** · `users` (soft) · review
> A slice file past ~400 lines is a review flag; split by sub-domain (`crmContactsFetchers.ts`, `crmDealsFetchers.ts`) when it hurts navigation, not before.

## Inside files

| Thing                | Case            | Prefix                                                                                           |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| functions, variables | camelCase       | fetchers `get`/`list`; actions `create`/`update`/`delete`/domain verb; booleans `is`/`has`/`can` |
| components, types    | PascalCase      | —                                                                                                |
| true constants       | SCREAMING_SNAKE | —                                                                                                |
| enum values          | SCREAMING_SNAKE | (Prisma enums)                                                                                   |

> **CC-STYLE-001** · `now` · `codependent/no-default-export`
> Named exports only. Default exports exist only where Next requires them (`page`, `layout`, `loading`, `error`, `not-found`, `route` handlers are named HTTP methods, `manifest`, `sitemap`, `robots`, `opengraph-image`, config files).

> **CC-STYLE-002** · `now` · `codependent/no-parent-imports` (auto-fix)
> `@/` alias for every import except siblings in the same folder. No `../`.

> **CC-STYLE-003** · `now` · `@typescript-eslint/consistent-type-imports`
> `import type` for type-only imports.

> **CC-STYLE-004** · `now` · `codependent/no-barrels`
> No `index.ts` barrel files in `lib/` or `components/`. Barrels hide the layer boundaries the lint rules check and defeat tree-shaking.

> **CC-STYLE-005** · `now` · review
> `function` declarations for named and exported functions; arrow functions for inline callbacks. Early returns over nesting. No classes, except the error boundary (React requires one) and `Error` subclasses.

TypeScript: `type` by default, `interface` only to extend. Types derive from Zod (`z.infer`) or Prisma (`GetPayload`), never hand-copied. Tuning values that repeat go in `lib/constants`; security vocabulary never does. Comments say why, not what; every exported function in `lib/` has a one-line TSDoc summary; no commented-out code.

> **CC-PURE-001** · `now` · `codependent/layer-boundaries`
> `lib/constants`, `lib/utils` and `types/` import nothing from the rest of `lib/` (types may import generated Prisma types). They are safe on both sides of the server/client line.

> **CC-SCHEMA-001** · `now` · `codependent/layer-boundaries`
> `schemas/` imports only Zod, `types/`, `lib/constants`, generated Prisma enums (`@/generated/prisma/enums`, plain objects), and `lib/authz/roles.ts` (the one pure authz file). Schemas run in the browser (forms) and on the server (actions), so they must stay pure.

## Formatting

> **CC-FMT-001** · `now` · Prettier
> Prettier formats every file it supports.

> **CC-FMT-002** · `now` · `prettier-plugin-tailwindcss`
> Tailwind classes are sorted.
