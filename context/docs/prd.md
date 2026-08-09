---
title: Loaded Vibes Product Requirements
artifact: prd
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Product Requirements

## Product

Loaded Vibes is an opinionated SaaS generator that turns a small amount of product intent into a polished, useful, correctly shaped starting application.

Its primary promise is not "we installed Next.js." Its promise is:

> Start with an application that already looks and behaves like the product you meant to build, while inheriting the canonical Hipster Stack baseline encoded by Loaded Vibes.

## Primary outcome

A user can describe or select the kind of SaaS they are building, choose meaningful capabilities and visual direction, review what will be generated, and receive a runnable project without repeatedly rebuilding auth, tenancy, billing, application shell, provider boundaries, forms, states, and project structure.

## Product surfaces

1. **Interactive CLI** — primary execution surface.
2. **Web configurator** — stateless visual configuration and live-preview surface.
3. **`loadedvibes.json`** — versioned reproducible recipe shared by CLI and web.
4. **Generated application** — the actual product value.

## Setup modes

### Express

Ask only high-leverage product questions and resolve the rest from strong defaults.

### Advanced

Expose supported capability and design choices without exposing fixed architecture internals.

Both modes produce the same normalized recipe.

## Product presets

Initial presets:

- `b2b-saas`
- `client-portal`
- `platform-marketplace`
- `bare-golden-app`

Presets establish useful defaults, not separate generator implementations.

## Capabilities

The initial capability model should support:

- organizations / team accounts;
- memberships and invitations;
- local RBAC;
- subscription billing;
- optional Stripe Connect/platform payments;
- onboarding;
- admin surface;
- marketing site;
- sample domain;
- generated governance/context.

Selecting a capability automatically resolves required prerequisites.

## Design personalization

The generator should make the starting application feel owned by the user. Supported recipe fields should include product identity plus a bounded design system such as theme preset, color family, radius, density, navigation shell, and light/dark/system preference where the template supports it.

Personalization should flow through semantic tokens and known content/config surfaces rather than blind replacement.

## CLI commands

Target command surface:

```text
loaded-vibes create [directory]
loaded-vibes add <module>
loaded-vibes doctor
loaded-vibes explain
loaded-vibes preset validate <file>
loaded-vibes preset print
loaded-vibes version
```

Package/bin naming may transition from the current `create-loaded-vibes` implementation without breaking the active create flow unnecessarily.

## Web configurator

The web experience should be a fast, stateless product configurator:

```text
choose product shape
→ choose capabilities
→ make it yours
→ preview representative generated-app surfaces
→ review build
→ copy CLI command or download loadedvibes.json
```

No Loaded Vibes account system, hosted project database, billing system, or remote build infrastructure is required for the initial configurator.

## Post-init value

- `add` lets users start smaller and add supported capability packs later.
- `doctor` explains actionable local/provider configuration problems.
- `explain` summarizes what the generated project contains and how it is shaped.
- `.loadedvibes/manifest.json` or equivalent records generator/template/recipe/module provenance needed for safe future module additions.

## Non-goals

- universal app generation;
- arbitrary framework/provider selection;
- enterprise policy administration;
- plugin marketplace;
- hosted developer control plane;
- proprietary deployment orchestration;
- user accounts for the configurator;
- mandatory telemetry;
- automatic upgrade/merge engine for arbitrarily modified generated projects;
- validation theater unrelated to user-visible correctness.

## Success

Loaded Vibes succeeds when a builder can get from idea to a recognizable, usable SaaS starting point quickly and can understand what was generated without rediscovering the architecture.
