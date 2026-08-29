# Supporting Pattern Specifications

The twenty supporting patterns use the complete twenty-one-field pattern contract defined in [Canonical Pattern Catalog](README.md).

They are split into bounded files so each contract remains reviewable without collapsing back into single-row summaries:

| IDs | Group | Canonical file |
|---|---|---|
| SP01-SP04 | Data and contract patterns | [11a-data-contract-patterns.md](11a-data-contract-patterns.md) |
| SP05-SP09 | Presentation patterns | [11b-presentation-patterns.md](11b-presentation-patterns.md) |
| SP10-SP14 | Infrastructure and integration patterns | [11c-infrastructure-integration-patterns.md](11c-infrastructure-integration-patterns.md) |
| SP15-SP20 | Quality, delivery, and policy patterns | [11d-quality-policy-patterns.md](11d-quality-policy-patterns.md) |

## Completeness rule

A supporting pattern is complete only when every mandatory field is present **and pattern-specific**:

`Purpose / context`, `Responsibilities`, `Non-responsibilities`, `Inputs`, `Outputs`, `Dependencies`, `Callers`, `Callees`, `Invariants`, `Failure behavior`, `Security`, `Tenant isolation`, `Transaction behavior`, `Caching behavior`, `Validation`, `Testing`, `Naming`, `Placement`, `Lifecycle`, `Anti-patterns`, and `Adjacent relationships`.

Mechanical validation proves stable pattern IDs, inventory correspondence, field presence, absence of the old table-row representation, and a negative missing-field fixture. It does not treat duplicated boilerplate as substantive evidence; semantic adequacy is established by source traceability and skeptical review against layer, security, lifecycle, provider, and governance owners.

See `provenance/pattern-traceability.md` for source/owner/evidence mapping and `scripts/validate-patterns.mjs` for bounded completeness validation.
