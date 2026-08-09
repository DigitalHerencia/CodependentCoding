# LV-102 — Product presets and capability resolver

## Outcome

Users choose product outcomes and capabilities; the generator resolves implementation prerequisites.

## Scope

- implement initial presets: B2B SaaS, client portal, platform/marketplace, bare golden app;
- implement a repository-owned capability registry;
- support `requires` and `conflicts` resolution;
- merge preset defaults with explicit recipe overrides;
- expose a clear resolved-build summary to CLI/web callers.

## Acceptance

- preset selection produces a normalized resolved recipe;
- selecting a dependent capability automatically includes its prerequisites;
- unsupported/conflicting combinations fail with useful messages;
- presets share one generation engine rather than forked templates.
