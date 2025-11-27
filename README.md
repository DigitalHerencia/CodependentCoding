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
`D:\LoadedVibes\dist\**`

This directory mirrors the files that get copied to the user's development environment (released under `.loaded-vibes/**` by the CLI). It includes:

- `dist/.github/` – Agents, instructions, prompts, and toolsets for the end user.
- `dist/.vscode/` – Settings, extensions, and MCP config for the end user.
- `dist/docs/` – End-user documentation.
- `dist/genaiscript/` – The core framework engine (orchestrator and tools) that runs in the end user's environment.
- `dist/scripts/` – Bootstrapper scripts.
- `dist/src/` – The output directory for generated user projects.

**Note:** `dist` should be treated as the "shipped product". Do not use these files to configure the _framework's_ development environment—use `.github/` and `.vscode/` in this workspace instead.

## 3. End User Project Files

Loaded Vibes generates all assets for the end user inside:
`D:\LoadedVibes\dist\src`

- These files are the output of the framework.
- They belong to the end user's application.
- They must **not** influence the Loaded Vibes development environment.
- The IDE should ignore `dist/src` for linting and configuration purposes.

## Summary of Separation

| Scope               | Directory        | Purpose                                                                                      |
| :------------------ | :--------------- | :------------------------------------------------------------------------------------------- |
| **Dev Environment** | `D:\LoadedVibes` | Where we build the framework. Configured by root `.vscode`, `.github`, `docs`, `templates`.  |
| **Shipped Product** | `dist/`          | The artifacts delivered to users. Contains its own `.github`, `.vscode`, `genaiscript`, etc. |
| **User Project**    | `dist/src/`      | The generated application code. Ignored by framework tooling.                                |

## 4. Retro CLI Quickstart

1. Run `npx create-loaded-vibes my-app` (or `--attach ./existing`) to download the latest signed release and mirror `dist/**` into `.loaded-vibes/`.
2. Allow the installer to run `loaded-vibes init`, which configures MCP endpoints, VS Code profile files, and Git hooks per the Tech Requirements.
3. Launch `loaded-vibes dashboard` to open the synthwave console with DevCycle queue, live logs, diagnostics, and TODO/CHANGELOG feeds.
4. Use `loaded-vibes devcycle <name>` to stream orchestrator events (Analyze → Handoff) with built-in pause/resume checkpoints and Bad Vibes Firewall prompts for risky actions.

Refer to `docs/PRD.md` §5 and `docs/TECH_REQUIREMENTS.md` §§5–10 whenever CLI behavior needs to change.

## 5. Dashboard Command

The retro synthwave dashboard provides a unified view of your DevCycle workflow with live updates:

```
node dist/cli/commands/dashboard.js
```

### Dashboard Features (PRD §5.2)

- **ASCII Masthead**: Gradient-styled "LOADED VIBES" banner using figlet + gradient-string
- **DevCycle Queue**: Shows all 18 DevCycles with status indicators (○ pending, ▶ running, ✓ done, ✗ failed)
- **Live Logs**: Streams NDJSON log entries from `.loaded-vibes/logs/*.ndjson` with severity icons
- **System Metrics**: CPU and memory usage with visual progress bars (updates every 2s)
- **TODO/CHANGELOG Feed**: Recent TODO items and CHANGELOG entries from project root
- **Notifications**: Toast-style alerts for dashboard events
- **Command Palette**: Fuzzy search via Ctrl+P (uses fuse.js)

### Keyboard Controls

| Key            | Action                              |
| -------------- | ----------------------------------- |
| `Ctrl+P`       | Open command palette (fuzzy search) |
| `r`            | Refresh dashboard data              |
| `l`            | Toggle live log streaming           |
| `h` / `?`      | Show keyboard shortcuts help        |
| `q` / `Ctrl+C` | Quit dashboard                      |

### Performance Target

Dashboard updates are throttled to <200ms to meet PRD §6 latency requirements.

## 6. DevCycle Command

Run DevCycles manually from the shipped assets while keeping requirement traceability:

- Usage: `node dist/cli/devcycle.js <devcycle> --mode plan-first --task "ticket-123"` (supports `--dry-run`, `--skip-bootstrap`, `--auto-approve`, `--verbose`, `--list`).
- Validates `dist/genaiscript/devcycles.config.json` plus prompt/instruction/toolset references before execution (TECH §4.1).
- Streams Analyze → Reflect NDJSON events with requirement IDs, checkpoint approvals, and Bad Vibes Firewall notices inline (SPEC-CLI §1, PRD §5.2, §5.5).
- Suggests nearest manifest entries when the name is misspelled and surfaces the default mode/tooling for the selected DevCycle.

## 7. Logs Command

Inspect NDJSON traces stored in `.loaded-vibes/logs/*.ndjson` per Tech Requirements 5.3 (use `ts-node` or the compiled CLI binary in packaged releases):

- Show latest entries: `node dist/cli/commands/logs.ts`
- Filter by DevCycle/time/severity: `node dist/cli/commands/logs.ts --devcycle <id> --since <iso> --severity warn,error`
- Stream updates: add `--follow` to tail new NDJSON lines as they are written.
- Export a Markdown snapshot referencing requirement IDs: `node dist/cli/commands/logs.ts --export .loaded-vibes/logs/export.md`

## 8. Telemetry Export Command

Convert NDJSON telemetry logs into sanitized JSON or Markdown snapshots for audits and PR attachments.

- Usage: `loaded-vibes telemetry export --format json|markdown [--devcycle <id>] [--since <iso>]`
- Defaults to reading `.loaded-vibes/logs/*.ndjson` and writing to `.loaded-vibes/telemetry/exports/telemetry-<timestamp>.json|md`.
- JSON exports power CI integrations and dashboards; Markdown mirrors ADR-0001 dual-mode guidance for reviewer-friendly diffs.
- All exports pass through the secret redaction pipeline (SPEC-SECURITY §2) and cite relevant PRD/TECH requirement IDs.

## 9. CI Workflows

The repository includes automated CI checks to validate framework governance:

### Manifest Validation

The `manifest-validation.yml` workflow verifies that all DevCycle entries in `dist/genaiscript/devcycles.config.json` resolve to valid files:

- **Trigger:** Push/PR changes to manifest file or any prompt/instruction/toolset files
- **Validation:** For each of the 18 DevCycles, checks that `instructions`, `toolset`, and `prompt` file references exist
- **Output:** Lists all validated DevCycles with detailed error messages for any missing files
- **References:** TECH_REQUIREMENTS §7, SPEC-ARTIFACTS §3

### Settings Guard

The `settings-guard.yml` workflow ensures VS Code settings only reference development-layer assets:

- **Trigger:** Push/PR changes to `.vscode/settings.json`
- **Validation:** Blocks instruction references to `dist/**` shipped assets
- **References:** PRD §4.3, SPEC-ARCH §3, Tech Requirements §11
