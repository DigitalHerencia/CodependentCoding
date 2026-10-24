---
title: Codependent Coding — Technical Requirements
doc: tech-requirements
status: active
updated: 2026-10-22
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

| Package                                        | Version        | Notes                                                  |
| ---------------------------------------------- | -------------- | ------------------------------------------------------ |
| typescript                                     | 6.0.3          | TS 7 is unsupported by typescript-eslint 8.x (DEC-006) |
| eslint                                         | 9.39.5         | Proven with eslint-config-next 16.3.4                  |
| eslint-config-next                             | 16.3.4         |                                                        |
| eslint-config-prettier                         | 10.1.8         | Always last in flat config                             |
| prettier                                       | 3.9.6          |                                                        |
| prettier-plugin-tailwindcss                    | 0.8.1          | Class sorting (CC-FMT-002)                             |
| next                                           | 16.3.4         | App Router, Turbopack, typed routes, React Compiler    |
| react / react-dom                              | 19.2.8         |                                                        |
| tailwindcss / @tailwindcss/postcss             | 4.3.3          |                                                        |
| prisma / @prisma/client / @prisma/adapter-neon | 7.10.0         | Multi-file schema                                      |
| @neondatabase/serverless                       | 1.1.0          |                                                        |
| @clerk/nextjs                                  | 7.9.1          |                                                        |
| zod                                            | 4.5.4          |                                                        |
| react-hook-form / @hookform/resolvers          | 7.87.0 / 5.9.1 | All forms                                              |
| vitest                                         | 4.1.11         |                                                        |
| @playwright/test                               | 1.62.1         |                                                        |
| stripe                                         | 22.6.1         | `billing` module                                       |
| commander / @clack/prompts                     | CLI only       | Pin on CLI creation                                    |

## 3. Repository layout

```text
codependent-coding/
├── app/                      landing page only
├── components/               landing-page presentation
├── public/                   brand assets
├── packages/cli/             Hipster Stack CLI (local, unpublished)
├── template/                 Maximal Template — runnable Next.js app
├── plugin/loaded-vibes/      Claude Code plugin
├── .claude-plugin/           local plugin marketplace manifest
├── scripts/github/           issue/label/milestone sync
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
| `dev`                     | `next dev` (no tunnels or personal URLs)                                                   |
| `build`                   | `next build --turbopack`                                                                   |
| `lint` / `lint:fix`       | `eslint . --max-warnings=0` (doctrine included)                                            |
| `doctrine:test`           | `node --test eslint/*.test.mjs`                                                            |
| `typecheck`               | `next typegen && tsc --noEmit`                                                             |
| `format` / `format:check` | Prettier                                                                                   |
| `test`                    | `vitest run`                                                                               |
| `test:rls`                | RLS cross-tenant suite against `DATABASE_URL_TEST`                                         |
| `test:e2e`                | Playwright smoke                                                                           |
| `check:ownership`         | orphan/ambiguous-owner check over all files                                                |
| `check:env`               | manifest env ↔ `lib/env/*.ts`; fresh `.env.example`; no `process.env` elsewhere            |
| `db:init`                 | `prisma migrate dev --name init` + apply `prisma/rls/*.sql` as a second migration          |
| `issues:sync`             | validate `context/specs/issues/*.md`; `--apply` syncs labels, milestones, issues to GitHub |
| `validate`                | `format:check && lint && doctrine:test && typecheck && check:ownership && test`            |
| `postinstall`             | `prisma generate`                                                                          |

## 5. Next.js configuration

- `typedRoutes: true`, `reactStrictMode: true`, `poweredByHeader: false`, `reactCompiler: true`.
- Security headers via `headers()`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`.
- `proxy.ts` runs `clerkMiddleware` for route protection only.
- Fonts: generated apps use offline-safe fonts (npm-packaged or `next/font/local`) so builds never depend on Google Fonts. The factory landing page keeps its brand fonts.

## 6. Data

- Neon Postgres. Two roles: `owner` (migrations) and `app_user` (runtime, **no BYPASSRLS**).
- `DATABASE_URL` (app_user, pooled), `DIRECT_URL` (owner, migrations), `DATABASE_URL_TEST` (test branch).
- Prisma 7 with `@prisma/adapter-neon`; client generated to `generated/prisma` (git-ignored).
- Multi-file schema at `prisma/schema/`; RLS SQL at `prisma/rls/`.
- Generated apps start without migrations; `pnpm db:init` creates `init` then `rls`.

## 7. Caching

- Public routes: static or ISR via route-segment `revalidate`.
- Tenant routes: dynamic and fresh by default. Cached reads only through `lib/cache` (tags, lifetimes, invalidation).
- Never cache authorization, membership, payment, or readiness decisions.
- Next.js Cache Components stays off in v1 (DEC-012).

## 8. Testing

| Level           | Tool                          | Scope                                                                                |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| Doctrine        | node:test + ESLint RuleTester | Every CC rule has valid/invalid cases                                                |
| Unit            | Vitest                        | workflows, schemas, DTO mappers, CLI composition                                     |
| Integration     | Vitest + real Postgres        | RLS cross-tenant isolation, transactions, webhook idempotency                        |
| E2E smoke       | Playwright                    | public page, sign-in redirect, one tenant route                                      |
| Composition     | Vitest (root)                 | `compose` output for blank / each preset / maximal: prisma validate, ownership, lint |
| CI build matrix | GitHub Actions                | compose → install → lint → typecheck → build                                         |

## 9. CLI technical requirements

- TypeScript, run with `tsx` in dev, bundled with `tsdown` for linking.
- Locates the template via `HIPSTER_TEMPLATE` env or the CLI's own repo path.
- Composition pipeline: copy template (excluding `node_modules`, `.next`, `generated`, `prisma/migrations`, `tests/template/` (pins the full template), tests of removed modules) → compute ownership → delete files owned by unselected modules → strip `// @module <id>` tagged lines → rewrite `lib/modules/registry.ts` → prune `package.json` deps declared only by removed modules → rebuild `.env.example` → write `hipster.json` → copy generated-app governance → apply brand color token → `prisma validate` → `pnpm install` → `git init` + initial commit `chore: scaffold from hipster-stack`.
- `slice` templates live in `packages/cli/templates/slice/` and are derived from the `projects` module; field DSL: `name:string, amount:decimal?, status:enum(open|won|lost), dueAt:datetime?, ownerId:ref(User)`.
- `slice` plans every write before touching disk and refuses on any conflict (existing model, file or export; unknown or non-tenant ref target; base-owned module id). Types: `string`, `text`, `int`, `decimal`, `boolean`, `datetime`, `enum(a|b)`, `ref(Model)` (field named `<relation>Id`); `?` makes a field optional. Existing module files are merged through the TypeScript AST (imports joined, declarations appended); a new module gets `lib/modules/<id>.module.ts`, a manifest entry and a regenerated registry. Back-relations on `Organization` and ref targets carry `// @module <id>`; RLS is appended to `prisma/rls/<id>.sql`. Outputs then go through `prisma format`, `prisma generate`, Prettier and `eslint --fix`.
- `add <modules...>` composes the current template for the app's installed modules and again with the requested closure, and applies the difference: new module files, `// @module` lines restored into base schema files (inside their model, after their template neighbour), registry/manifest/`.env.example` rebuilt, the modules' `packages` added to `package.json`. It refuses, listing every file, when the app changed or created a file the module would write; nothing is written then.
- `doctor` is read-only: required env names from the manifest (shell, `.env.local`, `.env`; presence only, values never printed), database reachable (`DIRECT_DATABASE_URL`, else `DATABASE_URL`), migrations applied (`prisma/migrations` vs `_prisma_migrations`), RLS enabled and forced on every tenant table, `pnpm lint`, `pnpm check:ownership` (`--no-tools` skips the last two). Each row is pass/warn/fail/skip with a fix hint; any fail exits 1.
- `compose <dir> --preset|--modules|--all` is `new` without prompts, install or git (file steps + `prisma validate`), for CI.
- No network access during composition. Provisioning is a separate, opt-in step.
- `new --provision` runs three independent steps, each skippable (`--no-github`, `--no-neon`, `--no-vercel`, or declined at the prompt) and check-before-create: `gh repo create --private --push`; `neonctl projects create --role owner`, then `app_user` (LOGIN, NOBYPASSRLS, table rights + default privileges) created in SQL, with `DATABASE_URL` (app_user, pooled) and `DIRECT_DATABASE_URL` (owner, direct) written to `.env.local`; `vercel project create` + `vercel link` + `vercel env add` (production, preview; values on stdin). A missing CLI or login prints install/sign-in guidance and the next step still runs. `new <existing app> --provision` provisions only, so a step can be finished later.

## 10. Plugin technical requirements

- Location `plugin/loaded-vibes/` with `.claude-plugin/plugin.json`, `skills/`, `agents/`, `hooks/hooks.json`, `scripts/`, `references/`.
- Local marketplace: `.claude-plugin/marketplace.json` at repo root; install with `/plugin marketplace add <repo path>` then `/plugin install loaded-vibes@codependent-coding`.
- Hook scripts are Node (`.mjs`), cross-platform, read hook JSON from stdin, exit `2` with a message to feed back to Claude.
- Skills reference CLI commands instead of re-deriving deterministic output.
- `references/doctrine.md` is generated by `pnpm plugin:doctrine` (classifier from Architecture.md §3.3, rule table from `validation.yaml`); `tests/plugin/plugin.test.ts` fails when it is stale.
- Skill evals live in `plugin/loaded-vibes/evals/<case>/` (`prompt.md` + `graders/*.md`); run `claude plugin eval plugin/loaded-vibes --tag classify --ablation none` (uses the caller's Claude credential, about $0.05 a run).

## 11. CI/CD

- `.github/workflows/ci.yml` on PR and push to `main`: install (frozen lockfile), format check, lint, doctrine tests, typecheck, unit tests — for root and template.
- Composition matrix job `presets`: blank, each preset and `--all`, each `hipster-stack compose template/.sandbox/<p>` → `pnpm install` → lint → typecheck → build with placeholder env. It runs on every push to `main` and on PRs that touch `template/`, `packages/cli/` or `ci.yml` (job `changes`).
- Vercel deploys the landing page from `main`.
- Branching: GitHub Flow — `main` plus short-lived issue branches `<type>/<issue>-<slug>`; squash-merge PRs with `Closes #N` (DEC-010).
- Conventional Commits: `feat|fix|refactor|docs|test|chore|ci(scope): subject`.

## 12. Performance and quality budgets

- Generated app first build ≤ 3 min on CI; `new` without provisioning ≤ 2 min excluding install.
- Landing page Lighthouse ≥ 95 performance/accessibility.
- `pnpm lint` on template ≤ 60 s locally.
