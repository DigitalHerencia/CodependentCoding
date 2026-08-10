---
title: Loaded Vibes Repository and Generator Architecture
artifact: architecture
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Repository and Generator Architecture

## Core model

Loaded Vibes is a deterministic compiler from a bounded configuration to a filtered and personalized copy of one maximal application template.

```text
Web Configurator ─┐
CLI ──────────────┼──> shared schema + normalization
loadedvibes.json ─┘                │
                                   ▼
                             configuration resolution
                                   │
                                   ▼
                         template ownership catalog
                                   │
                                   ▼
                       retain / remove generation plan
                                   │
                                   ▼
                          one repository template/
                                   │
                                   ▼
                           structured transforms
                                   │
                                   ▼
                       generated white-label project
                                   │
                                   ▼
                           concise user handoff
```

## Target repository shape

```text
/
├── apps/
│   └── web/                 # landing + /configure + /docs
├── packages/
│   ├── cli/                 # terminal UX and command adapters
│   ├── core/                # resolution, planning, generation
│   └── schema/              # shared loadedvibes.json contract
├── template/                # one maximal white-label application
├── docs/                    # canonical end-user docs
├── context/                 # maintainer/Codex context
├── .agents/                 # compact machine contracts and execution state
├── scripts/                 # package/release utilities actually used
├── .github/
└── AGENTS.md
```

## Boundaries

### `packages/schema`

Owns public configuration shapes and enums shared by the CLI, core, and web.

It must not own:

- file-system mutation;
- terminal UX;
- web components;
- template implementation details beyond stable configuration identifiers.

### `packages/core`

Owns:

- defaults and normalization;
- dependency resolution;
- template ownership catalog;
- generation planning;
- retain/remove decisions;
- structured personalization;
- materialization;
- project provenance/manifest;
- shared explanations of the generated result.

It must not depend on:

- terminal UI;
- Next.js web UI.

### `packages/cli`

Owns:

- command parsing;
- interactive prompts;
- terminal review and output;
- invoking the core;
- user-facing local handoff.

It must not create a second configuration interpretation.

### `apps/web`

Owns:

- the Loaded Vibes developer website;
- the visual configuration workbench;
- representative preview;
- rendering end-user documentation;
- exporting/copying a configuration or CLI handoff.

The initial web app remains stateless and does not generate projects on a hosted server.

### `template/`

Owns the complete maximal white-label application.

It is executable application source, not a collection of generator fragments.

The template should preserve its working internal architecture. Moving it into `template/` is an ownership and repository-shape cleanup, not permission to rename or reorganize every internal directory.

## One-template composition

The target generator starts from one maximal template and removes material the resolved configuration does not own.

Ownership metadata may express:

- capability/integration identifier;
- files and directories owned;
- route groups owned;
- package or config contributions;
- environment-example contributions;
- schema/data contributions where safe removal is supported;
- structured transforms;
- dependencies between optional surfaces.

Do not duplicate owned source code into overlay module trees merely to support generation.

## Compatibility during migration

The current repository contains `template/` as its sole application source, preset defaults in `packages/core`, and temporary capability metadata plus module-based generation behavior. The latter structures are migration inputs.

They may remain temporarily while earlier specs move source ownership and core semantics. They must not survive as unexplained parallel architecture after the final cleanup spec.

## Application architecture

The generated project preserves the Hipster Stack grammar defined in DevNotes:

```text
Routes adapt.
Features orchestrate.
Components render.
Fetchers read.
Actions receive mutations.
Schemas validate.
Workflows coordinate use cases.
Authorization decides.
Transactions preserve database invariants.
Integration adapters own provider mechanics.
Webhooks reconcile external truth.
```

Generator internals must not leak into generated application UI.

## Provenance

Generated projects keep minimal local provenance sufficient to explain:

- generator version;
- template revision;
- configuration schema version;
- normalized non-secret configuration;
- selected optional surfaces;
- materialization result.

Provenance supports explanation and safe generator-owned follow-up. It is not remote management.

## Safety

- Never fetch an application template from another repository during generation.
- Never collect provider secrets.
- Reject unsafe destination behavior.
- Avoid unsafe shell interpolation.
- Preserve Windows path behavior.
- Do not make network/provider calls on behalf of a generated project during basic generation.
