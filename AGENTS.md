# Loaded Vibes Agent Instructions

Loaded Vibes is an opinionated SaaS project generator. It creates a deterministic golden SaaS prototype from a governed canonical template. It does not invent application architecture during initialization.

Keep this file short. It is a map to governing sources, not an encyclopedia.

## Read before editing

1. Read the active GitHub Issue/specification.
2. Read `context/README.md`.
3. Read the controlling files in `context/docs/`.
4. Read the active file in `context/specs/`.
5. Read `.agents/contracts/product.yaml`, `architecture.yaml`, and `validation.yaml`.
6. Inspect affected source, tests, package configuration, template files, and current branch state.
7. Read nested `AGENTS.md` files for any directory you modify.

## Authority

1. explicit current user instruction;
2. current canonical DevNotes source-of-truth;
3. canonical Codependent Coding Knowledge System / Hipster Stack doctrine;
4. `context/docs/`;
5. approved active `context/specs/`;
6. `.agents/contracts/`;
7. implementation and tests as evidence;
8. `.agents/execution/`;
9. comparative generator references;
10. deprecated LoadedVibes material.

Resolve contradictory governing sources before implementation.

## Product boundary

Loaded Vibes is a create-project product, not a generic framework or architecture wizard.

```text
CLI collects bounded intent.
Config normalizes intent.
Preflight protects the filesystem.
Generator plans deterministic output.
Template supplies the canonical application.
Transforms apply approved product variability.
Lifecycle installs, initializes, and validates.
Generated governance constrains downstream agents.
Evidence determines completion.
```

Generated applications retain the canonical grammar:

```text
Routes adapt.
Features orchestrate.
Components render.
Fetchers read.
Actions write.
Schemas validate.
Authorization decides.
Transactions preserve invariants.
Webhooks reconcile external truth.
```

## Implementation rules

- Implement one approved spec/Issue outcome at a time.
- Prefer the smallest complete change that satisfies acceptance criteria.
- Do not generalize a plugin/module framework before an approved module contract requires it.
- Normalize prompts, CLI flags, and config-file input through one versioned configuration model.
- Identical supported configuration and template revision must produce equivalent project output.
- Never let configurable choices disable fixed architecture, security, tenancy, validation, or governance invariants.
- Generate into a safe staging location and clean up failed partial generation.
- Never overwrite a non-empty destination in V1.
- Never collect, print, persist, or commit provider secrets.
- Do not auto-provision or deploy external resources unless an approved spec explicitly adds that capability.
- Treat Windows/PowerShell path behavior as first-class compatibility.
- Prevent canonical template/source drift mechanically.

## Validation and evidence

Run the narrowest relevant checks while iterating and every gate required by the active spec before completion.

Evidence states:

- `executed`: actually ran, with result and revision;
- `skipped`: intentionally not run;
- `blocked`: prerequisite prevented execution;
- `inferred`: inspection/reasoning only.

Only executed evidence may be reported as passed or failed.

Never weaken, delete, or bypass a failing gate to obtain green output.

## Delivery

- Use reviewable branches and PRs.
- Link the Issue/spec in the PR.
- Update docs/contracts when a public boundary changes.
- Update `.agents/execution/decisions.json`, `progress.json`, and `handoff.json` accurately.
- Report exact commands executed and their results.
- Do not claim generation, packaging, publication, deployment, or provider configuration without executed evidence.
