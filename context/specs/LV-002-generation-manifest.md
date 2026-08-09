---
id: LV-002
title: Define deterministic generation manifest and config contract
status: ready-for-issue
depends_on: [LV-001]
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

# LV-002: Define deterministic generation manifest and config contract

## Outcome

Define the machine-owned contract that turns supported intent into a deterministic generation plan.

## Scope

- implement versioned `LoadedVibesConfig`;
- defaults and normalization;
- canonical `standard` preset;
- generation-plan representation;
- copied/excluded path manifest;
- stable `.loaded-vibes.json` provenance;
- reject unknown/unsupported config before writes;
- exclude volatile timestamps from deterministic output.

## Acceptance criteria

- prompts/flags/config target the same normalized schema;
- identical normalized config + template revision yields equivalent plans;
- unsupported combinations fail before mutation;
- provenance includes generator/template/preset/module identity and no secrets;
- manifest separates fixed invariants from supported variability.

## Required validation and evidence

Run schema, normalization-equivalence, unknown-field, deterministic-plan, and provenance tests. Attach normalized config and repeat-plan comparison.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
