---
title: Loaded Vibes Product Experience Design
artifact: design
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Product Experience Design

## Design principle

Loaded Vibes should feel simpler than the system it creates and more like configuring a product than answering a framework questionnaire.

## CLI create flow

```text
Loaded Vibes
Generate the SaaS you actually intend to build.

1. What are you building?
   B2B SaaS / Client portal / Platform / Bare golden app

2. What does it need?
   Team accounts / Billing / Connect / Admin / Marketing / Onboarding / Sample domain

3. Make it yours
   Product name / description / visual preset / shell / density

4. Review
   Show architecture summary, capabilities, routes/surfaces, design choices, and explicit exclusions.

5. Generate
   Materialize, personalize, install, initialize git, then show concise next actions.
```

## Express and Advanced

Express asks only high-leverage questions. Advanced exposes all currently supported recipe choices. A user can switch modes without changing the underlying model.

Do not ask whether the user wants TypeScript, Prisma, Clerk, Zod, fetchers, server actions, workflows, DTOs, or other fixed architecture choices.

## CLI behavior

Use `@clack/prompts` for interaction. Keep terminal output compact and visually legible. Do not dump internal planner details unless requested through a verbose/explain surface.

Useful review output:

```text
ACME

Product
  B2B SaaS
  Team accounts
  Subscription billing
  Admin

UI
  Obsidian preset
  Sidebar
  Comfortable density

Not included
  Stripe Connect
  Sample domain
```

## `add`

`loaded-vibes add <module>` reads the generation manifest and current recipe, resolves prerequisites, shows the intended change, applies the repository-owned module, updates provenance, and reports any user setup required.

Do not promise arbitrary upgrade merging.

## `doctor`

Doctor reports actionable readiness:

```text
✓ Node / package manager
✓ recipe + manifest
✓ Prisma generation prerequisites
✓ Clerk env shape
✗ Stripe webhook secret missing
  Add STRIPE_WEBHOOK_SECRET to .env.local
```

It should diagnose, not run a giant conformance campaign.

## `explain`

Explain answers "what did Loaded Vibes give me?" using the recipe and manifest: preset, modules, product capabilities, architecture summary, provider boundaries, and setup still owned by the user.

## Web configurator

Desktop primary layout:

```text
┌────────────────────────────┬────────────────────────────────┐
│ configuration              │ representative live preview    │
│ product shape              │ dashboard / onboarding         │
│ capabilities               │ settings / billing / marketing │
│ product identity           │ updates as recipe changes      │
│ visual controls            │                                │
│ [Review project]           │                                │
└────────────────────────────┴────────────────────────────────┘
```

The configurator uses the shared recipe core. It does not generate projects on the server initially. Final output is a copied CLI command and/or downloaded `loadedvibes.json`.

## Preview scope

Preview representative surfaces rather than attempting to render every possible generated route. Initial set:

- dashboard;
- onboarding;
- settings;
- billing;
- detail/workflow page;
- marketing home.

## Accessibility and responsiveness

CLI remains keyboard/no-TTY friendly. Web configurator must work responsively and preserve normal semantic/accessibility behavior from the app's design system.
