---
title: Loaded Vibes Product Requirements
artifact: prd
status: approved-governance
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Product Requirements

## 1. Product definition

Loaded Vibes is an opinionated SaaS project generator and interactive CLI initializer.

It owns the deterministic starting state of future SaaS products by producing a complete, white-label, production-oriented golden prototype implementing the Loaded Vibes WebApp Architecture with the Hipster Stack.

Loaded Vibes is not a blank scaffold, generic boilerplate, stack selector, or architecture wizard.

**Vibes supplies the current golden template evidence. LoadedVibes supplies the permanent generator product identity.**

## 2. Problem

Rebuilding the same application kernel for every product wastes time and creates architectural drift. Coding agents should not repeatedly decide where persistence is allowed, how authentication and local authorization interact, how tenancy/RLS work, how providers and webhooks are isolated, or which validation gates establish an acceptable starting state.

Loaded Vibes removes that setup variability.

## 3. Primary users

- **Product builder:** creates a new SaaS product and expects a runnable governed starting repository.
- **Coding agent:** receives predictable topology, context, contracts, tests, and extension points.
- **Maintainer:** updates generator/template while preventing drift and unsupported combinations.

## 4. Primary outcome

One create-project command produces a repository that:

- contains the canonical SaaS platform kernel;
- contains no template-maintenance/workbench junk;
- applies the requested safe project identity;
- installs reproducibly;
- generates required framework/Prisma artifacts;
- passes the applicable credential-free acceptance gate;
- contains governance immediately usable by Codex and Codependent Coding.

## 5. Canonical creation flow

```text
target + supported preferences
        ↓
Loaded Vibes CLI
        ↓
normalized versioned configuration
        ↓
destination preflight
        ↓
deterministic generation plan
        ↓
canonical template materialization
        ↓
approved transforms / module closure
        ↓
install + git initialization
        ↓
generated-project validation
        ↓
success report + handoff
```

## 6. V1 command surface

Canonical package and bin: `create-loaded-vibes`.

```text
pnpm dlx create-loaded-vibes@latest <project-directory>
```

Required V1 options:

- target directory;
- project/package name;
- `--yes`;
- `--config <path>`;
- `--no-git`;
- `--skip-install`;
- `--dry-run`;
- `--help`;
- `--version`.

V1 supports pnpm as the generated-project package manager. Multiple package managers are not a V1 product goal.

## 7. Fixed invariants

Normal project choices must not disable canonical architecture/security properties.

Generated output preserves, where canonical doctrine requires them:

- TypeScript;
- Next.js App Router;
- React Server Components by default;
- Neon/PostgreSQL;
- Prisma;
- Clerk authentication;
- local `User`, `Organization`, and `Membership` state;
- custom RBAC and resource/workflow authorization;
- tenant containment and PostgreSQL RLS;
- Stripe integration boundaries;
- Zod runtime validation;
- Tailwind CSS;
- shadcn-compatible primitives;
- canonical reads, actions, workflows, transactions, integrations, and webhooks;
- route/feature/presentation separation;
- project context and machine contracts;
- formatting, linting, type checking, tests, architecture/contract validation, CI, and production build;
- Vercel-oriented deployment support.

## 8. Supported variability

V1 may vary only product-level concerns that do not weaken fixed invariants:

- project/package identity;
- destination;
- approved design tokens/presets when explicitly supported;
- explicitly contracted optional capabilities;
- Git initialization;
- dependency installation.

A field does not become supported merely because it can be represented in configuration.

## 9. Presets and modules

V1 ships one canonical `standard` preset.

Do not build an arbitrary plugin system.

Optional modules are added only through explicit reviewed contracts. Stripe Connect is the preferred first proof candidate if current template evidence still supports clean separation. Inclusion and exclusion must both preserve baseline validation.

## 10. Generated repository contract

Every accepted output includes:

- runnable application source;
- canonical package/tool configuration;
- safe environment examples and typed config;
- Prisma schema/migrations/generation setup;
- human-readable governance;
- machine-readable contracts;
- root `AGENTS.md`;
- validation scripts;
- tests and GitHub CI;
- stable generation provenance identifying generator/template revision and supported configuration.

Provenance must not introduce volatile timestamps into deterministic canonical output.

## 11. Validation outcome

A generated repository is **accepted** only when all required credential-free gates have actually executed successfully.

If `--skip-install` is used, generation may complete but must be reported as **generated, not acceptance-validated**, with exact remaining commands.

## 12. Error behavior

The CLI must:

- reject unsafe/invalid project names;
- reject non-empty destinations in V1;
- reject invalid/unsupported config before mutation;
- write through a staging workflow;
- report failed phase and safe remediation;
- clean run-owned temporary output after failure;
- never claim success after a failed required gate.

## 13. Security and privacy

V1 does not request, collect, write, log, or transmit provider credentials.

It does not automatically create Neon, Clerk, Stripe, GitHub, or Vercel resources and does not deploy the generated project.

Generated output contains safe examples/setup guidance only.

## 14. Success measures

V1 succeeds when:

1. identical supported configuration against the same generator/template revision produces equivalent output;
2. fresh project creation works on supported Windows/PowerShell and POSIX environments;
3. default output installs and passes its credential-free CI gate;
4. the packed CLI behaves like workspace execution;
5. generated output is immediately navigable by Codex/Codependent Coding without architecture rediscovery;
6. every canonical Vibes artifact has an intentional successor/disposition.

## 15. Non-goals

- arbitrary technology selection;
- multiple package managers in V1;
- arbitrary third-party plugins;
- generic code generation unrelated to the canonical SaaS;
- automatic upgrades of modified generated repositories;
- automatic provider provisioning;
- automatic production deployment;
- product-specific MVP feature implementation;
- weakening architecture/security for configurability.

## 16. Source basis

Primary basis:

- DevNotes Loaded Vibes project definition, Vibes audit, and generator roadmap;
- Codependent Coding Knowledge System architecture/governance/validation doctrine;
- current `DigitalHerencia/Vibes` implementation;
- current create-project patterns from create-next-app, create-t3-app, create-vite, create-turbo, shadcn CLI;
- current Codex `AGENTS.md` behavior and repository-governance guidance.

Comparative tools inform ergonomics. They do not define Loaded Vibes scope.
