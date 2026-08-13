---
id: HS-301
title: Reconcile Hipster Stack identity and web-overhaul governance
status: active
type: implementation-spec
order: 301
depends_on: []
issue: 135
---

# HS-301 — Governance and product identity

## Outcome

Make active governance describe the approved ecosystem and mockup-driven Hipster Stack web overhaul before runtime implementation begins.

## Required inputs

Read only `AGENTS.md`, `context/README.md`, `context/docs/{product,architecture,configuration,template,generator-cli,web,documentation}.md`, `.agents/contracts/{product,architecture}.yaml`, `context/specs/README.md`, and Issue #135.

## Required decisions

- Codependent Coding™ is the upstream Knowledge System.
- Hipster Stack™ is this deterministic generator/CLI/web product.
- Loaded Vibes™ is downstream adaptive specification-driven development tooling.
- The template is a standalone application and contains no generator-only machinery.
- The method/boundaries stay opinionated; concrete choices are editable only when generator support exists.
- Web navigation target is `Product | Docs | Builder`; Libraries folds into interactive Docs.
- Mockups control presentation, shared code controls semantics, BoldKit supplies locally owned UI source, TanStack is interaction reference only.

## Non-goals

No runtime code, package rename, repository rename, UI implementation, deployment, provider operation, or test-system work.

## Acceptance

Active owner docs/contracts no longer conflict on product identity, ecosystem boundary, web surfaces, template boundary, or configuration honesty. Historical `LV-*` material remains provenance.

## Verification

Read back changed governance and compare branch against master. No application test suite is required for governance-only changes.
