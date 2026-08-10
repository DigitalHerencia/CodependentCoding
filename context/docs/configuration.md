---
title: Loaded Vibes Configuration Model
artifact: configuration
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Configuration Model

## Principle

Loaded Vibes does not ask users to re-decide the fixed Hipster Stack.

Configuration exists for choices that materially change the generated repository and that the generator can honor deterministically.

## Shared contract

The CLI, web configurator, and `loadedvibes.json` use one schema and one normalization path.

```text
CLI ───────────────┐
Web ───────────────┼──> schema
loadedvibes.json ──┘      │
                          ▼
                      normalize
                          │
                          ▼
                  resolve dependencies
                          │
                          ▼
                   generation plan
```

No surface gets its own hidden defaults or capability semantics.

## Recommended configuration categories

### Project
- directory;
- package name;
- display/product name;
- description;
- install dependencies;
- initialize Git.

### Product identity
- brand/display name;
- description;
- bounded domain vocabulary when supported.

### Optional application surfaces

Examples may include:
- marketing;
- onboarding;
- admin;
- billing;
- Stripe Connect;
- invitations/team management;
- sample domain;
- other real route groups present in the master template.

A surface is configurable only when generation can retain/remove it without leaving knowingly broken imports, routes, package configuration, or setup claims.

### Integrations

Expose provider integration choices only when the template has a real supported adapter/boundary and the generator knows the files/configuration it owns.

### Visual direction

Keep this bounded and semantic:
- color family;
- radius;
- density;
- navigation treatment;
- typography treatment;
- supported appearance preference where appropriate for generated apps.

Loaded Vibes' own website is dark-only. That does not force generated applications to be dark-only.

## Presets

Presets are optional convenience defaults over the same configuration model.

They are not:
- separate templates;
- separate architectures;
- a reason to maintain a separate `packages/recipes` package.

If existing presets remain useful, move their data into the schema/core boundary during migration.

## Configuration honesty

Do not show a toggle because it sounds useful.

Every selectable option must map to one of:
- a real retain/remove ownership decision;
- a supported structured transform;
- a supported project-lifecycle choice.

If not, hide it or label it as fixed/non-configurable until implementation exists.
