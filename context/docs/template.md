---
title: Loaded Vibes Master Template
artifact: template
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Master Template

## Definition

Loaded Vibes owns one maximal white-label application template.

The template is the best reusable version of the application architecture this system repeatedly builds. It contains the supported foundation, route surfaces, integration boundaries, reusable application infrastructure, presentation, and scoped agent context.

The template is not an example project and it is not a pile of independent templates.

## Authority

- Loaded Vibes owns the executable template.
- DevNotes owns the Hipster Stack engineering doctrine used to maintain it.
- `DigitalHerencia/Vibes` is not an upstream, reference, synchronization source, provenance source, or runtime dependency.
- Codependent Coding is not required to generate the template.

## Target location

```text
template/
```

The target is singular by design.

The current `templates/golden` directory is the migration source for the repository-owned application. The current `templates/modules` directories are migration sources that must be merged into the maximal template before their duplicated ownership is removed.

## Maximal means supported, not imaginary

The template may contain optional surfaces only when they have real repository-owned implementation.

Do not add placeholder architecture simply because a future generator could conceivably support it.

If a provider or route surface is only proposed and not actually implemented, it does not become configurable merely because governance names it.

## Fixed application foundation

The template should keep the canonical application grammar and core identity/tenancy/security model intact.

The fixed foundation includes the supported implementation of:
- application shell and root route behavior;
- authentication boundary;
- tenant shell;
- local application identity;
- organizations and memberships;
- RBAC/capability authorization;
- database boundary and tenant containment;
- Server Action, Fetcher, Workflow, Transaction, Select, DTO, Integration Adapter, and Webhook patterns;
- shared presentation primitives;
- configuration/environment boundaries.

## Optional ownership

Optional material may include real supported integration or route/capability surfaces such as billing, Stripe Connect, marketing, onboarding, admin, sample domain, uploads/media, inference, or mapping only to the extent the template actually contains working source for them.

The generator later decides whether to retain or remove them.

## Scoped agent context

Agent guidance belongs near stable architectural boundaries when it materially helps future implementation.

Use scoped `AGENTS.md` files for durable route/layer guidance. Do not litter runtime components with explanatory architecture prose that belongs in context.

Generated UI should look like a product, not like documentation about the stack.

## Migration rule

Move first, simplify second.

Do not simultaneously:
- relocate the template;
- redesign its internal application architecture;
- rewrite optional capabilities;
- redesign the generator;
- redesign the website.

The specs sequence these concerns so the current working implementation remains recoverable while the repository converges.
