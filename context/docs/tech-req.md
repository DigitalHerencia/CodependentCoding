---
title: Loaded Vibes Technical Requirements
artifact: technical-requirements
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Technical Requirements

## Baseline

- Node 24.x
- pnpm 11.x workspace
- TypeScript ESM
- Next.js/React for `apps/web`
- Zod for recipe/runtime validation
- Vibes as upstream generated-app reference

## CLI/core dependencies

Prefer a small dependency surface and add a package only when it directly improves the generator experience.

Target capabilities/dependencies:

| Need                                                                     | Preferred tool                                                   |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| terminal UX                                                              | `@clack/prompts`                                                 |
| command routing                                                          | `citty` or the existing `commander` during incremental migration |
| recipe validation                                                        | `zod`                                                            |
| template/source acquisition when needed                                  | `giget`                                                          |
| package-manager detection/execution when multi-PM support is implemented | `nypm`                                                           |
| cross-platform paths                                                     | Node `path` or `pathe` where it reduces platform branching       |
| structured JS/TS config edits                                            | `magicast`                                                       |
| compatibility checks                                                     | `semver`                                                         |
| targeted file discovery                                                  | `tinyglobby`                                                     |
| subprocesses not covered by `nypm`                                       | existing `execa` is acceptable                                   |

Do not churn working code solely to swap dependencies. Adopt the preferred tool when the Issue needs the capability.

## Package topology

```text
apps/web
packages/cli
packages/core
packages/recipes
packages/schema
templates/golden
templates/modules
```

`packages/core` must be framework/UI independent so CLI and web consume the same recipe behavior.

## Recipe schema

Minimum conceptual shape:

```json
{
  "schemaVersion": 1,
  "name": "acme",
  "product": "b2b-saas",
  "modules": {
    "organizations": true,
    "billing": true,
    "stripeConnect": false,
    "admin": true,
    "marketing": true,
    "onboarding": true,
    "sampleDomain": "projects"
  },
  "design": {
    "theme": "obsidian",
    "radius": "medium",
    "density": "comfortable",
    "navigation": "sidebar",
    "mode": "system"
  }
}
```

Exact fields evolve through the recipe-core Issue. Unknown unsupported values should fail with useful messages.

## Template/module behavior

- the packaged golden template is self-contained;
- Vibes is the upstream reference for refresh work;
- modules are explicit overlays/contributions, not arbitrary plugins;
- module dependency resolution is deterministic;
- product identity/design changes use targeted known surfaces;
- the generator records enough provenance for `add` but does not own later arbitrary source changes.

## Web configurator

Use the same recipe schema/resolver as the CLI. Initial web app needs no database or auth. Recipe state may be encoded locally/in URL/downloaded file where practical.

## Default generation

Default create should not run the entire generated application's validation matrix. It may install dependencies and run narrowly necessary generation steps such as Prisma generation when required by the produced project. Broader checks belong to focused development/release work, `doctor`, or explicit user commands.

## Testing expectation

For implementation Issues, add or run only tests/checks needed to prove the changed behavior. Generator/package release work can use a broader generation smoke path when explicitly required.

Do not create tests merely to increase ceremony or duplicate lower-level confidence.
