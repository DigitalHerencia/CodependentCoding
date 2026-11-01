---
title: Preface
slug: preface
order: 0
summary: What the doctrine is, how to read it, and how a rule is written, tiered and enforced.
---

# Preface

The Codependent Coding Doctrine is the engineering standard for every application built from the Maximal Template and for the factory that builds them. It covers one stack — Next.js 16 App Router, React 19, TypeScript, Tailwind v4 and shadcn/ui, Prisma 7 on Neon Postgres, Clerk, Vercel — and it is opinionated about all of it. It is written so that one person can hand-write production code from it, review agent-written code against it, and defend every rule in it to a senior engineer.

## The sentence

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authentication identifies. Authorization decides. Workflows compose. Transactions keep invariants. Integrations own providers. Webhooks reconcile. Row-level security contains.

Every chapter is one clause of that sentence made precise.

## What makes this doctrine different

Most architecture guides describe layers. This one makes them **executable** and **proportional**:

- **Executable.** Each mechanizable rule has an ID (`CC-READ-002`), an ESLint rule or check script, and a failing example in the rule's test file. A lint finding prints the ID; the ID links to the paragraph that justifies it. If a rule cannot be checked by a machine, it says so and names the reviewer checklist that covers it.
- **Proportional.** Every rule carries a tier. Only `now` is enforced by default. A solo developer with zero users does not pay for controls that protect a business with ten thousand.
- **Ownership is computed.** A file's module owner is a function of its path, so the generator, the linter and the reviewer agree on what belongs to whom without a catalog that can drift.
- **Defense in depth is layered on purpose.** The application authorizes, the query is scoped, and Postgres row-level security contains whatever the first two miss. Each layer is written assuming the others failed.

## Normative language

The words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** mean what RFC 2119 says they mean. A MUST is enforced or reviewed; a SHOULD needs a written reason to skip; a MAY is permission.

## Tiers

| Tier    | Meaning                                                                        | Enforced                    |
| ------- | ------------------------------------------------------------------------------ | --------------------------- |
| `now`   | Applies from the first commit. Costs nothing a solo developer cannot afford.   | CI and lint, always         |
| `users` | Required before the first real user signs in.                                  | Release checklist (`/ship`) |
| `scale` | Required before meaningful traffic, revenue, or EU/California users at volume. | Compliance review           |

## How a rule is written

```text
CC-<AREA>-<NNN>  tier  enforcement
Statement in one sentence.
Why, in one or two sentences, when the reason is not obvious.
```

Example:

> _CC-TX-002_ · `now` · `codependent/no-transaction-network`
> Transactions MUST NOT perform network I/O.
> A provider call inside a database transaction holds row locks and a pooled connection for the length of someone else's latency, and a provider success cannot be rolled back when the transaction later fails.

The full list is in [Appendix A — Rule index](/doctrine/rules).

## Reading order

| If you are         | Read                                                             |
| ------------------ | ---------------------------------------------------------------- |
| Starting a new app | 01 Model → 02 Foundation → 06 Identity → Appendix C Golden slice |
| Writing a read     | 07 Server operations §Fetchers → 05 Data §Selects and DTOs       |
| Writing a mutation | 07 §Actions → 07 §Workflows → 05 §Transactions                   |
| Adding a provider  | 08 Integrations                                                  |
| Reviewing a PR     | Appendix A, then the chapter of every rule ID the linter printed |

## Sources of truth

| Fact                  | Authority                                   | Never restated in                        |
| --------------------- | ------------------------------------------- | ---------------------------------------- |
| A rule's meaning      | This doctrine                               | CLAUDE.md, skills, comments              |
| A rule's machine form | `.claude/contracts/validation.yaml`         | ESLint messages (they print the ID only) |
| A rule's enforcement  | `template/eslint/doctrine-map.mjs` + plugin | —                                        |
| Roles                 | Prisma `MembershipRole` enum                | constants, components, hand-typed Zod    |
| Module ownership      | File path + `hipster.modules.json`          | any catalog                              |
| What happened         | `.claude/execution/*.json`                  | docs                                     |

`pnpm doctrine:check` fails when a rule ID exists in one of the first three rows and not the others.

## Hard rule for the owner

Nothing ships that the owner does not understand. Every golden pattern in this doctrine is written to be read line by line; every amendment to a previously locked decision is recorded with its reason in the reconciliation ledger.
