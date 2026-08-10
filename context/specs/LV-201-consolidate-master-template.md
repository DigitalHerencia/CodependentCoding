---
id: LV-201
title: Consolidate the Loaded Vibes master template
status: ready
type: implementation-spec
order: 1
depends_on: []
issue_title: "Consolidate the one repository-owned master template"
---

# LV-201 — Consolidate the Loaded Vibes master template

## Outcome

Make `template/` the single canonical application source in Loaded Vibes while preserving the working maximal application that already exists.

## Starting state

The repository currently owns the application source but still stores it as `templates/golden`, with additional source duplicated under `templates/modules`.

This is a migration structure.

## Read

- `context/docs/template.md`
- `context/docs/architecture.md`
- `context/docs/repository-transition.md`
- `.agents/contracts/architecture.yaml`
- `.agents/contracts/transition.yaml`
- relevant canonical Hipster Stack notes in DevNotes

## Scope

- move the canonical maximal application from `templates/golden` to `template/`;
- merge real repository-owned optional source currently living only in `templates/modules` into the maximal template before deleting duplicate source;
- preserve the template's working internal application architecture rather than reorganizing it for aesthetics;
- update template-relative code and package references required only by this move;
- replace stale template provenance that names a previous external application source;
- keep all provider secrets absent.

## Non-goals

- do not redesign the generator composition model yet beyond what is required for the template move;
- do not redesign the website;
- do not rewrite CLI prompts;
- do not add new optional providers or routes;
- do not add tests or validation systems.

## Likely affected areas

```text
templates/golden/**
templates/modules/**
template/**
package.json
packages/core/** template-path references
scripts/** template-path references
README/context references required by the move
```

## Acceptance

- one complete maximal application exists at `template/`;
- there is no second source-of-truth application tree;
- no supported source is lost merely because it previously lived in a module overlay;
- local generation code can locate the new template path;
- the change does not reintroduce any dependency on `DigitalHerencia/Vibes`;
- template internals remain recognizable and working rather than being gratuitously reorganized.

## Verification

Use only existing checks directly relevant to template materialization/path changes. Do not create new tests or validators.

## GitHub Issue body

Use this spec as the Issue body or link it directly. Keep the implementation PR focused on template ownership and relocation.
