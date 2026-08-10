---
title: Loaded Vibes Product Definition
artifact: product
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Product Definition

## Product

Loaded Vibes is an opinionated developer tool that turns a bounded technical project configuration into a complete white-label application built from one repository-owned Hipster Stack master template.

A concise product statement is:

> Generate the golden prototype. Start building the product.

Loaded Vibes is not a generic stack chooser and it is not a startup-feature wizard.

## Primary user

The primary user is a developer who already understands the modern TypeScript web stack and wants to stop rebuilding the same foundation, boundaries, routes, integrations, and project structure.

The product should assume familiarity with tools such as Next.js, Prisma, Clerk, Stripe, Postgres, shadcn/ui, GitHub, and Vercel. It should not force the user to re-decide architectural doctrine already encoded by Loaded Vibes.

## Product value

The success metric is the amount of repetitive project setup and foundational implementation the generated repository removes.

The configurator being attractive matters. The CLI being pleasant matters. The decisive payoff is:

> How much useful, correct application did the user receive before writing product-specific code?

## Product surfaces

1. **Master template** — the maximal white-label application source owned by this repository.
2. **Configuration contract** — the bounded project choices Loaded Vibes can actually honor.
3. **Core generator** — deterministic resolution, retain/remove ownership, transforms, materialization, and provenance.
4. **CLI** — primary execution surface.
5. **Web app** — developer-oriented landing page, visual configurator, and end-user docs.
6. **`loadedvibes.json`** — portable configuration handoff.
7. **Generated application** — the actual product value.

## Fixed foundation

The stack and application grammar are Loaded Vibes decisions rather than configuration questions.

The fixed foundation is the repository-supported implementation of:

- TypeScript;
- Next.js App Router;
- React Server Components by default;
- pnpm;
- Zod;
- Prisma;
- Neon/PostgreSQL;
- Clerk identity/session boundary;
- application-owned users, organizations, memberships, roles/capabilities, and authorization;
- tenant containment including RLS where the template implements it;
- Fetchers;
- Server Actions;
- Workflows;
- Transactions;
- Selects;
- DTO mappers;
- Integration Adapters;
- webhook processors;
- shadcn-compatible UI primitives and composed presentation;
- Vercel-oriented deployment.

Do not ask users to choose a different implementation of these within the current product.

## Configuration

Configuration should be technical, bounded, and real.

A choice belongs in the product only when the template and generator can correctly retain, remove, configure, or personalize its owned output.

Useful configuration categories include:

- project name/directory/package metadata;
- install and git-init behavior;
- optional integration surfaces;
- optional route groups and route surfaces;
- optional reusable product capabilities backed by owned code;
- product identity and bounded domain vocabulary;
- semantic visual direction.

Presets may remain as convenience defaults if useful, but they are not separate templates and they are not the center of the product.

## Non-goals

Loaded Vibes is not:

- a universal app generator;
- an arbitrary framework selector;
- a provider marketplace;
- a plugin marketplace;
- a hosted build/control plane;
- an account-based SaaS around the configurator;
- an enterprise policy/governance platform;
- a validation product;
- an autonomous arbitrary upgrade/merge engine;
- a replacement for product-specific implementation after generation.

## Relationship to other systems

```text
DevNotes
  owns Hipster Stack knowledge

Loaded Vibes
  owns deterministic production and the executable template

Generated project
  owns the product codebase produced for the user

Codependent Coding
  may guide adaptive product-specific development after generation
```

No external application repository is a template dependency.
