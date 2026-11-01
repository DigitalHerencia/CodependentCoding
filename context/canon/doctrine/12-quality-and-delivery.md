---
title: Quality and Delivery
slug: quality-and-delivery
order: 12
summary: Evidence over claims, the test pyramid, targeted CI, preview-then-promote, the governance layers and how agents work inside the rails.
rules:
  [
    CC-AGENT-001,
    CC-AGENT-002,
    CC-AGENT-003,
    CC-CI-001,
    CC-CI-002,
    CC-CI-003,
    CC-GOV-001,
    CC-GOV-002,
    CC-GOV-003,
    CC-GOV-004,
    CC-TEST-001,
    CC-TEST-002,
    CC-TEST-003,
    CC-TEST-004,
  ]
---

# Quality and Delivery

## Evidence, not claims

Documented, implemented, tested, validated, working, shipped and finished are different claims. A green check proves only the property it checks. Rigor scales with consequence: tenant isolation, money, migrations and privileged configuration get representative boundary tests against real infrastructure; a copy change gets a format check.

The failure mode to avoid is **verification displacement** — attention moving from "does the system work?" to "does the machinery that proves the machinery pass?". Stop adding assurance when the next layer does not reduce a known risk.

## Tests

```text
tests/
├── unit/<slice>/<module>.test.ts          Vitest, pure: schemas, DTO mappers, workflows with fakes, utils
├── integration/<slice>/<module>.test.ts   Vitest + real Postgres (Neon branch or CI service): RLS, transactions, webhook idempotency
└── e2e/<slice>/<flow>.spec.ts             Playwright: public pages, sign-in redirect, one tenant route, security headers
```

> **CC-TEST-001** · `now` · review
> A new test fails at least once before it passes.

> **CC-TEST-002** · `now` · CI
> The RLS cross-tenant suite (`tests/integration/rls`) runs as `app_runtime` against real Postgres whenever `prisma/`, `lib/db/`, `lib/authz/` or RLS SQL changes, and on `main` before promotion.

> **CC-TEST-003** · `now` · review
> Tests cover real behavior. No snapshot tests of markup, no tests of the framework, no mocks of the database in integration tests.

> **CC-TEST-004** · `now` · `node --test eslint/*.test.mjs`
> Every doctrine lint rule has valid and invalid cases.

Playwright smoke uses the request fixture (no browser download) except for the one flow that needs a real browser.

## CI

> **CC-CI-001** · `now` · `.github/workflows/ci.yml`
> One workflow with a `changes` job. Docs-only changes run a format check and nothing else. Code changes run lint, typecheck, doctrine checks and the tests for the slices they touched. Shared code (`lib/authz`, `lib/db`, `lib/env`, `lib/integrations`, `prisma/`) triggers the full suite plus RLS.

> **CC-CI-002** · `now` · branch protection
> PR titles are Conventional Commits; squash-merge only; `Closes #N` links issues.

> **CC-CI-003** · `now` · branch protection
> Auto-merge is allowed only when CI is green, the reviewer agent passes, and the PR touches none of: `lib/auth`, `lib/authz`, `lib/db`, `prisma/`, `app/api/**/webhooks`, `lib/env`, `proxy.ts`. Those wait for the owner.

No blocking pre-commit hooks. The agent's Stop hook guards the agent's session hygiene, not your commits.

## Deploy

Neon, GitHub and Vercel integrations: every PR gets a preview deployment with its own Neon branch and test keys. `main` deploys to production after CI is green. Preview-then-promote holds even with zero users, because it is free and it is the habit that matters at the first user. Migrations to production are a deliberate step (Chapter 05).

## Governance layers

| Layer       | Location                                                           | Audience | Authority                          |
| ----------- | ------------------------------------------------------------------ | -------- | ---------------------------------- |
| Intent      | `context/docs/{prd,tech-requirements,architecture,auth,design}.md` | human    | highest for meaning                |
| Contracts   | `.claude/contracts/{application,design,validation}.yaml`           | machine  | compiled from intent               |
| Enforcement | `eslint/`, Prettier, tsconfig, `scripts/check-*.mjs`               | machine  | executable form of validation.yaml |
| Work        | `context/specs/` → GitHub issues, milestones, Project              | both     | what to do next                    |
| Execution   | `.claude/execution/{decisions,progress,handoff}.json`              | agent    | what happened; never architecture  |

> **CC-GOV-001** · `now` · `pnpm doctrine:check`
> A doctrine change updates this documentation, `validation.yaml` and the lint plugin in one PR. An ID in one and not the others fails CI.

> **CC-GOV-002** · `now` · review
> Exactly five intent docs per app. Specs are numbered, decomposed from the docs, and synced to issues.

> **CC-GOV-003** · `now` · `scripts/check-claude-md.mjs`
> `CLAUDE.md` is a router of at most 60 lines. It points; it never restates a rule.

> **CC-GOV-004** · `now` · review
> Every route has a mockup in `context/mockups/` naming the route, the shadcn components, palette, fonts and layout (padding, grid).

## Agents

> **CC-AGENT-001** · `now` · plugin skill
> Before writing code against a library, the agent reads that library's documentation for the **installed** version (Context7, or the vendor's docs). Old patterns in training data are the most common source of drift.

> **CC-AGENT-002** · `now` · plugin
> Agents classify before creating a file (Chapter 01), fix lint findings at the cause, never disable a rule, and report a check as passing only after running it.

> **CC-AGENT-003** · `now` · plugin
> Each app installs and authenticates the provider tooling it uses (Neon, Stripe, Clerk, Vercel skills, CLIs and MCP servers).

The Loaded Vibes plugin carries the doctrine as skills that **point** to this documentation and `validation.yaml`; the reviewer agent's checklist is Chapter 10's.
