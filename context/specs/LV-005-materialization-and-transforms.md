---
id: LV-005
title: Materialize canonical template and apply structured transformations
status: ready-for-issue
depends_on: [LV-001, LV-002, LV-004]
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

# LV-005: Materialize canonical template and apply structured transformations

## Outcome

Create the target tree from the canonical template without architectural drift.

## Scope

Copy planned paths to staging; apply exclusions; perform structured identity transforms; write provenance; preserve governance/tests/architecture; ensure generator runtime does not leak into generated runtime; promote completed structural output.

## Acceptance criteria

- output file set matches plan;
- structured files are edited structurally;
- no blind rename mutates domain/security/provider nouns;
- generator/template-maintenance files are absent;
- generated runtime does not depend on `create-loaded-vibes`;
- repeat generation is structurally deterministic.

## Required validation and evidence

Run file-plan comparison, transform tests, governance/config parse checks, repeat-generation diff, and exclusion tests.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
