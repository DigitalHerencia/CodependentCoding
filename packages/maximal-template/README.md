# TODO: App name

TODO: One-line pitch from `context/docs/PRD.md#overview`.

<!-- Agents: fill every TODO from context/docs at ENG-M3-P3.3-DOCS-T01. Keep sections; remove this comment when done. -->

## Overview

TODO: Two or three sentences: the problem, who it is for, and what the app does.

## Features

- TODO: one bullet per Must feature in `context/docs/PRD.md#functional-requirements`

## Tech stack

Next.js (App Router) · TypeScript · PostgreSQL (Neon) + Prisma · Clerk · Tailwind CSS + shadcn/ui · Vercel. Integrations: TODO: from `context/docs/tech-requirements.md#integrations`.

## Getting started

Requirements: Node.js 24, pnpm, and the accounts listed in `.env.example`.

```powershell
pnpm install
Copy-Item .env.example .env.local   # then fill in the values
pnpm prisma:generate
pnpm dev
```

## Scripts

| Script                                          | Purpose                                                |
| ----------------------------------------------- | ------------------------------------------------------ |
| `pnpm dev`                                      | Start the development server                           |
| `pnpm build`                                    | Production build                                       |
| `pnpm lint` / `pnpm lint:fix`                   | Lint (zero warnings)                                   |
| `pnpm format` / `pnpm format:check`             | Format with Prettier                                   |
| `pnpm typecheck`                                | Generate types and type check                          |
| `pnpm test` / `pnpm test:rls` / `pnpm test:e2e` | Unit, row-level security and end-to-end tests          |
| `pnpm governance:validate`                      | Check docs, specs, contracts and GitHub metadata agree |

## Project structure

| Path          | Contents                                                       |
| ------------- | -------------------------------------------------------------- |
| `app/`        | Routes and composition                                         |
| `features/`   | Feature UI and view logic                                      |
| `components/` | Shared UI                                                      |
| `lib/`        | Server logic: actions, fetchers, auth, authz, db, integrations |
| `prisma/`     | Schema, migrations, RLS and seed                               |
| `context/`    | Product and technical docs, and the build specs                |
| `.agents/`    | Agent contracts and execution records                          |

## Deployment

TODO: from `context/docs/tech-requirements.md#cicd-and-deployment`.

## License

See [LICENSE](LICENSE).
