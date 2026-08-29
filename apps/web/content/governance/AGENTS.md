# Repository Agent Guide

## Purpose

This repository is the canonical Codependent Coding™ Knowledge System. Its job is to explain how the Loaded Vibes™ WebApp Architecture is built using the Hipster Stack™ TechStack. Treat the written doctrine, architecture, patterns, contracts, decisions, and source provenance as the product.

## Read first

1. `README.md`
2. `docs/02-engineering-doctrine.md`
3. `docs/10-loaded-vibes-architecture.md`
4. `docs/12-layer-contracts.md`
5. `docs/13-system-lifecycles.md`
6. `docs/14-security-model.md`
7. `patterns/README.md`
8. The affected pattern or supporting-pattern document
9. `.agents/contracts/architecture.yaml`, `.agents/contracts/product.yaml`, and `.agents/contracts/ontology.yaml` when machine-readable constraints matter
10. `provenance/synthesis-decisions.md` and `provenance/conflict-resolution.md` when sources disagree

## Architectural source of truth

Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

## Operating rules

- Preserve the documented layer boundaries, tenant model, security invariants, provider isolation, and server-first presentation model.
- Make the smallest change that keeps the knowledge system internally coherent.
- When a public architectural boundary changes, update the owning document, affected patterns, and machine-readable contract together.
- Use `provenance/source-provenance-ledger.md`, `provenance/synthesis-decisions.md`, and `provenance/conflict-resolution.md` to resolve source questions.
- Do not manufacture evidence, invent product requirements, or silently promote one reference implementation into universal doctrine.
- Do not expose secrets or raw production payloads.
- Generated SaaS applications own their own lint, typecheck, unit, integration, database/RLS, browser, accessibility, security, build, and deployment tests. This documentation repository does not maintain a parallel test harness for proving that its Markdown exists.

## Completion

For knowledge-system edits, review the changed files for coherence, broken references, placeholders, and contradictions. For implementation work in a generated or reference application, run that application's real engineering gates. Do not confuse documentation inspection with runtime proof.
