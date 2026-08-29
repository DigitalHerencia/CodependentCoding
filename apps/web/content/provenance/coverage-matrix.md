# Source-to-Repository Coverage Matrix

This matrix answers the useful question: **does the repository actually describe the complete build system?** It is a human coverage map, not a test report.

## Required domain coverage

| Required domain | Canonical owner | Coverage |
|---|---|---|
| System identity and scope | `README.md`, `docs/01-knowledge-system-definition.md` | Covered |
| Engineering philosophy/doctrine | `docs/02-engineering-doctrine.md` | Covered |
| Epistemology and source authority | `docs/03-epistemology.md` | Covered |
| Knowledge modeling | `docs/04-knowledge-modeling.md`, ontology contract | Covered |
| Terminology/nomenclature | `docs/05-terminology-nomenclature.md` | Covered |
| Loaded Vibes™ architecture | `docs/10-loaded-vibes-architecture.md` | Covered |
| Hipster Stack™ technologies | `docs/11-hipster-stack-tech-map.md` | Covered |
| Layer contracts/dependency direction | `docs/12-layer-contracts.md`, architecture contract | Covered |
| Runtime/system lifecycles | `docs/13-system-lifecycles.md`, Pattern 09 | Covered |
| Authentication/authorization/RLS/security | `docs/14-security-model.md`, Pattern 05 | Covered |
| Protected reads | Pattern 01 plus supporting data patterns | Covered |
| Server Actions/mutations | Pattern 02 | Covered |
| Application workflows | Pattern 03 | Covered |
| Transactions/concurrency | Pattern 04 | Covered |
| Webhooks/reconciliation | Pattern 06 | Covered |
| Route/feature orchestration | Pattern 07 | Covered |
| Data contracts/selects/DTOs/schemas/types | supporting data patterns | Covered |
| Presentation/client islands/components/pages/errors | supporting presentation patterns | Covered |
| Configuration/environment/cache | supporting infrastructure patterns | Covered |
| Provider/integration adapters | supporting infrastructure patterns | Covered |
| Observability/logging | supporting infrastructure patterns | Covered |
| Testing/validation | `docs/17-validation-conformance.md`, supporting quality patterns | Covered |
| Deployment/delivery | supporting quality patterns | Covered |
| Governance/specification | `docs/15-governance-model.md`, `docs/16-specification-model.md`, Pattern 10 | Covered |
| Agent execution | `docs/18-agent-execution.md` | Covered |
| Reference implementation relationship | `docs/19-reference-implementations.md` | Covered |
| Source provenance/conflict reconciliation | `provenance/` | Covered |

## Source coverage

The source ledger records the complete mandatory corpus used for synthesis, including the first-person build doctrine, Codependent Coding knowledge-system specification, Vouch implementation documentation, Hipster Stack pattern references, terminology/knowledge-modeling references, engineering-practice model, system definition, and tech-stack map.

Dense source relationships are further documented in the ontology, lifecycle, pattern, and contract traceability files.

## Boundary

Coverage means the canonical topic has an owning document or pattern. It does not mean every possible product-specific implementation choice has been frozen into universal doctrine. Product-specific behavior belongs in the generated application's PRD, specifications, ADRs, and tests.
