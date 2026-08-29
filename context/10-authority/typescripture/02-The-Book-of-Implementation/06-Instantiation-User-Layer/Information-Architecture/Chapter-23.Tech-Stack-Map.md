---
title: Tech Stack Map
type: map
scope: vault
project:
domain: vault
artifact: index
kind: map
namespace: devnotes.tech-stack.map
status: active
authority: reference
parent: "[[devnotes.home]]"
depends_on:
  - "[[obsidian.contracts.naming-standard]]"
supersedes: []
tags:
  - maps/vault
  - tech-stack
  - status/active
created: 2026-05-07
updated: 2026-08-11
---

# Tech Stack Map

## Canonical engineering system

- [[codependentcoding.knowledge-system.map]] — existing reusable technical integration map for the Codependent Coding™ Knowledge System, Loaded Vibes™ WebApp Architecture, and Hipster Stack™.
- [[codependentcoding.knowledge-system.definition.source-document]] — existing DevNotes integration note for identity, hierarchy, authority, and migration provenance.
- [[hipsterstack.engineering-system.definition.source-document]] — integrated technical architecture and implementation-system definition.
- [[hipsterstack.patterns.catalog.map]] — canonical Hipster Stack implementation-pattern navigation.

## Complete Codependent Coding corpus

The complete Obsidian-native 52-note corpus is maintained in `60 CODEPENDENT CODING` and is navigated through:

- [[codependentcoding.manifest.map]] — corpus/repository map.
- [[codependentcoding.docs.system-map.map]] — system-level map.
- [[codependentcoding.patterns.catalog.map]] — Codependent Coding pattern catalog.

This map does not resolve the substantive relationship between the pre-existing `40 TECH STACK` material and the imported corpus; that requires deliberate reconciliation rather than housekeeping.

### Machine-readable contracts

- `codependentcoding.contracts.product.contract.yaml`
- `codependentcoding.contracts.architecture.contract.yaml`
- `codependentcoding.contracts.ontology.contract.yaml`
- `codependentcoding.contracts.validation.contract.yaml`
- `codependentcoding.contracts.execution.contract.yaml`

## Files

~~~dataview
LIST
FROM "40 TECH STACK"
SORT file.name ASC
~~~

## Recently Modified

~~~dataview
TABLE file.mtime AS Modified
FROM "40 TECH STACK"
SORT file.mtime DESC
LIMIT 20
~~~
