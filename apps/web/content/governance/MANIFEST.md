# Repository Map

This is a human navigation map for the Codependent Coding™ Knowledge System. It is intentionally simple. The repository itself is the source of truth; this file is not a generated checksum registry or dependency database.

## Core knowledge system

| Area | Canonical files |
|---|---|
| Identity and system map | `README.md`, `docs/00-system-map.md`, `docs/01-knowledge-system-definition.md` |
| Engineering doctrine | `docs/02-engineering-doctrine.md`, `docs/03-epistemology.md` |
| Knowledge modeling and vocabulary | `docs/04-knowledge-modeling.md`, `docs/05-terminology-nomenclature.md` |
| Architecture and stack | `docs/10-loaded-vibes-architecture.md`, `docs/11-hipster-stack-tech-map.md` |
| Layer and runtime behavior | `docs/12-layer-contracts.md`, `docs/13-system-lifecycles.md` |
| Security | `docs/14-security-model.md` |
| Governance and specifications | `docs/15-governance-model.md`, `docs/16-specification-model.md` |
| Validation philosophy | `docs/17-validation-conformance.md` |
| Agent execution | `docs/18-agent-execution.md` |
| Reference implementations | `docs/19-reference-implementations.md` |

## Canonical patterns

`patterns/README.md` is the catalog. Major patterns cover fetchers, Server Actions, application workflows, transaction helpers, auth/authz/policy, webhook processing, route/feature orchestration, layer contracts, system lifecycles, and governance. Supporting patterns cover data contracts, presentation, infrastructure/integrations, quality, delivery, and policy.

## Machine-readable contracts

- `.agents/contracts/product.yaml`
- `.agents/contracts/architecture.yaml`
- `.agents/contracts/ontology.yaml`
- `.agents/contracts/validation.yaml`
- `.agents/contracts/execution.yaml`

These contracts summarize stable machine-consumable rules. They do not replace the human doctrine.

## Provenance

`provenance/` records the source inventory, durable synthesis decisions, resolved conflicts, source-to-domain coverage, and focused traceability for ontology, lifecycles, patterns, and contracts.
