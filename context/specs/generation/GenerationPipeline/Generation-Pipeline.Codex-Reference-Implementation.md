---
title: Codependent Coding™ Generation Pipeline — Generic Codex Reference
type: reference-implementation
scope: generation
project: Codependent Coding
domain: generation-pipeline
artifact: codex-reference
namespace: codependentcoding.generation-pipeline.reference
status: active
authority: supporting-reference
created: 2026-08-22
updated: 2026-08-22
---

# Generation Pipeline — Generic Codex Reference

This file gives Codex an implementation-neutral model.

It is intentionally schematic.

# 1. Input

```ts
type DraftVirgule = {
  ontology: string
  presentation: unknown
}
```

Do not treat this as the canonical runtime schema.

It exists to illustrate the boundary.

---

# 2. Normalize

```text
draft input
+
selected Ontology
+
shared foundation
=
normalized definition
```

---

# 3. Validate

Check:

```text
supported Ontology
valid presentation structure
valid block/feature compatibility
valid token values
no forbidden behavioral override
```

---

# 4. Dependency Closure

Resolve:

```text
normalized routes
normalized features
required BusinessLogic Blocks
Workflow constituents
required providers
required resources
required artifact sets
required packages
required environment keys
shared PureUI constituents
```

Result:

```text
dependency-closed Virgule
```

---

# 5. Plan

```ts
type GenerationPlan = {
  retained: string[]
  omitted: string[]
  transforms: string[]
  validation: string[]
}
```

Schematic only.

The real plan must preserve ownership/reasons and other required state.

---

# 6. Materialize

```text
verify Maximal Template
    ↓
create staging
    ↓
copy source
    ↓
remove safely omitted artifacts
    ↓
apply deterministic transforms
    ↓
write portable config/provenance
    ↓
run required acceptance checks
    ↓
promote
```

---

# 7. Output

```text
The Arrangement™
├── normal source code
├── app-local governance
├── tests
├── env examples
├── optional portable provenance
└── no generator runtime dependency
```

---

# 8. Codex Guardrails

Codex MUST NOT:

- invent a second config schema in the CLI;
- let Anthimeria redefine behavior;
- infer Workflow constituents from filenames;
- remove shared source without dependency proof;
- treat Maximal Template as nine templates;
- serialize application TypeScript into config;
- require generator runtime for Arrangement execution;
- describe skipped validation as passed;
- call Loaded Vibes the generator in the current product model.

---

# 9. Acceptance Checklist

- [ ] One shared schema/resolver.
- [ ] Ontology determines normalized behavior.
- [ ] Presentation overrides are compatibility-checked.
- [ ] Virgule reaches dependency-closed state.
- [ ] Generation plan is deterministic.
- [ ] Maximal Template source is real and runnable.
- [ ] Shared dependencies survive pruning.
- [ ] Materialization stages safely.
- [ ] Arrangement is standalone.
- [ ] Portable config contains no secrets.
- [ ] Current implementation gaps are labeled rather than hidden.
