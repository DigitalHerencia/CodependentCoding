---
title: Maximal Template™ → Arrangement™ — Materialization and Ownership Contract
type: materialization-contract
scope: generation
project: Codependent Coding
domain: generation
artifact: ownership-contract
namespace: codependentcoding.maximal-to-arrangement
status: active
authority: canonical
created: 2026-08-22
updated: 2026-08-22
---

# Maximal Template™ → Arrangement™

## Materialization and Ownership Contract

# 1. Boundary

```text
Maximal Template
    = superset application source

Virgule
    = resolved application intent

Hipster Stack
    = resolver + planner + generator

Arrangement
    = materialized subset/transformation
```

---

# 2. Ownership Rule

**The Maximal Template owns application code.**

**The Hipster Stack owns generation metadata and materialization semantics.**

This separation prevents the template from becoming polluted with generator-only implementation details.

---

# 3. Artifact Resolution

For every source artifact, the generation system should be able to answer:

```text
Who owns it?
Which capability/Feature/Workflow requires it?
Is it shared?
Is it removable?
Is it transformable?
What depends on it?
Why is it in the Arrangement?
```

If the generator cannot answer these questions for a proposed removal, removal is unsafe.

---

# 4. Shared Constituent Rule

A BusinessLogic Workflow may share Actions, Fetchers, Auth/Authz helpers, schemas, types, integrations, selects, DTOs, transactions, cache helpers, constants, or utilities with another Workflow.

Therefore:

```text
remove Workflow A
≠
delete every file Workflow A references
```

The generator removes shared constituents only when the complete dependency graph proves no retained capability requires them.

---

# 5. Presentation Constituent Rule

PureUI Blocks may share primitives and semantic tokens.

Therefore:

```text
remove Block A
≠
remove Button primitive
```

Primitive/token retention is dependency-derived.

---

# 6. Transform Rule

Transforms modify only generator-owned configuration surfaces or known source contracts.

Examples:

- package/display identity;
- route mapping;
- content files;
- page-template/slot wiring;
- Block variants;
- semantic token values;
- provider-specific enabled code/config;
- role/capability declarations;
- env examples;
- local architecture/product contracts.

Transforms must not inject hidden business behavior outside normalized architecture owners.

---

# 7. Safe Destination Rule

Generation must avoid corrupting an unrelated existing project.

A destination should be:

- new;
- empty/safely replaceable according to explicit command contract;
- or otherwise handled by a deliberate supported mode.

An unrecognized populated repository is not a normal `create` target.

---

# 8. Staging Rule

Materialization should happen in staging before promotion.

This provides:

- failure cleanup;
- reduced partial-output risk;
- deterministic transform ordering;
- acceptance validation before final promotion where applicable.

---

# 9. Provenance Rule

The Arrangement should retain enough provenance to explain its origin without carrying generator implementation.

Recommended:

```text
hipsterstack.json
.hipsterstack/manifest.json
```

These are source-control metadata, not runtime service dependencies.

---

# 10. Canonical Equation

```text
Maximal Template source
×
dependency-closed Virgule selection
×
Hipster Stack ownership/transform rules
=
Arrangement source constitution
```
