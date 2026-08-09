---
id: LV-007
title: Ship downstream human and machine governance in every generated project
status: ready-for-issue
depends_on: [LV-005]
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

# LV-007: Ship downstream human and machine governance in every generated project

## Outcome

Ensure every generated repo contains governance required by Codex and Codependent Coding.

## Scope

Verify/adapt generated root `AGENTS.md`, `context/`, `.agents/contracts/`, `.agents/execution/`, architecture/contract validators, tests, and provenance.

## Acceptance criteria

- downstream agents can identify authority and validation from root `AGENTS.md`;
- no LoadedVibes-maintainer-only instructions leak into generated governance;
- machine contracts parse and match architecture;
- execution files start truthfully empty/not-started;
- governance validation is in CI;
- operational doctrine copies declare provenance and do not replace DevNotes authority.

## Required validation and evidence

Run generated governance parse/link checks, `pnpm governance:validate`, `pnpm architecture:validate`, and real-output file-presence tests.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
