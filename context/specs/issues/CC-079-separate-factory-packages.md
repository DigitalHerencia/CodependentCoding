---
id: CC-079
title: "Separate factory packages from the shippable SaaS template"
type: refactor
area: template
priority: p1
size: l
depends_on: []
status: done
issue: 361
---

# CC-079 · Separate factory packages from the shippable SaaS template

Approved by the owner's explicit instruction on 2026-11-05. Dependencies: none.

## Scope

- Label and place non-website products under `packages/`: CLI, TUI, generator, Loaded Vibes and Maximal Template.
- Generator owns composition, module catalog/schema, environment generation and initial provisioning.
- Loaded Vibes owns editing engines, doctrine enforcement, agent/governance assets and database lifecycle tools.
- The template contains the shippable white-label SaaS application, application configuration and application tests only. No factory manifests, scripts, governance, ESLint doctrine implementation or factory tests.
- Generated app editing metadata lives in `.loaded-vibes/`; it is created by tooling, never stored in the application template.
- Preserve the existing feature, authorization and validation contracts, and pre-existing component/dependency changes.

## Acceptance criteria

- Each product has a labeled package and its consumers reference its new owner.
- Template package boundary regression rejects factory assets and commands.
- New/compose, add, slice and doctor operate through their new engines; generated apps do not need copied factory scripts.
- Loaded Vibes can run manifest, ownership, environment, doctrine and database lifecycle operations against an explicit application directory.
- Website content loading, CLI/TUI, marketplace discovery, hooks, CI and documentation reference the new layout.
- Affected static checks and focused behavior tests have fresh recorded evidence. No servers, full suites, builds, migrations or deployments are run locally.

## Validation

Run the package-boundary regression, focused generator/editor tests, affected-file formatting/lint, and affected TypeScript checks. Record exact results and any unavailable dependency or owner-verification blockers in execution records.

## Owner delivery override

Owner directed stopping further testing, including all current changes and merging directly to local main without a PR, followed by branch deletion. Executed checks and preserved baseline failures are recorded under CC-079 in progress.json.
