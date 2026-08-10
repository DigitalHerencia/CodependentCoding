---
id: LV-206
title: Polish the CLI and package around the final model
status: ready
type: implementation-spec
order: 6
depends_on: [LV-202, LV-203]
issue_title: 'Polish Loaded Vibes CLI and package for the one-template model'
---

# LV-206 — Polish the CLI and package around the final model

## Outcome

Make the CLI and package describe and ship the final one-template product cleanly.

## Starting state

The root package is currently `create-loaded-vibes`, exposes both `create-loaded-vibes` and `loaded-vibes` bins, and publishes `templates`.

## Read

- `context/docs/generator-cli.md`
- `context/docs/release.md`
- `context/docs/repository-transition.md`
- `.agents/contracts/product.yaml`
- `.agents/contracts/transition.yaml`

## Scope

- make `loaded-vibes` the clearly documented canonical command;
- update CLI copy/prompts to the final configuration vocabulary;
- update package contents from legacy `templates` paths to `template/`;
- preserve a compatibility alias only if it still prevents real breakage and is cheap to keep;
- keep `create`, supported `add`, `explain`, `doctor`, and version behavior aligned with the shared core;
- update generated handoff text and README references;
- do not claim an npm package rename/publication has occurred unless it actually has.

## Non-goals

- do not publish to npm unless separately authorized;
- do not add commands merely for completeness;
- do not turn doctor into a validation suite;
- do not add new tests or validators.

## Acceptance

- CLI terminology matches the one-template product;
- package contents include the correct template path required for local generation;
- the canonical command is unambiguous;
- compatibility behavior is intentional and documented;
- local generation remains self-contained.

## Verification

Use existing package/build/smoke checks only because this Issue changes packaging. Do not add new checks.
