---
title: {{appName}} — Technical Requirements
doc: tech-requirements
status: draft
updated: {{createdAt}}
compiles_to: .claude/contracts/application.yaml (toolchain, environment)
---

# {{appName}} — Technical Requirements

Pre-filled from the Maximal Template. Change a version only by upgrading `package.json` and recording a decision.

## 1. Stack

| Concern    | Choice                                                                |
| ---------- | --------------------------------------------------------------------- |
| Runtime    | Node 24, pnpm (version in `package.json` `packageManager`)            |
| Framework  | Next.js 16 App Router, React 19, TypeScript strict                    |
| Data       | Postgres (Neon) through Prisma 7 with `@prisma/adapter-neon`; RLS     |
| Identity   | Clerk (keyless in development until keys are set)                     |
| Validation | Zod, shared by forms and server actions                               |
| UI         | Tailwind CSS 4 tokens in `app/globals.css`, shadcn-derived primitives |
| Tests      | Vitest (unit, `test:rls` against real Postgres), Playwright smoke     |
| Hosting    | Vercel                                                                |

Installed modules: {{modules}}. Each module's providers and env are listed in `hipster.modules.json`.

## 2. Scripts

| Script        | Does                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| `dev`         | `next dev`                                                              |
| `validate`    | format check, lint (doctrine), typecheck, check:modules, ownership, env |
| `test`        | unit tests                                                              |
| `test:rls`    | cross-tenant isolation against `DATABASE_URL_TEST`                      |
| `test:e2e`    | Playwright smoke                                                        |
| `build`       | production build                                                        |
| `db:init`     | migrate (dev for a fresh database, deploy otherwise) + apply RLS SQL    |
| `issues:sync` | validate the issue files (dry run); `--apply` syncs them to GitHub      |

## 3. Environment

`.env.example` is generated from `hipster.modules.json` (`node scripts/env-example.mjs`). Copy it to `.env.local`; never commit `.env*` files. `pnpm check:env` fails when code reads a variable the manifest does not declare.

## 4. App-specific requirements

<!-- Fill from the PRD: performance budgets, data retention, integrations beyond the installed modules, compliance. -->

TODO

## 5. Deployment

TODO: Vercel project, Neon project and branches, Clerk instance, which environment variables each environment needs.
