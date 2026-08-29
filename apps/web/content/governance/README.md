# Codependent Coding™ Knowledge System

## The Authoritative Model of the Loaded Vibes™ WebApp Architecture Using the Hipster Stack™ TechStack

The **Codependent Coding™ Knowledge System** is the canonical body of knowledge for understanding, designing, implementing, governing, validating, operating, and evolving the opinionated multi-tenant B2B SaaS systems defined here.

> **Codependent Coding™ explains and governs how software is understood and built. Loaded Vibes™ defines the architectural form of the application. Hipster Stack™ supplies the technologies used to construct it.**

## Authority

This repository is normative unless an artifact explicitly says it is descriptive or implementation evidence. Authority descends from current human instruction and the knowledge-system doctrine into approved specifications and machine contracts, then architecture, patterns, lifecycles, and reference implementations. Implementation never silently overrules doctrine.

## Intended software class

The architecture targets production-oriented, server-first, multi-tenant B2B SaaS applications built with the Hipster Stack™. It favors explicit state ownership, tenant containment, typed boundaries, recoverable external operations, and narrow agent execution. It is not generic Next.js boilerplate, a component library, or a mandate to use every supported integration in every product.

## Canonical grammar

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

The expanded ownership model is defined in [Loaded Vibes™ Architecture](docs/10-loaded-vibes-architecture.md), [Layer Contracts](docs/12-layer-contracts.md), and the [Pattern Catalog](patterns/README.md).

## Reading order

1. [Repository Map](MANIFEST.md)
2. [System Map](docs/00-system-map.md)
3. [Knowledge-System Definition](docs/01-knowledge-system-definition.md)
4. [Engineering Doctrine](docs/02-engineering-doctrine.md)
5. [Epistemology](docs/03-epistemology.md)
6. [Knowledge Modeling](docs/04-knowledge-modeling.md)
7. [Terminology and Nomenclature](docs/05-terminology-nomenclature.md)
8. [Loaded Vibes™ Architecture](docs/10-loaded-vibes-architecture.md)
9. [Hipster Stack™ Technology Map](docs/11-hipster-stack-tech-map.md)
10. [Layer Contracts](docs/12-layer-contracts.md)
11. [System Lifecycles](docs/13-system-lifecycles.md)
12. [Security Model](docs/14-security-model.md)
13. [Pattern Catalog](patterns/README.md)
14. [Governance](docs/15-governance-model.md), [Specifications](docs/16-specification-model.md), [Validation](docs/17-validation-conformance.md), and [Agent Execution](docs/18-agent-execution.md)
15. [Reference Implementations](docs/19-reference-implementations.md) and [`provenance/`](provenance/)

## Non-negotiable invariants

- Every protected operation authenticates, authorizes, validates, and preserves tenant scope at its authoritative boundary.
- Browser-supplied actor, tenant, role, capability, provider identifier, price, customer, connected-account, or return URL data is never trusted as authority.
- Runtime database credentials are pooled, restricted, non-owning, and incapable of bypassing RLS.
- Protected reads enter through self-securing fetchers; UI mutations enter through thin Server Actions that delegate to workflows.
- Prisma and SQL remain inside approved data-layer modules. Provider SDKs remain inside integration adapters.
- Cross-system mutations use stable idempotency, durable operation state, reconciliation, and recovery; database transactions never remain open across network calls.
- Provider webhooks are signature-verified, durably recorded, atomically claimed, idempotently reconciled, and recoverable.
- Presentation receives stable DTO/display contracts; generated Prisma models, provider objects, secrets, and unrestricted payloads do not escape their owning boundaries.
- Completion claims distinguish implementation, inspection, and executed runtime validation.

## Repository use

Humans use the Markdown to understand intent and approve changes. Agents begin with [AGENTS.md](AGENTS.md), load the affected canonical documents and contracts, implement the smallest correct change, and validate actual application behavior in the application being changed. Machines may consume the YAML contracts where useful, but the contracts support the doctrine rather than turning this repository into a software product of its own.

Source inventory, synthesis decisions, conflict resolutions, and coverage notes live in [`provenance/`](provenance/).
