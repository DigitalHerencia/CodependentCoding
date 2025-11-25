# Loaded Vibes Framework

This workspace contains everything required to _author_ the Loaded Vibes framework while keeping the **development environment** separate from the **shipped package** that customers install through `npx create-loaded-vibes` or the retro `loaded-vibes` CLI.

## 1. The Loaded Vibes Development Environment

The active development environment for Loaded Vibes is located at:
`D:\LoadedVibes`

Use these folders when you are improving the framework itself:

- `.github/` – Stack-specific Copilot instructions and governance for the development environment.
- `.vscode/` – Editor settings and extension recommendations scoped only to the framework authoring workspace.
- `docs/` – Architecture references, PRD, Tech Requirements, and developer guides.
- `templates/` – Reference files and templates used for developing the framework (not shipped directly).

### 1.1 Spec-Driven Workflow Artifacts

- `docs/PRD.md` – Consolidated product requirements, including CLI experience and distribution rules.
- `docs/TECH_REQUIREMENTS.md` – Consolidated technical, automation, manifest, and CLI implementation guidance.
- `TODO.md` & `CHANGELOG.md` – Rolling execution evidence that every DevCycle must update.
- `SUPPORT.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS`, `LICENSE` – Governance artifacts referenced by the PRD and Tech Requirements.

## 2. The Loaded Vibes Framework (Shipped Product)

Assets that are shipped with the Loaded Vibes project are in the following directory:
`D:\LoadedVibes\lv_artifacts\**`

This directory mirrors the files that get copied to the user's development environment (released under `.loaded-vibes/**` by the CLI). It includes:

- `lv_artifacts/.github/` – Agents, instructions, prompts, and toolsets for the end user.
- `lv_artifacts/.vscode/` – Settings, extensions, and MCP config for the end user.
- `lv_artifacts/docs/` – End-user documentation.
- `lv_artifacts/genaiscript/` – The core framework engine (orchestrator and tools) that runs in the end user's environment.
- `lv_artifacts/scripts/` – Bootstrapper scripts.
- `lv_artifacts/src/` – The output directory for generated user projects.

**Note:** `lv_artifacts` should be treated as the "shipped product". Do not use these files to configure the _framework's_ development environment—use `.github/` and `.vscode/` in this workspace instead.

## 3. End User Project Files

Loaded Vibes generates all assets for the end user inside:
`D:\LoadedVibes\lv_artifacts\src`

- These files are the output of the framework.
- They belong to the end user's application.
- They must **not** influence the Loaded Vibes development environment.
- The IDE should ignore `lv_artifacts/src` for linting and configuration purposes.

## Summary of Separation

| Scope               | Directory           | Purpose                                                                                      |
| :------------------ | :------------------ | :------------------------------------------------------------------------------------------- |
| **Dev Environment** | `D:\LoadedVibes`    | Where we build the framework. Configured by root `.vscode`, `.github`, `docs`, `templates`.  |
| **Shipped Product** | `lv_artifacts/`     | The artifacts delivered to users. Contains its own `.github`, `.vscode`, `genaiscript`, etc. |
| **User Project**    | `lv_artifacts/src/` | The generated application code. Ignored by framework tooling.                                |

## 4. Retro CLI Quickstart

1. Run `npx create-loaded-vibes my-app` (or `--attach ./existing`) to download the latest signed release and mirror `lv_artifacts/**` into `.loaded-vibes/`.
2. Allow the installer to run `loaded-vibes init`, which configures MCP endpoints, VS Code profile files, and Git hooks per the Tech Requirements.
3. Launch `loaded-vibes dashboard` to open the synthwave console with DevCycle queue, live logs, diagnostics, and TODO/CHANGELOG feeds.
4. Use `loaded-vibes devcycle <name>` to stream orchestrator events (Analyze → Handoff) with built-in pause/resume checkpoints and Bad Vibes Firewall prompts for risky actions.

Refer to `docs/PRD.md` §5 and `docs/TECH_REQUIREMENTS.md` §§5–10 whenever CLI behavior needs to change.
