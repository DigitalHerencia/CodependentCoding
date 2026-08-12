# Loaded Vibes Context

This directory tells Codex what Loaded Vibes is, which contracts control the repository, and what active work remains.

## Product definition

Loaded Vibes is an opinionated project initializer and deterministic software-production tool for modern TypeScript web applications built on the Hipster Stack and Loaded Vibes WebApp Architecture.

Its value is the generated repository: a polished white-label application that already contains the recurring architecture, integration boundaries, project structure, and implementation context the builder would otherwise recreate by hand.

The CLI is the primary execution surface. The web app presents the Product, browsable Libraries/building blocks, the stateless Builder, and canonical end-user Docs. `loadedvibes.json` is the reproducible configuration handoff.

## Current state

The one-template repository migration is complete. The active work is a bounded replacement of the existing website UI/UX using local mockups while preserving the working generator and shared configuration semantics.

```text
WORKING PRODUCT
packages/{cli,core,schema}
        +
template/
        +
docs/
        +
apps/web current UI

              ↓ LV-208..LV-210 only

TARGET WEB SURFACE
Product      /
Libraries    /libraries/*
Builder      /configure
Docs         /docs/*

same shared schema/core
same one-template generator
same CLI handoff
```

Do not reopen the completed generator migration during the UI refresh. Follow LV-208 through LV-210 in order and change non-web code only when a concrete existing contract requires it.

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
- local `context/mockups/` visual acceptance inputs for active web Issues

### Release and repository history

- `context/docs/repository-transition.md`
- `context/docs/release.md`

### Implementation roadmap

- `context/specs/README.md`
- completed `LV-201` through `LV-207`
- active `LV-208` through `LV-210`

### Machine-readable boundaries

- `.agents/contracts/product.yaml`
- `.agents/contracts/architecture.yaml`
- `.agents/contracts/transition.yaml`

## Engineering doctrine

DevNotes owns canonical Hipster Stack engineering doctrine. The Codependent Coding knowledge system formalizes the same Loaded Vibes WebApp Architecture, layer contracts, technology ownership, and agent-execution method used to build applications.

The applicable grammar is summarized as:

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Transactions preserve invariants. Webhooks reconcile external truth.

For the mostly static Loaded Vibes website surfaces, apply that doctrine proportionally. Use thin App Router routes, server-first presentation composition, and the existing client-side Builder only where local interaction is required. Do not manufacture fetchers/actions/workflows for static content merely to make the directory tree look architectural.

Loaded Vibes owns the executable template and repository-local product behavior. Codependent Coding and DevNotes are doctrine/knowledge authorities, not runtime dependencies.

## Working rule

The active roadmap exists to make the real product look and operate like the approved mockups with the fewest correct edits. Governance should reduce ambiguity and token use, not create a second project beside the product.
