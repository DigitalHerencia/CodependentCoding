---
title: Codependent Coding Knowledge System Definition
type: source-document
scope: domain
project:
domain: codependentcoding
artifact: knowledge-system-definition
kind: source-document
namespace: codependentcoding.knowledge-system.definition.source-document
status: active
authority: source-of-truth
parent: "[[codependentcoding.knowledge-system.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
  - "[[hipsterstack.patterns.catalog.map]]"
  - "[[web-development.knowledge-modeling.ontology-taxonomy.reference]]"
supersedes: []
tags:
  - tech-stack/codependent-coding
  - knowledge-system
  - loaded-vibes
  - hipster-stack
  - status/active
created: 2026-08-08
updated: 2026-08-08
---

# Codependent Coding™ Knowledge System

## Canonical identity

This note is the durable source-of-truth entrypoint for the **Codependent Coding™ Knowledge System** in `DigitalHerencia/DevNotes`.

The canonical hierarchy is:

```text
Codependent Coding™ Knowledge System
  → defines and governs
Loaded Vibes™ WebApp Architecture
  → organizes and structures
Hipster Stack™ TechStack
  → implements and operates
```

In compressed form:

> Codependent Coding™ explains and governs how software is understood and built. Loaded Vibes™ defines the architectural form of the application. Hipster Stack™ supplies the technologies used to construct it.

The GitHub repository named `DigitalHerencia/CodependentCoding` is therefore **not** the canonical home of the reusable Knowledge System after the 2026-08-08 migration. It may contain operational derivatives required by the Codependent Coding software product, but those derivatives must declare DevNotes provenance and must not become a competing source of truth.

## Scope

The Knowledge System owns the reusable engineering system required to understand, implement, govern, validate, and evolve Loaded Vibes applications, including:

- engineering doctrine and evidence discipline;
- epistemology and source authority;
- ontology, taxonomy, terminology, nomenclature, topology, mereology, semantics, schemas, metadata, and adjacent knowledge-modeling concepts;
- the Loaded Vibes™ WebApp Architecture;
- the Hipster Stack™ technology model;
- layer contracts and dependency direction;
- system and runtime lifecycles;
- authentication, authorization, tenant containment, RLS, provider, webhook, transaction, recovery, and security invariants;
- canonical implementation patterns and the pattern catalog;
- governance and specification models;
- validation and conformance doctrine;
- agent-execution rules;
- reference-implementation guidance;
- provenance, source inventories, synthesis decisions, conflict resolution, and coverage evidence;
- reusable machine-readable product, architecture, ontology, validation, and execution contracts.

## Architectural grammar

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

## Durable owners in DevNotes

DevNotes already contained richer, source-backed technical notes before the compiled Knowledge System repository was migrated. Those notes remain the detailed reusable owners rather than being replaced by shorter duplicate copies.

### System and knowledge modeling

- [[hipsterstack.engineering-system.definition.source-document]] — integrated Hipster Stack / Loaded Vibes engineering-system definition.
- [[web-development.knowledge-modeling.ontology-taxonomy.reference]] — ontology, taxonomy, domain-model, schema, terminology, topology, and adjacent knowledge-modeling distinctions.
- [[software-development.system-architecture.terminology.reference]] — controlled software/system architecture vocabulary.
- [[software-development.engineering-practice.descriptive-model.reference]] — descriptive/normative evidence and engineering-practice model.

### Canonical patterns

- [[hipsterstack.patterns.catalog.map]] — pattern-system navigation.
- [[hipsterstack.patterns.fetcher.reference]]
- [[hipsterstack.patterns.server-action.reference]]
- [[hipsterstack.patterns.application-workflow.reference]]
- [[hipsterstack.patterns.transaction-helper.reference]]
- [[hipsterstack.patterns.auth-authz-boundary.reference]]
- [[hipsterstack.patterns.webhook-processor.reference]]
- [[hipsterstack.patterns.route-feature-orchestration.reference]]
- [[hipsterstack.patterns.layer-contract.reference]]
- [[hipsterstack.patterns.system-lifecycle.reference]]
- [[hipsterstack.patterns.governance-system.reference]]

### Project relationships

- [[loadedvibes.project.source-document]] owns the Loaded Vibes generator product definition that instantiates the architecture.
- [[codependentcoding.project.source-document]] owns the Codependent Coding software product definition that applies the Knowledge System to governed AI-assisted implementation.

## Machine-readable contracts

The reusable deterministic subsets migrated from the former Knowledge System repository now have stable DevNotes paths:

- `codependentcoding.contracts.product.contract.yaml`
- `codependentcoding.contracts.architecture.contract.yaml`
- `codependentcoding.contracts.ontology.contract.yaml`
- `codependentcoding.contracts.validation.contract.yaml`
- `codependentcoding.contracts.execution.contract.yaml`

The stable aliases preserve the original contract payloads so later product packaging can derive from a known source. Source-relative `owner` path strings inside the migrated payloads are provenance identifiers from the former repository, not new DevNotes path authority; the active human owners are the DevNotes notes linked in this map and the migration manifest records the source-to-owner disposition. Product-local operational derivatives must rewrite package-local pointers deliberately while retaining DevNotes provenance.

These contracts support the Markdown doctrine. They do not replace it.

## Migration provenance

The complete 2026-08-08 source repository content is retained under:

`_OPS/migrations/codependentcoding-knowledge-system/2026-08-08/source/`

The snapshot preserves all 52 tracked source paths and the original repository topology so its relative links and reading order remain reconstructable. GitHub text writes normalized the terminal newline on some Markdown files; validation therefore distinguishes content preservation from byte identity. Machine contracts and operational YAML copied through Git objects retain exact source blob identities, and the one material text-escaping delta discovered during validation was repaired before merge.

The snapshot is migration evidence, not a parallel active note hierarchy.

The source-to-destination disposition for every tracked source artifact is recorded in:

`_OPS/migrations/codependentcoding-knowledge-system/2026-08-08/migration-manifest.md`

## Authority rule

When reusable engineering doctrine conflicts, use current explicit user instruction first, then this Knowledge System and its linked canonical DevNotes owners, then implementation evidence and external references according to the recorded provenance decisions. Product repositories may specialize the system through approved specifications and decisions, but implementation never silently overrides reusable doctrine.

## Change rule

A consequential reusable engineering change must update the canonical DevNotes owner and any affected deterministic contract, pattern, lifecycle, security rule, provenance decision, and validation expectation together. Operational copies in product repositories must point back to DevNotes and must not quietly fork the canon.
