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

## 4. Quickstart: Install & Initialize

Per `docs/PRD.md` §5.1 and `docs/TECH_REQUIREMENTS.md` §5.1, every install follows the same guarded flow regardless of whether you are starting fresh or attaching to an existing repo.

### 4.1 Fresh install

1. **Create the project:** `npx create-loaded-vibes my-app` downloads the latest signed release, validates SHA256 signatures, and mirrors `dist/**` into `.loaded-vibes/`.
2. **Run initialization:** Allow the wizard to call `loaded-vibes init`; it configures MCP endpoints, VS Code profiles, Git hooks, and replays bootstrapper checks with JSON output.
3. **Verify readiness:** Run `loaded-vibes doctor` to confirm prerequisites (Node ≥ 20, git, pnpm, GenAIScript extension) and to capture remediation hints if anything drifts.
4. **Open the dashboard:** Launch `loaded-vibes dashboard` for the synthwave UI that mirrors orchestrator status, logs, and TODO/CHANGELOG queues.
5. **Execute DevCycles:** Use `loaded-vibes devcycle <name>` (or `--list`) to run the canonical 18 DevCycles with checkpoint approvals and Bad Vibes Firewall prompts.

### 4.2 Attach an existing repository

1. From the target repo root, run `npx create-loaded-vibes --attach ./`.
2. Choose Mirror, Merge, or Sandbox strategy per ADR-001 (customization versioning) to preserve `.github`, `.vscode`, and existing `dist/**` assets.
3. Review the diff hints + approvals logged in `.loaded-vibes/logs/install-YYYYMMDD.md` before accepting file writes.
4. Finish by running `loaded-vibes doctor --auto-remediate` to reconcile MCP endpoints and manifest references.

### 4.3 What the installer provisions

- `.loaded-vibes/` mirrors the shipped payload (agents, prompts, toolsets, orchestrator, docs) and is the **only** directory the CLI writes to automatically.
- `.loaded-vibes/logs/*.ndjson` stores traceable event logs with `requirementId` fields (PRD §5.4, TECH §4.5).
- `.loaded-vibes/summaries/` captures JSON + Markdown execution summaries per ADR-0001.

Refer back to `docs/PRD.md` §5 and `docs/TECH_REQUIREMENTS.md` §§5–10 whenever you change CLI flows.

## 5. DevCycle Governance Overview

Loaded Vibes keeps DevCycle orchestration deterministic (PRD §5.3, TECH §§4–7):

- **Manifest parity:** `dist/genaiscript/devcycles.config.json` is the source of truth for the 18 DevCycles and must stay in sync with TECH §6 and `dist/.github/global.instructions.md`.
- **Instructions + toolsets:** Each DevCycle references one instruction file and one toolset, enforcing the layered rule stack defined in `dist/.github/instructions/**` and `dist/.github/toolsets/**`.
- **TODO/CHANGELOG evidence:** After every DevCycle run, the orchestrator writes requirement-cited entries to `TODO.md` and `CHANGELOG.md` using the markdown summary hooks (TECH §7, SPEC-OBS §3).
- **Bad Vibes Firewall:** Destructive operations (file deletion, upgrade, migrations) pause execution until the operator approves the action with a logged signature (PRD §5.5, SPEC-SECURITY §1).
- **State snapshots:** Execution metadata persists in `dist/genaiscript/state/state.json` so the dashboard, doctor command, and reruns share the same context (TECH §4.5).

## 6. Retro Dashboard Command

Launch the synthwave dashboard to monitor DevCycles in real time:

```
loaded-vibes dashboard
```

### Dashboard usage (PRD §5.2)

1. Launch the command and wait for the ASCII masthead + gradient canvas to render (figlet + gradient-string).
2. Watch the **DevCycle queue** pane for the current status of all 18 phases (○ pending, ▶ running, ✓ done, ✗ failed).
3. Toggle the **Live logs** pane (`l`) to stream NDJSON entries with severity icons sourced from `.loaded-vibes/logs/*.ndjson`.
4. Keep an eye on **System metrics** (CPU/memory updated every 2s) before running heavy DevCycles.
5. Use the **TODO/CHANGELOG feed** to confirm that orchestration is updating the governance artifacts.
6. Trigger the **Command palette** with `Ctrl+P` to rerun DevCycles, open docs, or tail logs without leaving the UI.

### Keyboard controls

| Key            | Action                              |
| -------------- | ----------------------------------- |
| `Ctrl+P`       | Open command palette (fuzzy search) |
| `r`            | Refresh dashboard data              |
| `l`            | Toggle live log streaming           |
| `h` / `?`      | Show keyboard shortcuts help        |
| `q` / `Ctrl+C` | Quit dashboard                      |

Dashboard refreshes are throttled to <200 ms to satisfy the latency target in PRD §6.

## 7. DevCycle Command

Run DevCycles manually from the shipped assets while keeping requirement traceability:

- Usage: `node dist/cli/devcycle.js <devcycle> --mode plan-first --task "ticket-123"` (supports `--dry-run`, `--skip-bootstrap`, `--auto-approve`, `--verbose`, `--list`).
- Validates `dist/genaiscript/devcycles.config.json` plus prompt/instruction/toolset references before execution (TECH §4.1).
- Streams Analyze → Reflect NDJSON events with requirement IDs, checkpoint approvals, and Bad Vibes Firewall notices inline (SPEC-CLI §1, PRD §5.2, §5.5).
- Suggests nearest manifest entries when the name is misspelled and surfaces the default mode/tooling for the selected DevCycle.

## 8. Logs Command

Inspect NDJSON traces stored in `.loaded-vibes/logs/*.ndjson` per Tech Requirements §5.3 (use `ts-node` or the compiled CLI binary in packaged releases):

- Show latest entries: `node dist/cli/commands/logs.ts`
- Filter by DevCycle/time/severity: `node dist/cli/commands/logs.ts --devcycle <id> --since <iso> --severity warn,error`
- Stream updates: add `--follow` to tail new NDJSON lines as they are written.
- Export a Markdown snapshot referencing requirement IDs: `node dist/cli/commands/logs.ts --export .loaded-vibes/logs/export.md`

## 9. Telemetry Export Command

Convert NDJSON telemetry logs into sanitized JSON or Markdown snapshots for audits and PR attachments.

- Usage: `loaded-vibes telemetry export --format json|markdown [--devcycle <id>] [--since <iso>]`
- Defaults to reading `.loaded-vibes/logs/*.ndjson` and writing to `.loaded-vibes/telemetry/exports/telemetry-<timestamp>.json|md`.
- JSON exports power CI integrations and dashboards; Markdown mirrors ADR-0001 dual-mode guidance for reviewer-friendly diffs.
- All exports pass through the secret redaction pipeline (SPEC-SECURITY §2) and cite relevant PRD/TECH requirement IDs.

## 10. CHANGELOG & TODO Workflow

Spec-Driven Workflow requires every DevCycle or manual intervention to document the outcome (PRD §2, TECH §7, SPEC-OBS §3):

- **TODO.md** captures upcoming or in-progress items with requirement citations so the dashboard and CLI provide identical status.
- **CHANGELOG.md** records the action log in a compressed format: `[Type][ISO8601] Goal → Action → Result → Next` with requirement references and follow-up tasks.
- **Automation hooks** (`dist/genaiscript/shared/todoUpdater.js` and `changelogUpdater.js`) prevent duplicate entries and ensure NDJSON summaries keep both files in sync.

Sample CHANGELOG entry:

```
[Documentation][2025-11-27T23:30Z] Goal: Publish end-user guides (Issue #29, PRD §§2–4) -> Action: Updated README quickstart/governance sections plus SUPPORT/SECURITY guidance referencing SPEC-SECURITY §2 and TECH §5.2; documented CHANGELOG format and troubleshooting runbook; logged TODO entry -> Result: Builders have a single quickstart + support playbook tied to requirements -> Next: Mirror README sections into dist/docs for the next release.
```

## 11. Troubleshooting Cheatsheet

Use these CLI helpers before escalating (PRD §5.4, TECH §5.3):

- `loaded-vibes doctor --auto-remediate` – Fixes frequent environment drift (Node, pnpm, MCP endpoints) and surfaces remediation JSON.
- `loaded-vibes logs --devcycle <id> --since <iso>` – Pulls NDJSON evidence for a specific DevCycle; add `--follow` to watch live output.
- `loaded-vibes devcycle <name> --dry-run` – Replays the Analyze/Design stages without writing files to verify manifest alignment.
- `loaded-vibes dashboard` – View DevCycle queue, TODO/CHANGELOG feed, and system metrics at a glance.
- `loaded-vibes telemetry export --format markdown` – Package trace evidence for PRs or support tickets without exposing secrets.

Escalate to the maintainer team (see `SUPPORT.md`) only after capturing doctor output and NDJSON snippets; attach the relevant requirement IDs to speed up triage.

## 12. CI Workflows

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
