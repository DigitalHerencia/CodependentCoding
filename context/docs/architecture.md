---
title: Hipster Stack Repository and Generator Architecture
artifact: architecture
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Repository and Generator Architecture

## Core model

Hipster Stack is a deterministic application-composition system:

```text
Web Builder ───────┐
CLI ───────────────┼──> shared application-definition schema
config file ───────┘                 │
                                     ▼
                               resolve composition
                                     │
                                     ▼
                               generation plan
                                     │
                          ┌──────────┴──────────┐
                          ▼                     ▼
                 generator-side catalog   standalone template/
                          └──────────┬──────────┘
                                     ▼
                              materialize output
                                     │
                                     ▼
                           generated application
```

The UI/CLI/config file are adapters. They do not own separate configuration semantics.

## Current physical implementation

The live repository currently uses:

```text
apps/web
packages/cli
packages/core
packages/schema
template/
docs/
context/
.agents/
```

That is current implementation state, not permission to use `core` as an unlimited responsibility bucket. Future structural changes require their own scoped Issue; the HS web overhaul does not perform a broad generator reorganization.

## Boundaries

- Schema/configuration code owns runtime validation and public configuration shapes, not filesystem mutation or UI.
- Composition/core code owns defaults, dependency/conflict resolution, generator-side template knowledge, generation planning, transforms, materialization, and explanation, not terminal or Next.js presentation.
- CLI owns command parsing/prompts/output and delegates semantics.
- Web owns Product, interactive Docs, and Builder presentation. It may own navigation/presentation metadata but not a second capability/configuration rules engine.
- `template/` owns the standalone maximal white-label application only. Generator ownership catalogs, pruning instructions, CLI/Builder state, and generation mechanics must remain outside it.

## Application architecture

The generated project follows the Codependent Coding/Hipster Stack grammar:

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Transactions preserve invariants. Webhooks reconcile external truth.

Generator internals must not leak into generated application behavior or UI.

## Generation rules

- one repository-owned maximal template;
- no network template fetch during ordinary generation;
- every visible selectable option must have a real deterministic generation effect;
- generator-side metadata may map configuration to owned application artifacts without becoming part of the standalone template;
- never collect provider secrets;
- preserve Windows paths and safe destination behavior.
