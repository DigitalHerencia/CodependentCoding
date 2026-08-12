---
title: Hipster Stack Configuration Model
artifact: configuration
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Configuration Model

## Principle

Configuration describes the application to compose. It does not ask the user to reinvent the engineering method.

Expose an editable property only when Hipster Stack can produce the corresponding repository correctly and deterministically.

## Shared contract

```text
CLI ───────────────┐
Web Builder ───────┼──> one runtime schema
config file ───────┘          │
                              ▼
                         normalize/resolve
                              │
                              ▼
                         generation plan
```

No interface gets hidden defaults, dependency rules, or conflicting semantics.

## Configuration categories

The target model is organized around the generated application:

- Project: directory/package/display identity, install, Git initialization.
- Preset: convenience defaults over the same model.
- Routes/presentation: supported route surfaces, navigation, semantic visual direction.
- Identity/access: supported authentication, tenancy, authorization, roles/capabilities/policies when the generator implements those choices.
- Data/persistence: supported database/ORM/tenant-containment choices when implemented.
- Integrations/capabilities: supported billing, payments, onboarding, admin, marketing, sample-domain, and other owned application surfaces.
- Engineering/delivery: supported tests, context/contracts, CI/deployment lifecycle options when deterministically composable.

Current schema/core support is narrower than this target. Do not expose future choices ahead of generator support.

## Property model

Use a small schema-driven vocabulary where appropriate: boolean, string, single-select, multi-select/collection, mapping/tree/rule. A property may also expose whether its value is default, preset, explicit, required, disabled, or conflicted.

Users configure application concepts. Generator-side ownership maps those concepts to files, dependencies, environment examples, transforms, and resources. Individual source files are not normal user-facing controls.

## Runtime contracts

Zod/runtime input validation belongs in schema concerns. Compile-time interfaces/types remain distinct. UI components consume trusted resolved values and do not reinterpret configuration authority.

## Honesty rule

No decorative toggles. If a selectable control cannot change real generated output, keep it read-only/hidden until the engine owns that behavior.
