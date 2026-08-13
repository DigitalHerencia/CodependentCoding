---
id: HS-302
title: Rename active generator identifiers to Hipster Stack
status: active
type: implementation-spec
order: 302
depends_on: [HS-301]
issue: 136
---

# HS-302 — Rename active generator identifiers

## Outcome

Rename active product/runtime identifiers to Hipster Stack without rewriting history or renaming the GitHub repository.

## Required inputs

Read this spec, Issue #136, `context/docs/{product,configuration,generator-cli,web}.md`, `.agents/contracts/product.yaml`, root/workspace package metadata, CLI entry files, shared configuration code, active web copy, and directly affected tests. Use repository search rather than broad file-by-file reading.

## Target vocabulary

- product: Hipster Stack™
- canonical CLI: `hipster-stack`
- portable config: `hipsterstack.json`
- workspace namespace: `@hipster-stack/*`
- Loaded Vibes™ only when referring to downstream adaptive tooling

## Rules

Preserve historical closed issues/PRs/specs. Do not rename the GitHub repository. Keep an old command/package alias only if repository evidence demonstrates a real compatibility obligation; otherwise remove stale aliases instead of carrying ambiguity forward.

## Non-goals

No UI redesign, generator architecture rewrite, template restructuring, npm publication, deployment, or provider changes.

## Verification

Run only focused typecheck/build and directly affected CLI/configurator tests plus an active-reference search.
