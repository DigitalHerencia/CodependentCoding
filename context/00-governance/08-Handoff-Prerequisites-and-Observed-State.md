# Handoff Prerequisites and Observed Workspace State

## Prepared inputs

Use together:

1. `TheCodependentCodingWebAppArchitecture.zip` — implementation consolidation workspace.
2. This governance package — controlling handoff, canonical source extracts, segment spec, and loop prompt.

The original authority ZIP packages are **not required** because their relevant canonical Markdown source has been extracted into `10-authority/` here.

## Observed implementation state

### Current public web

`src/CodependentCoding-site` currently implements:

```text
/
/configure
/libraries
/libraries/[slug]
/docs/[[...slug]]
```

It currently uses transitional Hipster Stack / Constituter / Libraries terminology. This is a migration target, not a reason to discard the implementation.

### Current resolver/generator

The working shared implementation is under:

```text
packages/TheHipsterStackTechnologyStack/schema/src/
packages/TheHipsterStackTechnologyStack/core/src/
packages/TheHipsterStackTechnologyStack/cli/src/
```

It already contains Application Definition schema, resolver logic, capability registry, presets, generation planning, transforms, materialization, config loading/normalization, lifecycle validation, and CLI adapters. Reuse and evolve this engine.

### Current Maximal Template evidence

The workspace contains both:

```text
src/TheMaximalTemplate-main/
src/TheMaximalTemplate-demo/
```

plus root shared presentation source. They must be searched and reconciled before anything is declared missing.

The canonical Ontology catalog marks **25 domain PureUI block paths as `[STUB — BUILD]`**. The canonical Anthimeria catalog states **74 BusinessLogic Blocks / Workflows** in the normalized inventory. A quick exact/normalized scan found that the current `TheMaximalTemplate-main` already contains semantically matching implementations for at least 21 canonical Workflow names even though the filenames omit the `Workflow` suffix. This is precisely the kind of naming drift that must be migrated, not treated as missing functionality.

### Code explorer evidence

`src/CodebaseContextUtility-main` contains file-tree, virtualized file-tree, code-preview, context-provider, and related source-inspection components. Reuse/adapt useful mechanics; do not keep its standalone Next 14 runtime as a separate product.

### Mockups/assets

All ten handoff mockups are already present in `context/mockups/`. The workspace also contains branded public assets for Codependent Coding, Ontology, Simples, Anthimeria, Maximal Template, Virgule, Arrangement, Loaded Vibes, Visual Vibes, and Digital Herencia.

### Dependency install/build status

The supplied ZIP does **not** include `node_modules`. Full repository builds/tests were not executed during this handoff preparation. Codex must install dependencies according to the lockfile/package manager before claiming build/test status.

### Remote/deployment status

No remote creation, repository migration, or deployment is part of this build. Treat any old package repository URLs as stale metadata to reconcile or defer. A new repository/remote/deployment will be created only after local acceptance.
