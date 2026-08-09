---
id: LV-001
title: Freeze canonical Vibes template inside LoadedVibes
status: ready-for-issue
depends_on: []
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

# LV-001: Freeze canonical Vibes template inside LoadedVibes

## Outcome

Establish `template/` as the one canonical source used for generated SaaS output, based on the approved Vibes revision.

## Scope

- inventory Vibes at the approved source revision;
- classify every artifact as `core`, `optional`, `reference`, `workbench-only`, or `template-maintenance`;
- import canonical application material into `template/`;
- exclude Git history, secrets/caches, reports, and consumer-irrelevant maintenance artifacts;
- record provenance;
- make the template independently installable and acceptance-testable;
- prevent any second golden fixture from becoming a competing template.

## Acceptance criteria

- every Vibes artifact has an intentional disposition;
- `template/` contains the complete canonical base output;
- template versions/tooling are pinned as required;
- clean credential-free `pnpm validate:ci` succeeds;
- secret/security scan passes for template input;
- provenance identifies the absorbed Vibes revision;
- deprecated LoadedVibes code is not treated as a coequal source.

## Required validation and evidence

Run clean install, Prisma generation/validation, `pnpm validate:ci`, security scan, and source-disposition coverage. Attach revision, counts, commands, and any doctrine-vs-Vibes reconciliation.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
