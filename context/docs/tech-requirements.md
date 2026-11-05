---
title: Codependent Coding — Technical Requirements
doc: tech-requirements
status: active
updated: 2026-10-29
compiles_to: .claude/contracts/application.yaml, .claude/contracts/validation.yaml
---

# Technical Requirements

## 1. Environment

| Item            | Requirement                                                               |
| --------------- | ------------------------------------------------------------------------- |
| OS              | Windows 11 (primary), also Linux/macOS for CI                             |
| Shell           | PowerShell 7 for owner commands; Git Bash available for Claude Code hooks |
| Node            | `24.x` (`.node-version` = `24`)                                           |
| Package manager | `pnpm@12.3.4` via Corepack, everywhere (root and template)                |
| Editor          | VS Code + ESLint + Prettier extensions, format on save                    |
| Agent           | Claude Code (VS Code extension), Pro plan                                 |
| External CLIs   | `gh`, `vercel`, `neonctl` (optional provisioning)                         |

## 2. Pinned toolchain

Exact versions only (no `^`/`~`). Upgrades are explicit issues.

| Package                                        | Version        | Notes                                                            |
| ---------------------------------------------- | -------------- | ---------------------------------------------------------------- |
| @typescript/native (npm:typescript)            | 7.0.2          | Native TypeScript 7 type checking                                |
| typescript (npm:@typescript/typescript6)       | 6.0.2          | Programmatic API compatibility for Next.js and typescript-eslint |
| eslint                                         | 9.39.5         | Proven with eslint-config-next 16.4.3                            |
| eslint-config-next                             | 16.4.3         |                                                                  |
| eslint-config-prettier                         | 10.1.8         | Always last in flat config                                       |
| prettier                                       | 3.9.10         |                                                                  |
| prettier-plugin-tailwindcss                    | 0.8.1          | Class sorting (CC-FMT-002)                                       |
| next                                           | 16.4.3         | App Router, Turbopack, typed routes, React Compiler              |
| react / react-dom                              | 19.3.1         |                                                                  |
| tailwindcss / @tailwindcss/postcss             | 4.3.3          |                                                                  |
| prisma / @prisma/client / @prisma/adapter-neon | 7.10.1         | Multi-file schema                                                |
| @neondatabase/serverless                       | 1.2.0          |                                                                  |
| @clerk/nextjs                                  | 7.9.20         |                                                                  |
| zod                                            | 4.6.7          |                                                                  |
| react-hook-form / @hookform/resolvers          | 7.91.0 / 5.9.2 | All forms                                                        |
| vitest                                         | 4.1.12         |                                                                  |
| @playwright/test                               | 1.64.1         |                                                                  |
| stripe                                         | 22.6.2         | `billing` module                                                 |
| commander / @clack/prompts                     | 15.0.0 / 1.8.1 | CLI only                                                         |

## 3. Repository layout

```text
codependent-coding/
├── app/                      static site routes (DEC-071)
├── components/               site presentation
├── features/ lib/ types/     site features, data and types (same layers as the template)
├── public/                   brand assets
├── packages/cli/             Hipster Stack CLI (local, unpublished)
├── packages/tui/             terminal app on termcn (local, unpublished; DEC-072)
├── template/                 Maximal Template — runnable Next.js app
├── plugin/loaded-vibes/      Claude Code plugin
├── .claude-plugin/           local plugin marketplace manifest
├── scripts/                  doctrine check, plugin doctrine, CLI link; github/ issue sync
├── tests/                    root Vitest suites (cli, doctrine, plugin)
├── context/
│   ├── docs/                 human intent (this folder)
│   ├── specs/issues/         work items (sync to GitHub)
│   └── doctrine/             TypeScripture books (reference, non-authoritative)
├── .claude/
│   ├── contracts/            application.yaml, validation.yaml, design.yaml
│   ├── execution/            decisions.json, progress.json, handoff.json
│   ├── hooks/                hook scripts
│   └── settings.json
├── .github/                  issue/PR templates, labels, CI
├── CLAUDE.md                 agent router
└── AGENTS.md                 pointer to CLAUDE.md
```

Removed: `.agents/`, `packages/core`, `packages/schema`, `packages/loaded-vibes` (Codex), `content.zip`, `template-disposition.json`, every non-landing route, root `lib/` catalog code, `context/specs/{anthimeria,generation,ontologies,simples,loaded-vibes}`, `template/.agents`, `template/context`, `template/AGENTS.md`.

## 4. Scripts contract

### Root

| Script                    | Command                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `dev` / `build` / `start` | Next.js for the landing page                                     |
| `lint`                    | `eslint . --max-warnings=0`                                      |
| `format` / `format:check` | Prettier                                                         |
| `typecheck`               | `tsc --noEmit`                                                   |
| `test`                    | `vitest run` (CLI unit + composition tests)                      |
| `cli`                     | `tsx packages/cli/src/cli.ts`                                    |
| `cli:build`               | bundle CLI to `packages/cli/dist`                                |
| `cli:link`                | build + `pnpm add --global link:<abs path>/packages/cli`         |
| `validate`                | `format:check && lint && typecheck && test`                      |
| `issues:sync`             | `node scripts/github/sync-issues.mjs` (dry run unless `--apply`) |

### Template (`template/`)

| Script                    | Command                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `dev`                     | `prisma generate && next dev` (no tunnels or personal URLs)                                |
| `build`                   | `prisma generate && next build --turbopack`                                                |
| `lint` / `lint:fix`       | `eslint . --max-warnings=0` (doctrine included)                                            |
| `doctrine:test`           | `node --test eslint/*.test.mjs`                                                            |
| `typecheck`               | `prisma generate && next typegen && tsc --noEmit`                                          |
| `format` / `format:check` | Prettier                                                                                   |
| `test`                    | `vitest run`                                                                               |
| `test:rls`                | RLS cross-tenant suite against `DATABASE_URL_TEST`                                         |
| `test:e2e`                | Playwright smoke                                                                           |
| `check:ownership`         | orphan/ambiguous-owner check over all files                                                |
| `check:env`               | manifest env ↔ `lib/env/*.ts`; fresh `.env.example`; no `process.env` elsewhere            |
| `db:init`                 | `prisma migrate dev --name init` + apply `prisma/rls/*.sql` as a second migration          |
| `issues:sync`             | validate `context/specs/issues/*.md`; `--apply` syncs labels, milestones, issues to GitHub |
| `validate`                | `format:check && lint && doctrine:test && typecheck && check:ownership && test`            |

## 5. Next.js configuration

- `typedRoutes: true`, `reactStrictMode: true`, `poweredByHeader: false`, `reactCompiler: true`, `cacheComponents: true`, `partialPrefetching: true`, `experimental.globalNotFound: true`.
- Each route group is its own root layout (`components/shells/document-shell.tsx` renders `<html>`). `(public)` exports `ensureStatic = "navigation"`; `(auth)`, `(setup)` and `(tenant)` export `instant = false` and `await connection()` before rendering, so the whole document renders per request and carries the CSP nonce. `<ClerkProvider dynamic>` wraps only those three.
- Security headers via `headers()`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`.
- `proxy.ts` gates only: public pages skip Clerk and get the static CSP (`script-src 'self' 'unsafe-inline'`); every other path runs `clerkMiddleware`, sends signed-out visitors to `/sign-in` (UX; layouts and the data layer re-check) and gets a per-request nonce CSP with `'strict-dynamic'` and the Clerk hosts from Clerk's CSP guide.
- Fonts: generated apps use offline-safe fonts (npm-packaged or `next/font/local`) so builds never depend on Google Fonts. The factory landing page keeps its brand fonts.

## 6. Data

- Neon Postgres. Three roles: `owner` (migrations), `app_runtime` (the app) and `app_system` (webhooks, cron), the last two created in SQL by the rls migration with **no BYPASSRLS** (DEC-087). RLS ships only as migrations: `pnpm db:rls` writes `prisma/rls/*.sql` into one, `pnpm db:rls:check` diffs live `pg_policies` against it.
- `DATABASE_URL` (app_runtime, pooled), `DATABASE_URL_UNPOOLED` (owner, migrations), `DATABASE_URL_TEST` (test branch).
- Prisma 7 with `@prisma/adapter-neon`; client generated to `generated/prisma` (git-ignored).
- Multi-file schema at `prisma/schema/`; RLS SQL at `prisma/rls/`.
- Generated apps start without migrations; `pnpm db:init` creates `init` then `rls`.

## 7. Caching

- Public routes: static (`ensureStatic`); cached values via `'use cache'` + `cacheLife`, never segment config (`revalidate`, `dynamic`, `fetchCache`).
- Tenant routes: dynamic and fresh by default. Cached reads only through `lib/cache` (tags, lifetimes, invalidation).
- Never cache authorization, membership, payment, or readiness decisions. No `'use cache'` in features or fetchers (CC-CACHE-002).
- Cache Components is on (ledger R-1; supersedes DEC-012).

## 8. Testing

| Level       | Tool                          | Scope                                                                                |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| Doctrine    | node:test + ESLint RuleTester | Every CC rule has valid/invalid cases                                                |
| Unit        | Vitest                        | workflows, schemas, DTO mappers, CLI composition                                     |
| Integration | Vitest + real Postgres        | RLS cross-tenant isolation, transactions, webhook idempotency                        |
| E2E smoke   | Playwright                    | public page, sign-in redirect, CSP nonce + no browser CSP violations                 |
| Composition | Vitest (root)                 | `compose` output for blank / each preset / maximal: prisma validate, ownership, lint |

## 9. CLI technical requirements

- TypeScript, run with `tsx` in dev, bundled with `tsdown` for linking.
- Locates the template via `HIPSTER_TEMPLATE` env or the CLI's own repo path.
- Composition pipeline: copy template (excluding `node_modules`, `.next`, `generated`, `prisma/migrations`, `tests/template/` (pins the full template), tests of removed modules) → compute ownership → delete files owned by unselected modules → strip `// @module <id>` tagged lines → rewrite `lib/modules/registry.ts` → prune `package.json` deps declared only by removed modules → rebuild `.env.example` → write `hipster.json` → copy generated-app governance → apply brand color token → `prisma validate` → `pnpm install` → `git init` + initial commit `chore: scaffold from hipster-stack`.
- `slice` templates live in `packages/cli/templates/slice/` and are derived from the `projects` module; field DSL: `name:string, amount:decimal?, status:enum(open|won|lost), dueAt:datetime?, ownerId:ref(User)`.
- `slice` plans every write before touching disk and refuses on any conflict (existing model, file or export; unknown or non-tenant ref target; base-owned module id). Types: `string`, `text`, `int`, `decimal`, `boolean`, `datetime`, `enum(a|b)`, `ref(Model)` (field named `<relation>Id`); `?` makes a field optional. Existing module files are merged through the TypeScript AST (imports joined, declarations appended); a new module gets `lib/modules/<id>.module.ts`, a manifest entry and a regenerated registry. Back-relations on `Organization` and ref targets carry `// @module <id>`; RLS is appended to `prisma/rls/<id>.sql`. Outputs then go through `prisma format`, `prisma generate`, Prettier and `eslint --fix`.
- `add <modules...>` composes the current template for the app's installed modules and again with the requested closure, and applies the difference: new module files, `// @module` lines restored into base schema files (inside their model, after their template neighbour), registry/manifest/`.env.example` rebuilt, the modules' `packages` added to `package.json`. It refuses, listing every file, when the app changed or created a file the module would write; nothing is written then.
- `doctor` is read-only: required env names from the manifest (shell, `.env.local`, `.env`; presence only, values never printed), database reachable (`DATABASE_URL_UNPOOLED`, else `DATABASE_URL`), migrations applied (`prisma/migrations` vs `_prisma_migrations`), RLS enabled and forced on every tenant table, `pnpm lint`, `pnpm check:ownership` (`--no-tools` skips the last two). Each row is pass/warn/fail/skip with a fix hint; any fail exits 1.
- `compose <dir> --preset|--modules|--all` is `new` without prompts, install or git (file steps + `prisma validate`), for CI.
- No network access during composition. Provisioning is a separate, opt-in step.
- Without `--provision`, interactive `new` asks for the Neon connection string (or takes `--database-url`). The CLI derives the direct URL by dropping `-pooler` from a Neon host, creates `app_runtime` (NOBYPASSRLS) as the string's owner role, writes `DATABASE_URL` (app_runtime, pooled) and `DATABASE_URL_UNPOOLED` (owner, direct, used by Prisma) to `.env.local`, and runs `pnpm db:init` after install so the initial commit carries `prisma/migrations`. `--yes` without `--database-url` skips it.
- `new` asks (or takes `--tenancy multi|single` and `--access abac|rbac`) whether the app has many organizations or one, and whether record rules (ABAC) run after role permissions (RBAC). The answers are baked in, not read at runtime: tenancy into the app's `lib/authz/mode.ts`; RBAC replaces `lib/authz/policies.ts` and its test with `packages/cli/templates/authz/`; both go into `hipster.json` (AUTH.md §4.3, §5).
- Interactive `new` is a wizard (`packages/cli/src/wizard/`, @clack/prompts + gradient-string): animated banner, then project folder and name, domain (preset or custom modules), brand color, Clerk application ID, publishable and secret keys, development and production webhook signing secrets and ngrok domain, the Neon connection string, the keys of every integration the domain brings in, organizations and authorization, and a confirm screen with secrets masked. Nothing is written before the confirm. Development keys go to `.env.local`, the production webhook secret to `.env.production.local` (both git-ignored), the Clerk application ID and ngrok domain to `hipster.json`. Every key can be left blank and filled in later.
- `new --provision` runs three independent steps, each skippable (`--no-github`, `--no-neon`, `--no-vercel`, or declined at the prompt) and check-before-create: `gh repo create --private --push`; `neonctl projects create --role owner`, then `app_runtime` (LOGIN, NOBYPASSRLS, table rights + default privileges) created in SQL, with `DATABASE_URL` (app_runtime, pooled) and `DATABASE_URL_UNPOOLED` (owner, direct) written to `.env.local`; `vercel project create` + `vercel link` + `vercel env add` (production, preview; values on stdin). A missing CLI or login prints install/sign-in guidance and the next step still runs. `new <existing app> --provision` provisions only, so a step can be finished later.

## 10. Plugin technical requirements

- Location `plugin/loaded-vibes/` with `.claude-plugin/plugin.json`, `skills/`, `agents/`, `hooks/hooks.json`, `scripts/`, `references/`.
- Local marketplace: `.claude-plugin/marketplace.json` at repo root; install with `/plugin marketplace add <repo path>` then `/plugin install loaded-vibes@codependent-coding`.
- Hook scripts are Node (`.mjs`), cross-platform, read hook JSON from stdin, exit `2` with a message to feed back to Claude.
- Skills reference CLI commands instead of re-deriving deterministic output.
- `references/doctrine.md` is generated by `pnpm plugin:doctrine` (classifier from Architecture.md §3.3, rule table from `validation.yaml`); `tests/plugin/plugin.test.ts` fails when it is stale.
- Hooks: `hooks/hooks.json` runs the factory's `.claude/hooks/lint-edited-file.mjs` (PostToolUse) and `execution-state-guard.mjs` (Stop) through `hooks/when-app.mjs`, which exits 0 unless `hipster.json` is at the project root. The copies in `plugin/loaded-vibes/hooks/` must stay byte-identical to `.claude/hooks/` (`tests/plugin/hooks.test.ts`); copy them when a factory hook changes.
- Agents: `agents/reviewer.md` (doctrine + AUTH.md §11 review, findings with CC IDs) and `agents/verifier.md` (reruns the checks `progress.json` claims) are read-only: their `tools` never include Edit or Write (`tests/plugin/plugin.test.ts`).
- Skill evals live in `plugin/loaded-vibes/evals/<case>/` (`prompt.md` + `graders/*.md`); run `claude plugin eval plugin/loaded-vibes --tag classify --ablation none` (uses the caller's Claude credential, about $0.05 a run).

## 11. CI/CD

- One workflow, `.github/workflows/ci.yml`, runs on pull requests. Manual runs require a comparison ref. There is no duplicate push-to-main run and no check-everything fallback for workflow edits.
- CI does only changed-file Prettier write, changed-code ESLint fix, type generation, type checking, and affected-project builds, following the necessary checkout and frozen dependency installation. Root, CLI, TUI, and template work run only when their inputs changed.
- Fixes apply inside the runner; CI does not commit or push them. Type generation runs once before checking/building.
- No automated tests, browser/dev servers, database containers, migration/drift jobs, doctrine/module check suites, or separate title-validation workflow.
- Local feature tests must target real affected behavior and changed files. New regressions require one failure against the unfixed code and a passing result after the fix. Never run a full suite. Runtime/browser verification is owner-run; agents must not start a dev server.
- Vercel's existing GitHub integration is separate from Actions; this workflow does not deploy.
- Use short-lived issue branches, Conventional Commit PR titles, squash merges, and branch deletion after merge. Specifications are canonical; GitHub issues/Project #19 track delivery.

## 12. Performance and quality budgets

- Generated app first build ≤ 3 min on CI; `new` without provisioning ≤ 2 min excluding install.
- Landing page Lighthouse ≥ 95 performance/accessibility.
- `pnpm lint` on template ≤ 60 s locally.

Vercel documentation was checked on 2026-11-05 and lists pnpm 12 support. The existing exact pnpm@12.3.4 pin is retained; the tracker's prohibition pending platform support is satisfied. TypeScript 7 and its TypeScript 6 API alias follow Microsoft's documented side-by-side configuration. Both applications enable React Compiler and declare explicit HSTS.
