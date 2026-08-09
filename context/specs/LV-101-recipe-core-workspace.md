# LV-101 — Shared recipe core and workspace

## Outcome

Create the real shared foundation needed by both CLI and web without discarding useful existing generator behavior.

## Scope

- migrate toward `apps/web`, `packages/cli`, `packages/core`, `packages/recipes`, `packages/schema`;
- move existing create/config/planner/materializer behavior into the appropriate reusable boundaries;
- define the versioned recipe schema and normalized recipe type;
- keep the create command working during the migration;
- make `packages/core` independent of terminal and Next.js UI.

## Acceptance

- CLI can consume the shared core;
- a non-CLI consumer can construct/normalize a recipe without importing terminal code;
- current basic project creation remains available;
- no product feature is added solely to justify the workspace.

## Non-goals

Presets beyond the minimum schema, module composition, web UI, broad test renovation.
