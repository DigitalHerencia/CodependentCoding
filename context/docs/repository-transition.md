---
title: Loaded Vibes Repository Transition
artifact: repository-transition
status: complete
product: Loaded Vibes
authority: source-of-truth
baseline_revision: 1479a4a1ef14dccf429e9fbaf5f1097e639a2914
observed: 2026-08-09
---

# Loaded Vibes Repository Transition

## Final state

The LV-201 through LV-207 migration is complete. The repository owns one executable template, one shared configuration model, one deterministic generator, a canonical CLI, a stateless website, and one end-user documentation source.

## Repository structure

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

## Final ownership

- `template/` is the sole complete application source.
- `packages/schema` owns the shared contract.
- `packages/core` owns normalization, dependency resolution, ownership, transforms, generation, and diagnostics.
- `packages/cli` adapts the core to the canonical `loaded-vibes` command.
- `apps/web` provides `/`, `/configure`, and `/docs` without accounts or hosted generation.
- `docs/` is the canonical end-user source.

The npm package remains named `create-loaded-vibes` until an authorized publication decision changes it. It exposes `loaded-vibes` as the canonical command and keeps `create-loaded-vibes` as a compatibility initializer alias.

Git history preserves the migration. Removed transitional layouts and completed LV-101 through LV-110 specs are not active architecture.
