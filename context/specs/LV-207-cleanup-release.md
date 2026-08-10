---
id: LV-207
title: Remove migration debris and prepare the coherent release
status: ready
type: implementation-spec
order: 7
depends_on: [LV-201, LV-202, LV-203, LV-204, LV-205, LV-206]
issue_title: 'Clean the Loaded Vibes repo and prepare the one-template release'
---

# LV-207 — Remove migration debris and prepare the coherent release

## Outcome

Finish the migration by deleting stale architecture and ensuring the repository, docs, web, CLI, package, and governance all describe the same product.

## Starting state

Earlier specs deliberately preserve compatibility structures until their replacements are working. This Issue removes what is no longer needed.

## Read

- `context/docs/repository-transition.md`
- `context/docs/release.md`
- `context/docs/product.md`
- `.agents/contracts/transition.yaml`
- current implementation and package state

## Scope

- remove obsolete `packages/recipes` if not already removed;
- remove obsolete `templates/golden` and `templates/modules` after `template/` fully owns the source;
- remove obsolete sync/provenance language and code tied to Vibes;
- remove dead module-era configuration/code with no remaining caller;
- remove completed LV-101 through LV-110 specs from the active specs directory once LV-201+ governance is adopted;
- update README, manifests, package files, and governance to the final tree;
- remove stale migration comments that would mislead future Codex work;
- report any remaining external gates honestly.

## Non-goals

- no unrelated architecture renovation;
- no feature expansion;
- no provider-account setup;
- no deployment unless separately requested;
- no new tests or validation systems.

## Acceptance

- the repository has one template source at `template/`;
- active packages are `cli`, `core`, and `schema` unless an actually required package remains with a documented reason;
- no normal generation, packaging, docs, or governance depends on `DigitalHerencia/Vibes`;
- website routes and docs match the shipped product;
- active governance contains only current instructions;
- package/release status is reported without invented evidence.

## Verification

Run only the existing release/package checks necessary to prove the final package and web build after the migration. Do not add new tests, validators, or a broader audit.
