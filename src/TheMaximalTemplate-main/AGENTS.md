# The Maximal Template™ — Repository Governance Map

## Purpose

This file is the repository-level governance and epistemology entrypoint for **The Maximal Template™**.

It does **not** define a universal coding workflow. Repository-, language-, and framework-agnostic execution behavior is supplied by the user's global `AGENTS.md`. This file only tells an agent what this repository is, where authoritative intent lives, how truth is ranked, and which product-specific boundaries must not drift.

The Maximal Template™ is the canonical superset implementation used by Loaded Vibes™ / the Hipster Stack™ generator. It is one coherent maximal application, not a collection of independent starter apps.

## Governance map

Human intent lives in `context/`.

```text
context/
├── docs/
│   ├── prd.md
│   ├── tech-requirements.md
│   ├── architecture.md
│   ├── design.md
│   └── auth.md
└── specs/
    ├── 00.architectural-contract.md
    ├── 01.route-topology-public-demo.md
    ├── 02.design-system.md
    ├── 03.block-library.md
    ├── 04.crm-golden-vertical-slice.md
    ├── 05.application-library-normalization.md
    ├── 06.maximal-template-explorer.md
    └── 07.provider-integrations.md
```

Machine-readable interpretations and execution state live in `.agents/`.

```text
.agents/
├── contracts/
│   ├── product.yaml
│   ├── design.yaml
│   └── validation.yaml
└── execution/
    ├── decisions.json
    ├── progress.json
    └── handoff.json
```

## Epistemology

Truth is fact-specific.

- **Current explicit user instruction** owns present human intent.
- **`context/docs/*.md`** owns durable product-specific human intent and architectural explanation.
- **`context/specs/*.md`** owns approved scoped implementation intent and objective acceptance criteria.
- **`.agents/contracts/*.yaml`** is a deterministic machine-readable interpretation of stable human intent. It never silently overrides the Markdown that produced it.
- **`.agents/execution/*.json`** records mutable execution state and evidence. It does not create product or architecture requirements.
- **Implementation, tests, repository state, and deployed behavior** are evidence of what exists, not automatic proof of what was intended.
- **Implementation judgment** may fill only narrow gaps that do not change product semantics, architecture, security, or accepted scope.

### Source precedence

When sources conflict, use this order:

1. current explicit user instruction;
2. `context/docs/*.md`;
3. the active `context/specs/*.md`;
4. `.agents/contracts/*.yaml`;
5. accepted entries in `.agents/execution/decisions.json` that do not conflict with higher authority;
6. observed implementation and runtime evidence;
7. implementation judgment.

Do not keep two incompatible rules canonical. Resolve the conflict or stop before mutation.

## Product-specific specialization

The reusable Codependent Coding™ Knowledge System supplies the governance model and general engineering doctrine. This repository intentionally specializes that doctrine.

For this repository, the following rules are canonical even if a generic Loaded Vibes reference shows a different optional structure:

- public static content belongs to `app/(public)`, not a marketing route group;
- `marketing` is the marketing-automation business domain;
- normal presentation flows `components/ui → components/blocks → features → app`;
- **React Hook Form feature forms are the explicit exception**: form features compose UI primitives directly and do not create form blocks;
- blocks are grouped by presentation category and remain pure UI;
- all persisted application reads use `lib/fetchers/`;
- ordinary authenticated/authorized CRUD writes use `lib/actions/`;
- `lib/db/` owns the Prisma/Neon runtime plus selects, DTOs, and transaction helpers;
- Clerk lives under `lib/auth`;
- RBAC/ABAC and resource policy live under `lib/authz`;
- provider-specific behavior lives under `lib/integrations/{provider}`, except Clerk, Neon, and Prisma;
- webhook HTTP lifecycle lives under `app/api/{provider}/.../route.ts`;
- remaining business logic lives in shallow `lib/workflows/{domain}/`;
- Prisma schema, migrations, generation, and seed lifecycle remain root `prisma/`;
- the public demo is browseable signed out; public visibility never grants protected mutation authority;
- the visual system is dark-only, mature neo-brutalist, technical, restrained, and not cartoonish;
- application-domain vocabulary is `crm`, `projects`, `support`, `marketing`, `invoicing`, `social`, `ai`, `portal`, `admin`, `user`, `common`.

## Active build order

The active repair/build sequence is the numbered spec set in `context/specs/`.

Do not replace it with a generic scaffolding/auth/database sequence.

1. `00.architectural-contract.md`
2. `01.route-topology-public-demo.md`
3. `02.design-system.md`
4. `03.block-library.md`
5. `04.crm-golden-vertical-slice.md`
6. `05.application-library-normalization.md`
7. `06.maximal-template-explorer.md`
8. `07.provider-integrations.md`

Each spec is intended to become one GitHub Issue and to provide enough scope and acceptance detail that Codex does not have to redesign the system.

## Stop conditions

Stop and report the exact conflict before editing when:

- a lower-authority file contradicts current user intent or `context/docs`;
- a requested implementation would make public-demo visibility equivalent to mutation permission;
- an implementation would move persisted reads outside fetchers or CRUD writes outside actions without an explicit special boundary;
- a proposed form-block abstraction would contradict the React Hook Form feature exception;
- a provider or webhook change would move provider truth or HTTP lifecycle into the wrong layer;
- a route-group change would alter public URLs unintentionally;
- a change weakens authz, tenant scope, RLS, webhook verification, idempotency, or provider-secret handling;
- a destructive migration or live provider mutation is required without explicit approval.

## Evidence rule

Never report an unexecuted check as passing.

Use these evidence labels consistently:

- `executed` — the command/review actually ran;
- `skipped` — known but deliberately not run;
- `blocked` — could not run because a prerequisite was unresolved;
- `inferred` — conclusion from inspection or reasoning rather than execution.
