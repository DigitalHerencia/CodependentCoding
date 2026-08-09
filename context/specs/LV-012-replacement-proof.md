---
id: LV-012
title: Prove Vibes absorption and LoadedVibes replacement readiness
status: ready-for-issue
depends_on: [LV-009, LV-011]
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

# LV-012: Prove Vibes absorption and LoadedVibes replacement readiness

## Outcome

Produce evidence that LoadedVibes fully owns the canonical generator/template role and standalone Vibes is no longer the only home of any canonical artifact.

## Scope

Compare Vibes source dispositions; generate through real packed CLI; run complete credential-free acceptance; verify no canonical artifact exists only in Vibes; verify deprecated LoadedVibes architecture is not current; scan docs/references for reality.

## Acceptance criteria

- source-to-successor unresolved canonical count is zero;
- real generator and packed-package paths pass;
- generated default passes `pnpm validate:ci`;
- provenance/docs identify LoadedVibes as owner;
- remaining Vibes references are historical/provenance only or deliberate.

## Required validation and evidence

Run coverage/disposition checker, packed CLI generation, generated acceptance, reference/link scan, and security checks. Attach counts and blockers. This spec proves readiness; deletion remains a separately authorized cross-system operation.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
