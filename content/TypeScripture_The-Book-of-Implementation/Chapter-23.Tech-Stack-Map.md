# Chapter 23: Tech Stack Map

**The Book of Implementation™**

## Repository integration

| Technology | Primary surface |
|---|---|
| TypeScript | `tsconfig.json`, source |
| Next.js | `app/`, `next.config.*` |
| React | Features/Blocks/Primitives |
| Neon/Postgres | environment + DB runtime |
| Prisma | `prisma/`, approved DB modules |
| Clerk | auth boundary + verified webhook |
| Stripe | integrations + webhook processors |
| Tailwind/shadcn | presentation primitives/blocks |
| Zod | `schemas/` |
| Vitest | unit/integration/contract tests |
| Playwright | browser/E2E tests |
| ESLint/Prettier | root configs |
| pnpm | `package.json`, lockfile |
| GitHub Actions | `.github/workflows/` |
| Vercel | deployment configuration |

## Root configuration

- Typical root files: `package.json`, lockfile, `tsconfig.json`, `next.config.*`, `eslint.config.*`, Prettier config, `postcss.config.*`, `components.json`, `.env.example`. Exact versions are product-specific and pinned there.

## Boundary rule

- Framework/provider convenience never overrides the ownership model. Prisma access stays inside approved data boundaries; provider SDKs stay inside integrations; browser-exposed environment variables require deliberate allowlisting.
