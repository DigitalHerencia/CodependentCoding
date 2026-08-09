---
id: LV-008
title: Build generator and generated-output CI matrix
status: ready-for-issue
depends_on: [LV-003, LV-004, LV-005, LV-006, LV-007]
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

# LV-008: Build generator and generated-output CI matrix

## Outcome

Prove both the generator and representative repositories it creates.

## Scope

Create repository-owned scripts and GitHub Actions for generator format/lint/type/test/build/determinism/rollback plus real CLI generation, install, generated artifacts, `pnpm validate:ci`, and production build through the generated gate.

## Acceptance criteria

- CI invokes repository scripts rather than duplicating logic;
- generated tests use the real CLI;
- default, non-interactive, dry-run, skip-install, no-git scenarios are covered;
- failure logs do not leak secrets;
- evidence is tied to current revision.

## Required validation and evidence

Run complete local validation where practical and GitHub Actions. Attach workflow links and exact commands.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
