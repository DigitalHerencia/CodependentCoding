---
id: LV-004
title: Implement safe destination preflight and staging lifecycle
status: ready-for-issue
depends_on: [LV-002]
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

# LV-004: Implement safe destination preflight and staging lifecycle

## Outcome

Protect the filesystem before generation begins.

## Scope

Normalize targets; validate project/package names; reject dangerous roots and non-empty destinations; detect traversal/symlink escape; create run-owned sibling staging; implement idempotent cleanup; cover Windows paths/spaces/parentheses.

## Acceptance criteria

- invalid targets are never mutated;
- cleanup deletes only run-owned paths;
- occupied destinations remain untouched;
- Windows/POSIX path rules behave correctly;
- failed structural generation is never promoted.

## Required validation and evidence

Run path/name unit tests, occupied-target integration, escape tests where supported, cleanup interruption tests, and Windows path fixtures.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
