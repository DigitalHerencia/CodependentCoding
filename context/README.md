# Loaded Vibes Context

This directory tells Codex what Loaded Vibes is, what the repository is becoming, and how to finish the current migration without losing the working generator.

## Product definition

Loaded Vibes is an opinionated project initializer and deterministic software-production tool for modern TypeScript web applications built on the Hipster Stack.

Its value is the generated repository: a polished, white-label application that already contains the recurring architecture, integration boundaries, project structure, and implementation context the builder would otherwise recreate by hand.

The CLI is the primary execution surface. The web app is a developer-oriented landing page, visual configuration workbench, and documentation surface. `loadedvibes.json` is the reproducible configuration handoff.

## Current transition

The repository owns its maximal application foundation at `template/` and has no external template authority. Capability metadata remains temporarily under `templates/modules`, but no duplicate application source remains there. The remaining cleanup is structural and product-facing:

```text
CURRENT MIGRATION SHAPE
apps/web
packages/{cli,core,schema}
template/ + templates/modules metadata
legacy product-preset/module concepts

              ↓

TARGET SHAPE
apps/web
packages/{cli,core,schema}
template/
docs/
one technical configuration model
one deterministic generator
one CLI
```

Do not throw away working implementation merely to reach the target tree. Follow the active specs in order so ownership moves before old structures disappear.

## Source map

### Product and architecture

- `context/docs/product.md`
- `context/docs/architecture.md`
- `context/docs/configuration.md`
- `context/docs/template.md`
- `context/docs/generator-cli.md`

### Product surfaces

- `context/docs/web.md`
- `context/docs/documentation.md`

### Migration and shipping

- `context/docs/repository-transition.md`
- `context/docs/release.md`

### Implementation roadmap

- `context/specs/README.md`
- `context/specs/LV-201-*.md` through `LV-207-*.md`

### Machine-readable boundaries

- `.agents/contracts/product.yaml`
- `.agents/contracts/architecture.yaml`
- `.agents/contracts/transition.yaml`

## External authority

DevNotes owns canonical Hipster Stack engineering doctrine, including the architectural grammar summarized as:

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions receive mutations. Schemas validate. Workflows coordinate use cases. Authorization decides. Transactions preserve database invariants. Integration adapters own provider mechanics. Webhooks reconcile external truth.

Loaded Vibes owns the executable template that embodies that doctrine.

Codependent Coding is a downstream adaptive implementation system. It is not part of Loaded Vibes generation.

## Working rule

The roadmap exists to finish and ship a useful generator/CLI/template. Governance should reduce ambiguity and repetitive work, not create a second project beside the product.
