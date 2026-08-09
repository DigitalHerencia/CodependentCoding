---
title: Loaded Vibes CLI and Developer Experience Design
artifact: design
status: approved-governance
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes CLI and Developer Experience Design

## 1. Design principle

Loaded Vibes should feel simpler than the system it creates.

The initializer exposes only legitimate product variability. Architectural machinery stays invisible unless failure evidence makes it relevant.

## 2. Commands

Primary:

```text
pnpm dlx create-loaded-vibes@latest my-saas
```

Non-interactive defaults:

```text
pnpm dlx create-loaded-vibes@latest my-saas --yes
```

Config driven:

```text
pnpm dlx create-loaded-vibes@latest my-saas --config ./loaded-vibes.config.json
```

Plan only:

```text
pnpm dlx create-loaded-vibes@latest my-saas --dry-run
```

## 3. Interactive prompts

V1 prompting stays short:

1. project name/destination when missing;
2. confirmation of canonical `standard` preset;
3. only currently supported optional capabilities;
4. initialize Git? default yes;
5. install and validate? default yes.

Never ask users to choose framework, ORM, auth provider, tenancy model, RBAC/RLS strategy, route architecture, test stack, formatter/linter, or deployment architecture.

## 4. Lifecycle presentation

Report high-level phases:

```text
Checking destination
Planning project
Creating project
Applying configuration
Installing dependencies
Generating artifacts
Validating project
Initializing Git
Done
```

Failures identify the phase, stable error class, target state, and next safe action.

Do not dump stack traces by default.

## 5. Success output

Validated success reports:

- target path;
- generator version;
- template revision/preset;
- enabled optional modules;
- validation gate executed and passed;
- Git initialization result;
- next command;
- environment/setup docs to read.

Do not advertise deployment/provider state that was not created.

## 6. Partial success

With `--skip-install`, report clearly:

```text
Project generated.
Dependencies were not installed.
Acceptance validation was not executed.

Run:
  pnpm install
  pnpm validate:ci
```

Do not use validated-success wording.

## 7. Dry run

`--dry-run` writes nothing and uses the real planner.

Display:

- target;
- normalized name;
- preset/modules;
- template revision;
- major exclusions/transforms;
- install/git behavior;
- required validation.

## 8. Stable error classes

At minimum:

- `INVALID_PROJECT_NAME`;
- `UNSAFE_TARGET`;
- `TARGET_NOT_EMPTY`;
- `INVALID_CONFIG`;
- `UNSUPPORTED_CONFIGURATION`;
- `TEMPLATE_INVALID`;
- `COPY_FAILED`;
- `TRANSFORM_FAILED`;
- `INSTALL_FAILED`;
- `VALIDATION_FAILED`;
- `GIT_INIT_FAILED`.

Messages must be specific, actionable, testable, and secret-safe.

## 9. Cancellation

Cancellation before materialization leaves no target.

Cancellation during generation uses the same safe cleanup path as failure.

No unexplained staging directories.

## 10. Cross-platform behavior

Windows/PowerShell is first-class.

- use `path` APIs;
- use argv subprocess execution;
- test spaces and parentheses;
- avoid Unix-only runtime cleanup;
- validate packaged executable/bin behavior;
- avoid Bash-specific instructions in CLI output.

## 11. Maintainer workflow

1. update canonical `template/`;
2. run its acceptance gate;
3. run generator validation;
4. run generated-output matrix;
5. inspect packed npm artifact;
6. release.

Evidence must distinguish generator correctness from template/output correctness.

## 12. GitHub Issue and Codex workflow

Each `context/specs/LV-###` file maps to one coherent GitHub Issue/Codex task.

Issues preserve:

- spec ID/title;
- outcome;
- dependencies;
- scope;
- acceptance;
- validation;
- evidence;
- non-goals.

Do not hand Codex the whole roadmap as one coding task.

## 13. Generated agent experience

Generated root `AGENTS.md` maps agents to:

- product/technical/architecture/auth context;
- active specs;
- machine contracts;
- repository validation commands.

Use nested `AGENTS.md` only for meaningful scoped rules.

## 14. CLI accessibility

Prompting must:

- support keyboard-only use;
- provide non-interactive equivalents;
- not rely solely on color;
- work in CI/no-TTY through flags/config.

## 15. Telemetry

No telemetry in V1.

Adding telemetry requires an explicit product/security decision covering consent, payload, retention, opt-out, and documentation.
