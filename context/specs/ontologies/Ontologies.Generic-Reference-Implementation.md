---
title: The Ontology™ Normalized Defaults — Generic Reference Implementation
type: implementation-reference
scope: application-definition
project: Codependent Coding
domain: ontologies
artifact: reference-pattern
namespace: codependentcoding.ontologies.reference-implementation
status: active
authority: normative-example
parent: codependentcoding.ontologies.authoritative
created: 2026-08-22
updated: 2026-08-22
---

# The Ontology™ Normalized Defaults — Generic Reference Implementation

This reference explains to Codex how a normalized Ontology is represented and resolved without inventing a tenth domain.

---

# 1. Generic Ontology Shape

```text
Example Ontology
├── shared foundation
├── routes
│   ├── route A
│   └── route B
├── features
│   ├── Feature A
│   └── Feature B
├── Page Templates
│   ├── Template A
│   └── Template B
├── Simples
│   ├── PureUI Block A
│   ├── PureUI Block B
│   ├── BusinessLogic Block A
│   └── BusinessLogic Block B
├── required constituent dependencies
└── supported optional integrations
```

---

# 2. Generic Route Association

```text
/example
    ↓
ExampleFeature
    ↓
ExampleTemplate
    ↓
Feature Slots
    ↓
PureUI Block
+
BusinessLogic Block
```

A real canonical Ontology may associate one Feature with several Workflows and several presentation Blocks.

---

# 3. Generic Ontology Manifest

This is schematic, not a finalized machine schema:

```ts
export const exampleOntology = {
  id: "example",

  sharedFoundation: true,

  routes: {
    "/example": {
      feature: "exampleFeature",
      template: "WorkspaceTemplate",
      presentation: {
        blocks: ["example-block"],
      },
      behavior: {
        workflows: ["executeExampleWorkflow"],
      },
    },
  },

  integrations: {
    optional: ["example-provider"],
  },
} as const
```

The normalized real inventory—not this example—remains authoritative for supported paths.

---

# 4. Shared Foundation Resolution

Before domain-specific material is resolved:

```text
shared foundation
├── public/product
├── authentication
├── onboarding
├── settings
├── navigation
├── shells
├── organization/membership
├── authorization
├── database foundation
├── validation
└── error/loading infrastructure
```

Then the selected Ontology adds its domain-specific graph.

---

# 5. PureUI Association

A route/Feature may resolve a default presentation:

```text
Feature
    ↓
PureUI Block
    ↓
UI Primitive constitution
```

Anthimeria may change the compatible presentation choice.

The Feature's normalized capability semantics remain unchanged.

---

# 6. BusinessLogic Association

A route/Feature resolves required normalized behavior:

```text
Feature
    ↓
BusinessLogic Block / Workflow
    ↓
exact Workflow constitution
    ↓
dependency closure
```

Anthimeria does not expose the lower-level constituent files as arbitrary toggles.

---

# 7. Optional Integration Resolution

A supported optional provider is resolved only when:

```text
selected capability
    ↓
provider required?
    ↓
yes
    ↓
retain provider integration
+
required schemas/types/config/webhooks
```

An unsupported provider must not be silently substituted.

---

# 8. Presentation Override

A user presentation override might conceptually change:

```text
Template topology
Block variation
Primitive variant
Semantic Design Tokens
content
```

It must not change:

```text
required Workflow
authorization semantics
persistence invariants
provider mechanics
dependency closure
```

---

# 9. Generic Virgule

```yaml
application:
  ontology: example

  sharedFoundation:
    enabled: true

  presentation:
    pages:
      example:
        template: workspace
        slots:
          primary:
            block: example-block
            variant: compact

  behavior:
    source: ontology
    editable: false

  integrations:
    example-provider:
      enabled: true
```

Schematic only.

---

# 10. Resolution Flow

```text
Ontology
    ↓
merge shared foundation
    ↓
apply supported optional capabilities
    ↓
apply presentation overrides
    ↓
resolve required Simples
    ↓
close behavioral dependencies
    ↓
validate
    ↓
dependency-closed Virgule
    ↓
materialize Arrangement
```

---

# 11. CRM as the Canonical Pattern Example

The CRM Ontology demonstrates the same grammar used by every other Ontology:

```text
CRM
├── routes
├── features
├── Page Templates
├── PureUI Blocks
├── BusinessLogic Blocks
├── auth/authz
├── fetchers/actions/db helpers
├── cache
└── optional providers
```

The concrete CRM file inventory is maintained in the companion canonical catalog.

---

# 12. Codex Acceptance Checklist

- [ ] Ontology is one of the nine canonical defaults.
- [ ] Shared foundation is included as substrate.
- [ ] Route exists in the canonical normalized inventory.
- [ ] Feature association matches the inventory.
- [ ] Page Template association matches the inventory.
- [ ] PureUI Block association is source-backed.
- [ ] BusinessLogic Block association is source-backed.
- [ ] `[STUB — BUILD]` status is preserved.
- [ ] Optional providers are source-backed.
- [ ] Exact Workflow constituent subsets are not invented.
- [ ] Presentation overrides do not alter behavior.
- [ ] Resolver closes dependencies before generation.
- [ ] One Maximal Template remains the source implementation.
