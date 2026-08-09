---
id: LV-006
title: Implement install Git initialization and generated-project acceptance lifecycle
status: ready-for-issue
depends_on: [LV-003, LV-004, LV-005]
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

# LV-006: Implement install Git initialization and generated-project acceptance lifecycle

## Outcome

Turn structurally generated output into a runnable accepted project and report lifecycle phases truthfully.

## Scope

Default path: check pnpm/corepack, install dependencies, generate required artifacts, run generated `pnpm validate:ci`, initialize Git unless disabled, report handoff. Implement `--skip-install` as generated-but-unvalidated.

## Acceptance criteria

- subprocesses use argv APIs;
- install and generation failures are distinct;
- required acceptance validation actually runs by default;
- failed validation never gets accepted-success wording;
- skip-install prints exact remaining commands;
- no-git does not alter app content except Git metadata;
- Git failure is reported separately.

## Required validation and evidence

Run lifecycle unit tests, clean E2E generation, skip-install, no-git, forced install failure, forced validation failure, and successful generated `pnpm validate:ci`.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
