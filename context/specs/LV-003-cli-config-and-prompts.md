---
id: LV-003
title: Implement CLI entrypoint prompts and non-interactive configuration
status: ready-for-issue
depends_on: [LV-002]
sources:
  - context/docs/prd.md
  - context/docs/tech-req.md
  - context/docs/architecture.md
  - context/docs/design.md
  - context/docs/auth.md
contracts:
  - .agents/contracts/product.yaml
  - .agents/contracts/architecture.yaml
  - .agents/contracts/validation.yaml
---

# LV-003: Implement CLI entrypoint prompts and non-interactive configuration

## Outcome

Implement the real `create-loaded-vibes` command surface with interactive and non-interactive paths using the same config model.

## Scope

Implement target argument, project name, `--yes`, `--config`, `--no-git`, `--skip-install`, `--dry-run`, `--help`, `--version`, concise supported prompts, cancellation, and non-TTY behavior.

## Acceptance criteria

- equivalent interactive/flag/config inputs normalize identically;
- no prompt exposes stack/architecture/security choices;
- help documents only supported surface;
- cancellation before generation leaves no target/staging output;
- dry-run uses the real planner and writes nothing;
- invalid config exits non-zero with stable actionable error.

## Required validation and evidence

Run parser, prompt-adapter, non-interactive, dry-run, cancellation, help, and version tests. Attach representative outputs.

## Non-goals

- Do not widen scope into unrelated architecture or product features.
- Do not weaken existing validation to obtain a pass.
- Do not claim unexecuted checks as evidence.
