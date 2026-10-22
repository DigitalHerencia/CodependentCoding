# Chapter 09: Pattern Catalog

**The Book of Knowledge™**

## Definition

- A pattern is a reusable solution shape with a specific responsibility, boundary, contract, invariants, failure behavior, and relationship to adjacent owners. A pattern is not a copy-paste code snippet.

## Canonical core patterns

- P01 Fetcher — protected reads.
- P02 Server Action — mutation transport adapter.
- P03 Application Workflow — named use-case coordination.
- P04 Transaction Helper — atomic database facts.
- P05 Authentication/Authorization/Policy — identity and authority.
- P06 Webhook Processor — durable external reconciliation.
- P07 Route/Feature Orchestration — framework/presentation composition.
- P08 Layer Contract — trust and dependency boundaries.
- P09 System Lifecycle — states, transitions, concurrency, recovery.
- P10 Governance System — durable intent, decisions, evidence, and controlled change.

## Pattern contract

- Each canonical pattern states purpose, responsibilities, non-responsibilities, inputs, outputs, dependencies, callers, callees, invariants, failure behavior, security, tenant isolation, transaction/caching behavior, validation, tests, naming, placement, lifecycle, anti-patterns, and adjacent relationships.

## Rule

- A supporting pattern does not become a new architectural layer merely because it has a name. Only stable responsibility boundaries deserve first-class architectural status.
