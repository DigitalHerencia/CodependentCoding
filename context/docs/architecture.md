---
title: Loaded Vibes Generator Architecture
artifact: architecture
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Generator Architecture

## Core architecture

Loaded Vibes is a recipe compiler for SaaS projects.

```text
CLI ───────────────┐
Web Configurator ──┼─> recipe schema / normalization
loadedvibes.json ──┘             ↓
                         preset resolution
                               ↓
                        capability graph
                               ↓
                         generation plan
                               ↓
             Vibes-derived base + module overlays
                               ↓
                 structured personalization
                               ↓
                     generated application
                               ↓
                        concise handoff
```

## Repository target

The shared recipe core must be reusable by CLI and web. A pnpm workspace is justified by that real boundary.

```text
/
├─ apps/
│  └─ web/                    # marketing + configurator + preview
├─ packages/
│  ├─ cli/                    # terminal UX and command adapters
│  ├─ core/                   # recipe, resolver, planner, generation
│  ├─ recipes/                # product presets
│  └─ schema/                 # JSON schema / shared recipe artifacts
├─ templates/
│  ├─ golden/                 # packaged Vibes-derived base
│  └─ modules/                # explicit capability overlays
├─ tests/                     # focused generator/CLI tests
├─ context/
├─ .agents/
└─ AGENTS.md
```

Codex may migrate toward this topology incrementally. Do not rewrite working code solely to make the tree pretty.

## Recipe core

The core owns:

- versioned recipe schema;
- defaults and normalization;
- product presets;
- module/capability registry;
- dependency/conflict resolution;
- generation plan;
- materialization;
- structured transforms;
- generation manifest;
- human-readable result summary.

The core must not depend on terminal UI or Next.js web UI.

## Product preset model

A preset is a named set of recipe defaults. It is not a forked template.

```text
preset
  + explicit user overrides
  → normalized recipe
  → resolved capabilities
```

## Capability/module model

Modules are repository-owned capability packs. A module may contribute files, dependencies, environment examples, Prisma/provider pieces, docs, routes, and transforms.

A module declares only what is required to compose it safely:

```text
id
requires
conflicts
files/overlays
package changes
structured transforms
generated setup notes
```

Do not build a third-party plugin framework in v1.

## Vibes relationship

Vibes remains the upstream application reference and evidence for the generated SaaS baseline. Loaded Vibes packages a self-contained snapshot/derivative so normal CLI execution does not depend on live GitHub availability.

Optional Vibes material such as Stripe Connect should become a real module only where its boundaries are clean enough to compose.

## Generated application

Generated apps retain the proven architecture rather than mirroring generator internals:

```text
Routes adapt.
Features orchestrate.
Components render.
Fetchers read.
Actions receive mutations.
Workflows coordinate use cases.
Authorization decides.
Transactions preserve database invariants.
Integration adapters own providers.
Webhooks reconcile external truth.
```

## Manifest

Generated projects keep a small machine-readable manifest containing recipe schema version, generator version, template revision, selected preset, selected modules, and normalized non-secret design/product config. Its purpose is reproducibility and safe `add` operations, not remote management.

## Default create lifecycle

```text
collect/parse intent
→ resolve recipe
→ show review
→ create target safely
→ materialize base/modules
→ personalize
→ install when enabled
→ initialize git when enabled
→ summarize setup and next actions
```

A full generated-app validation suite is not part of the default product experience. Focused sanity checks may run where needed to detect a broken generation operation.

## Safety boundaries

- validate recipe input;
- reject unsafe destination behavior;
- do not interpolate user values into unsafe shell strings;
- do not collect provider secrets;
- preserve Windows path behavior;
- keep the packaged output self-contained.
