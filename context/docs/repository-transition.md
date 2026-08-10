---
title: Loaded Vibes Repository Transition
artifact: repository-transition
status: active
product: Loaded Vibes
authority: source-of-truth
baseline_revision: 1479a4a1ef14dccf429e9fbaf5f1097e639a2914
observed: 2026-08-09
---

# Loaded Vibes Repository Transition

## Purpose

This document defines how to clean and polish the existing repository into the final one-template Loaded Vibes architecture without discarding working implementation.

It is a migration plan, not a request to rewrite the repo from scratch.

## Observed current state

At the recorded baseline:

- Loaded Vibes already declares itself the sole application-template authority.
- DevNotes is already named as the Hipster Stack doctrine authority.
- generation no longer needs `DigitalHerencia/Vibes` as a template source.
- the repository still contains `packages/recipes`.
- the repository still contains `templates/golden`.
- the repository still contains `templates/modules`.
- existing generator and `add` behavior still use module/recipe-era mechanics.
- the root package is still named `create-loaded-vibes` while exposing both `create-loaded-vibes` and `loaded-vibes` bins.
- the package publishes `templates`.
- the current web root renders the configurator directly rather than separate `/`, `/configure`, and `/docs` product surfaces.
- the completed LV-101 through LV-110 specs still describe the prior roadmap.
- there were no open Issues or PRs when this governance package was prepared.

These are current-state observations, not defects by themselves. The active specs define which of them change.

## Target state

```text
LoadedVibes/
├── apps/
│   └── web/
├── packages/
│   ├── cli/
│   ├── core/
│   └── schema/
├── template/
├── docs/
├── context/
├── .agents/
├── scripts/
├── .github/
└── AGENTS.md
```

## Transition sequence

Do the migration in dependency order:

1. consolidate the repository-owned maximal template;
2. simplify configuration/core ownership and absorb recipe data;
3. make the generator operate from the one-template ownership model;
4. split and polish website surfaces;
5. add canonical end-user docs and render them from the website;
6. polish CLI/package naming and handoff around the final model;
7. remove migration debris and ship the coherent repo.

Do not combine all seven into one giant rewrite.

## Cleanup rule

When a transitional file has no remaining caller, contract, packaging purpose, or user-facing value, remove it rather than preserving it as historical architecture.

Git history is the archive.

## Preserve rule

Do not move or rename working template internals solely to make the tree prettier.

The important repository cleanup is ownership:

```text
templates/golden  → template/
templates/modules → merged source + ownership metadata, then removed
packages/recipes  → useful defaults absorbed into schema/core, then removed
```

## Old active specs

LV-101 through LV-110 describe the completed prior roadmap. Once the new governance is adopted, they should no longer be treated as active instructions.

The final cleanup Issue may remove them from `context/specs/` after the new LV-201+ roadmap is in place. Git history preserves the completed work.

## Prohibited regression

The transition must not:

- reintroduce the Vibes repository;
- create multiple application templates;
- make web and CLI configuration diverge;
- turn optional-surface metadata into fake functionality;
- introduce a plugin framework;
- add a hosted control plane;
- add new test/validation systems as part of cleanup.
