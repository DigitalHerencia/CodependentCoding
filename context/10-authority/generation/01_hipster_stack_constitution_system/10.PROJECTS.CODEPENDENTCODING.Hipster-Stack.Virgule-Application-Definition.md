---
title: The Virgule™ Application Definition — Authoritative Contract
type: application-definition-contract
scope: generation-system
project: Codependent Coding
domain: virgule
artifact: source-contract
namespace: codependentcoding.virgule.authoritative
status: active
authority: canonical
created: 2026-08-22
updated: 2026-08-22
---

# The Virgule™ Application Definition

## Authoritative Contract

# 1. Definition

> **The Virgule™ Application Definition is the portable, normalized statement of application intent whose dependency-closed state is the authoritative input for preview, generation planning, and materialization.**

It is not generated source code.

It is not a second template.

It is not Anthimeria UI state.

It is not a bag of arbitrary file toggles.

---

# 2. Lifecycle

```text
draft
  ↓
normalized
  ↓
validated
  ↓
dependency-closed
```

Only the final state is materialization authority.

---

# 3. Canonical Information Families

A Virgule may represent:

```text
application identity
selected Ontology
shared foundation
presentation constitution
supported optional capabilities
normalized behavioral references
provider requirements
authorization model
route surfaces
resources
artifact requirements
environment requirements
setup requirements
dependency reasons
property provenance
generation-relevant provenance
```

Exact serialized shape belongs to the shared runtime schema and may evolve.

The conceptual contract is stable even while implementation identifiers migrate.

---

# 4. Behavioral Authority

The selected Ontology establishes normalized behavior.

Virgule may reference that behavior, but ordinary presentation configuration does not rewrite it.

```text
Ontology
   ↓
normalized Feature graph
   ↓
BusinessLogic Blocks / Workflows
   ↓
dependency closure
   ↓
Virgule.normalizedBehavior
```

Behavioral constituents are architecture-owned.

They are not manually assembled by the user from source files.

---

# 5. Presentation Authority

Virgule records supported presentation choices, including where applicable:

```text
route/page
Page Template
Feature Slots
compatible PureUI Block
Block variant
compatible UI Primitive constitution
Primitive variants
Semantic Design Tokens
content/copy
```

Example schematic:

```yaml
application:
  ontology: crm

  presentation:
    pages:
      pipeline:
        template: workspace
        slots:
          primary:
            feature: crm_pipeline
            block: kanban_board
            variant: dense
        tokens:
          radius: lg
          hover: scale
        content:
          title: Pipeline

  normalizedBehavior:
    source: ontology
    editable: false
```

This example is conceptual, not a finalized serialization guarantee.

---

# 6. Dependency Closure

Dependency closure must resolve every requirement implied by the normalized application.

Conceptually:

```text
Feature
├── PureUI Block
│   └── primitives / variants / tokens
│
└── BusinessLogic Block
    └── Workflow constitution
        ├── Actions / Fetchers
        ├── Auth / Authz
        ├── Integrations
        ├── Transactions
        ├── Selects / DTOs
        ├── Schemas / Types
        └── Helpers
```

Additionally:

```text
providers
resources
routes
artifact sets
packages
environment requirements
setup requirements
```

No unresolved required edge may remain before materialization.

---

# 7. Provenance States

The resolver may classify values as:

```text
DEFAULT
PRESET
USER
DERIVED
REQUIRED
LOCKED
```

This lets adapters explain why a value exists.

Example:

```text
radius = USER
crm.pipeline = PRESET
workflow.advanceDeal = REQUIRED
architectureVersion = LOCKED
provider.stripe = DERIVED
```

The exact property names are implementation-specific.

---

# 8. Constraints

A valid Virgule MUST:

- select a supported Ontology or supported custom definition path;
- preserve the shared foundation required by the application;
- contain only supported presentation choices;
- preserve normalized behavioral associations;
- satisfy provider requirements;
- satisfy authorization and tenancy requirements;
- satisfy resource and artifact dependencies;
- preserve required security boundaries;
- reject conflicts;
- contain no secrets;
- resolve to a deterministic generation plan.

---

# 9. Invalid States

Examples:

```text
required BusinessLogic Workflow disabled
provider requirement unresolved
required artifact excluded
authenticated route with no authentication capability
presentation block incompatible with Feature semantics
UI substitution removes required mutation contract
cross-tenant safety artifact removed
unknown provider substituted silently
generator-only file toggle breaks dependency closure
```

Such configurations must fail normalization/validation or be auto-resolved into a legal state where the rule explicitly permits derivation.

---

# 10. Adapter Parity

These adapters must consume equivalent semantics:

```text
Anthimeria
CLI
hipsterstack.json
```

No adapter may create hidden state that materially changes the generated application without appearing in the normalized definition/provenance.

---

# 11. Preview Contract

Preview derives from the same normalized definition that generation uses.

Therefore:

```text
Preview ≠ separate design mock state
```

The preview may simplify infrastructure execution, but it must not claim presentation or capability state the materializer would reject.

---

# 12. Portability

Virgule is portable configuration, not runtime dependence.

A generated Arrangement may preserve `hipsterstack.json` for:

- provenance;
- explanation;
- reproduction;
- supported additions.

But the application runtime must not depend on Hipster Stack or Anthimeria to serve normal application traffic.

---

# 13. Current Implementation Mapping

Current Hipster Stack evidence maps roughly as:

```text
packages/schema/src/application-definition.ts
    → runtime Application Definition shape

packages/core/src/application-definition.ts
    → normalization + resolution + generation-plan inputs

packages/core/src/generator/plan.ts
    → materialization plan

hipsterstack.json
    → portable serialized input/handoff

.hipsterstack/manifest.json
    → generated-project provenance/manifest
```

The live schema currently contains transitional four-preset/capability semantics.

Those details are evidence of current implementation state, not the final canonical nine-Ontology presentation-first Virgule contract.

---

# 14. Canonical Sentence

> **Virgule™ is the portable application definition that progresses from draft to normalized, validated, and dependency-closed states. It records supported user intent—principally the configurable presentation constitution—while preserving references to the Ontology-normalized behavioral constitution. The dependency-closed Virgule is the single resolved authority used by Anthimeria preview, the Hipster Stack generation plan, and final materialization.**
