# Hipster Stack™ Technology Map

| Technology | Owns | MUST NOT own | Integration and proof |
|---|---|---|---|
| TypeScript | strict compile-time interfaces and exhaustive handling | runtime input trust | strict config; no `any`/unsafe casts; typecheck gate |
| Next.js App Router | routes, RSC execution, Server Actions, Route Handlers, metadata, cache/navigation effects | domain policy, direct persistence/provider mechanics | thin `app/`; build and route tests |
| React | server-first component composition, Suspense, deliberate client islands | protected data authority | RSC default; accessibility/component tests |
| Neon Postgres | durable application state, constraints, transactions, RLS | provider payment/identity truth | pooled restricted runtime; direct migration role; real DB tests |
| Prisma ORM | typed approved data access, schema/migrations/client generation | domain DTOs above data layer, RLS authorization replacement | explicit selects; generated types contained; schema/build tests |
| Clerk | sign-in/up, sessions, authentication, external identity | tenant membership, RBAC, billing, workflow state | server auth adapter; verified idempotent webhooks; auth E2E |
| Stripe Billing | provider customer/subscription/payment truth | product entitlement policy or tenant authorization | tenant-owned billing, server-derived IDs/URLs, idempotency, webhook normalization |
| Stripe Connect | optional connected-account/payment-rail mechanics | subscription billing or product marketplace ontology | separate module, account scope, money/currency, readiness/recovery tests |
| Tailwind CSS 4 | mobile-first utility composition and semantic token consumption | business logic | canonical responsive breakpoints/container queries where appropriate; visual/a11y review |
| shadcn/ui + Radix | owned accessible UI primitives | protected reads, workflows, server actions in catalog fixtures | local source ownership; keyboard and semantics tests |
| Zod | runtime validation and typed parsing at trust boundaries | authorization or DB constraints | shared schemas; invalid-input tests |
| React Hook Form | complex client-form state and accessible interaction | authoritative validation or mutation | Zod resolver where useful; Server Action result mapping |
| Vitest | unit, focused integration, contract tests | proof of real DB/provider behavior when mocked | deterministic tests; coverage interpreted by risk |
| Playwright | critical browser workflows, responsive/keyboard behavior | complete DB isolation proof | representative desktop/mobile flows; trace/screenshots on failure |
| ESLint flat config | static code/import/file-boundary rules | runtime truth | current compatible plugins; CI lint gate |
| Prettier | deterministic formatting | semantic correctness | format-check gate |
| pnpm | reproducible dependency/install/script surface | architectural decisions | pinned version, frozen lockfile, dependency review |
| GitHub | version history, issues, PRs, review, release coordination | runtime application truth | branch protection, minimal Actions permissions, secret scanning |
| GitHub Actions | repeatable CI orchestration | duplicate definition of repository gates | invokes canonical scripts; least-privilege tokens |
| Vercel | preview/production hosting and deployment integration | domain architecture | isolated environments, validated vars, build/deploy/smoke evidence |

## Canonical use rules

Technologies are subordinate to architecture. Provider-native concepts are translated at adapters. Concrete products MUST pin compatible versions and record upgrades. A technology MAY be omitted when its owned capability is not required, provided the omission does not weaken a mandatory invariant. New technologies require a decision identifying the missing capability, ownership, boundary, operational burden, security impact, validation, and removal path.

## Non-canonical use

Direct Prisma in routes/components; provider SDKs in actions/components; Clerk metadata as product role truth; client-created Stripe prices/customers/return URLs; public environment exposure by naming accident; Tailwind arbitrary values replacing semantic tokens without reason; copied shadcn prototypes containing product logic; mocked tests claimed as RLS/concurrency proof; CI scripts drifting from package scripts; or deploying before migrations and smoke checks.
