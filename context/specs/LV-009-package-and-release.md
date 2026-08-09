---
id: LV-009
title: Package and prove create-loaded-vibes through the real consumer path
status: ready-for-issue
depends_on: [LV-008]
sources:
  - context/docs/prd.md
  - context/docs/tech-req.md
  - context/docs/architecture.md
  - context/docs/design.md
  - context/docs/auth.md
contracts:
  - .agents/contracts/product.yaml
  - .agents/contracts/architecture.yaml
  - .agents/contracts/validation.yaml
---

# LV-009: Package and prove create-loaded-vibes through the real consumer path

## Outcome

Prove the npm package users execute behaves like repository development and contains only intended runtime/template assets.

## Scope

Configure bin/exports/files/build/versioning; create tarball; inspect contents; secret-scan; execute packed package in isolation; generate default project; run generated acceptance; document release procedure.

## Acceptance criteria

- package contains CLI runtime and canonical template;
- excludes caches, credentials, reports, maintainer-only/test-only junk;
- packed-package execution succeeds;
- generated project passes `pnpm validate:ci`;
- provenance records package version;
- publication is not claimed unless executed.

## Required validation and evidence

Run build, pack inspection, packed E2E, secret scan, and generated acceptance. Attach tarball manifest and results.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
