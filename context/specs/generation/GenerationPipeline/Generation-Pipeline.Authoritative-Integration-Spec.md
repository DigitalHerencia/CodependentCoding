---
title: Codependent Coding™ Generation Pipeline — Authoritative Integration Specification
type: integration-specification
scope: generation
project: Codependent Coding
domain: generation-pipeline
artifact: master-integration-document
namespace: codependentcoding.generation-pipeline.authoritative
status: active
authority: canonical
created: 2026-08-22
updated: 2026-08-22
---

# Codependent Coding™ Generation Pipeline

## Authoritative Integration Specification

# 1. Purpose

This document defines how the canonical generation-side products relate.

It does not replace their subject-specific authority documents.

---

# 2. Product Chain

```text
Codependent Coding™ WebApp Architecture
        ↓ governs
Ontology™
        ↓ normalized starting constitution
Anthimeria™ / CLI / portable config
        ↓
Virgule™ Application Definition
        ↓ normalize
        ↓ validate
        ↓ dependency closure
The Hipster Stack™ Technology Stack
        +
The Maximal Template™ Domain Library
        ↓ retain / remove / transform
The Arrangement™ Generated Artifact
        ↓
normal application ownership
        ↓ optional
Loaded Vibes™ Codex Plugin
```

---

# 3. Canonical Equation

```text
Shared Foundation
+
Ontology
+
supported optional capabilities
+
presentation configuration
+
required dependency closure
=
dependency-closed Virgule
```

Then:

```text
dependency-closed Virgule
+
Hipster Stack generator semantics
+
Maximal Template source
=
Arrangement
```

---

# 4. Authority Handoffs

## Ontology → Virgule

Ontology owns normalized behavioral constitution and starting application graph.

Virgule records that resolved constitution plus supported presentation choices and dependency closure.

## Anthimeria → Virgule

Anthimeria owns visual configuration UX.

It does not own unique configuration semantics.

## CLI → Virgule

CLI collects/loads/reviews configuration.

It does not own unique dependency rules.

## Virgule → Hipster Stack

Dependency-closed Virgule is generation input authority.

## Hipster Stack → Maximal Template

Generator uses ownership/dependency rules to select/transform real source.

## Maximal Template → Arrangement

Template supplies the application implementation that survives/transforms into the generated repository.

## Arrangement → Owner

Arrangement becomes a normal independently owned application repository.

---

# 5. Two Dependency Systems

The architecture distinguishes:

## Presentation compatibility

```text
Feature
  ↓
compatible PureUI Block
  ↓
primitive constitution
  ↓
variants
  ↓
semantic tokens
```

## Behavioral dependency closure

```text
Feature
  ↓
BusinessLogic Block
  ↓
Workflow constitution
  ↓
server operations / helpers / contracts
```

Presentation is user-configurable within compatibility constraints.

Behavior is normalized.

The generator closes both graphs without exposing behavioral constituent files as ordinary end-user toggles.

---

# 6. State Progression

```text
Ontology selected
    ↓
DRAFT VIRGULE
    ↓ normalize
NORMALIZED VIRGULE
    ↓ validate
VALIDATED VIRGULE
    ↓ resolve dependencies
DEPENDENCY-CLOSED VIRGULE
    ↓ plan
GENERATION PLAN
    ↓ materialize
ARRANGEMENT
```

Each transition has a different authority.

Do not collapse them into “config selected → files copied.”

---

# 7. Failure Semantics

Examples:

| Stage | Failure |
|---|---|
| input | invalid schema / unsupported value |
| normalize | unknown Ontology or illegal representation |
| validate | constraint/conflict violation |
| dependency closure | unresolved provider/artifact/Workflow dependency |
| destination | unsafe/conflicting target |
| materialize | template invalid/copy/transform failure |
| acceptance | generated output fails required checks |
| setup | provider credentials/infrastructure still pending |

A materialized app with skipped provider setup is not a provider-ready app.

A generated app with skipped validation is not an acceptance-validated app.

---

# 8. Statelessness

Anthimeria is stateless with respect to application hosting/build ownership.

Ordinary generation does not require:

- a Codependent Coding account;
- a hosted build worker;
- a remote template fetch;
- a hosted project database;
- provider credentials merely to create source.

The portable definition can move from web workbench to local CLI.

---

# 9. Source-Control Boundary

The final Arrangement belongs in normal source control.

It can outlive:

- the browser session;
- the config UI;
- the generator process;
- the original machine;
- the Hipster Stack runtime.

Portable provenance helps explain origin but does not create platform lock-in.

---

# 10. Support Truth

A capability is supported only if the entire chain is supported:

```text
Ontology definition
+
Simples
+
Maximal Template implementation
+
resolver closure
+
ownership metadata
+
materialization
+
validation
=
supported generated capability
```

A screenshot, prose entry, or source stub alone does not prove generator support.

---

# 11. Canonical Invariants

1. One configuration semantics model.
2. One Maximal Template source.
3. Nine canonical default Ontologies.
4. Presentation configuration cannot rewrite normalized behavior.
5. Dependency closure precedes generation.
6. The generator knows artifact ownership.
7. Shared constituents are preserved when still required.
8. Materialization uses real source.
9. Arrangement is standalone.
10. No hidden hosted control plane is required.
11. Provider setup remains owner-controlled.
12. Loaded Vibes is post-generation coding-agent support, not the materializer.

---

# 12. Canonical Sentence

> **Codependent Coding generation is a constitution pipeline: an Ontology establishes normalized behavior, Anthimeria/CLI record supported intent in Virgule, the shared resolver validates and closes dependencies, The Hipster Stack builds a deterministic generation plan, The Maximal Template supplies real superset application source, and the materializer retains/removes/transforms that source into The Arrangement™, a standalone white-label application.**
