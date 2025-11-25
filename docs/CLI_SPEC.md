# Loaded Vibes CLI & Distribution Blueprint

**Document Control**

- **Status:** Draft (internal review)
- **Owners:** Framework Architecture & Tooling Team
- **Last Updated:** 2025-11-24
- **Related Docs:** `docs/PRD.md` (§6-8), `docs/TECH_REQUIREMENTS.md` (§2-4), `docs/ENGINE_SPEC.md`, `lv_artifacts/genaiscript/**`

## 1. Purpose & Vision

- WHEN end users adopt Loaded Vibes, THE SYSTEM SHALL deliver an experience comparable to `create-next-app` that fetches the MIT-licensed repo, scaffolds projects, and links the retro CLI to the shipped assets (PRD §2, §7.1).
- WHEN developers interact with the framework after installation, THE SYSTEM SHALL expose a hip, ASCII-forward CLI that surfaces every DevCycle, tool, and log with real-time feedback (PRD §7.4, TechReq §4.4).
- WHEN troubleshooting or reviewing history, THE SYSTEM SHALL provide searchable logs, dashboards, and guardrails without requiring the authoring workspace (PRD §6.4, §9).

## 2. Distribution Model ("create-loaded-vibes")

### 2.1 Package Targets

- **GitHub Repo:** `github.com/LoadedVibes/framework` (MIT) hosts tagged releases under `lv_artifacts/**`.
- **npm Package:** `create-loaded-vibes` publishes a slim bootstrapper that: pulls the latest release tarball, validates checksums, copies `lv_artifacts` into the user project, then installs dependencies.
- **Binary Drops:** Optional self-contained executables (pkg/VerceI) for air-gapped installs.

### 2.2 Supported Entry Points

```bash
npx create-loaded-vibes@latest                # interactive wizard
npx create-loaded-vibes my-app --stack next   # non-interactive new project
npx create-loaded-vibes --attach ./existing   # retrofit an existing repo
```

### 2.3 Workflow Summary

1. **Discovery:** README badge + website link the npm command; release notes map to DevCycles.
2. **Preflight:** CLI checks Node ≥ 20, git, pnpm, VS Code, and GenAIScript extension versions.
3. **Acquisition:** Downloads release asset (zip/tar) signed with SHA256 and MIT license notice.
4. **Extraction:** Places contents under `<project>/.loaded-vibes/` mirroring `lv_artifacts`, ensuring `.vscode`, `.github`, `genaiscript`, `scripts`, `docs` remain intact.
5. **Initialization:** Runs `loaded-vibes init` to configure profiles, set MCP endpoints, and register Git hooks.
6. **Handoff:** ASCII art success screen with next steps (`loaded-vibes dashboard`, `loaded-vibes devcycle scaffolding`).

### 2.4 Existing Project Attach Flow

- Detects conflicts (existing `.github`, `.vscode`, `lv_artifacts`).
- Offers three strategies: **Mirror** (keep both), **Merge** (copy selective assets), **Sandbox** (run CLI from `.loaded-vibes` without copying).
- Logs all decisions into `.loaded-vibes/logs/install-YYYYMMDD.md`.

## 3. Retro CLI Experience ("Loaded Vibes Console")

### 3.1 Visual Language

- Neon gradient ASCII masthead (matches provided artwork) rendered via `figlet` + `gradient-string`.
- Animated grid background using `ink-gradient` or `blessed` canvas to emulate synthwave vibes.
- Palette: magenta/purple/cyan on midnight blue, w/ semantic color roles (success lime, warn amber, danger hotpink).

### 3.2 Interaction Model

| Mode                | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| **Dashboard**       | Rich TUI layout with panes: DevCycle queue, realtime logs, system metrics, todo/changelog feed. |
| **Command Palette** | `Ctrl+P` opens fuzzy finder for actions (Run DevCycle, View Logs, Configure Settings).          |
| **Menu Bar**        | Top-line ASCII menu for `Project`, `DevCycles`, `Observability`, `Help`.                        |
| **Notifications**   | Toast slots with animations (slide-in) for success/fail.                                        |

### 3.3 Features

- **Workspaces:** Manage multiple projects, each storing settings in `.loaded-vibes/profile.jsonc`.
- **DevCycle Runner:** UI wizard around `genaiscript/orchestrator.genai.js` w/ progress bars, step logging, ability to pause/resume, require approvals.
- **Live Logs:** Tail `lv_artifacts/logs/*.ndjson`, filter by DevCycle, export to Markdown.
- **Troubleshooting Center:** `doctor` scans prerequisites, connectivity, file permissions, MCP availability, optionally auto-remediates.
- **Realtime Status:** Websocket-esque view (via Node child process watchers) showing CPU/memory, CLI tasks, pending diffs.
- **Settings Drawer:** Toggle telemetry, theming, animations, ASCII art density, output verbosity.
- **Tool Shelf:** Quick launchers for `pnpm dev`, `genaiscript test`, `loaded-vibes diarize` (decision log assistant).

### 3.4 Hipster Delight Enhancements

- Easter egg commands (`loaded-vibes vibe-check`) produce random synthwave color storms.
- `Bad Vibes Firewall`: stylized security warnings referencing PRD §9 risk mitigations.
- Ambient soundtrack via optional terminal bell pulses (opt-in).

## 4. Architecture

### 4.1 Stack Choices

- **Runtime:** Node 20+, ECMAScript modules.
- **UI Toolkit:** `ink` + `ink-select-input` + `ink-text-input`, with `blessed-contrib` for charts.
- **Rendering:** `figlet`, `gradient-string`, `chalk`, `cli-spinners`, `listr2` for animated tasks.
- **Process Control:** `execa` for orchestrator/bootstrapper invocations, `node-pty` for long-running commands.
- **State:** `zod`-validated JSON configs stored under `.loaded-vibes/state/*.json`.
- **Plugin System:** Lightweight hooks (`beforePhase`, `afterPhase`, `beforeDownload`) so advanced users can script behavior.

### 4.2 Modules

1. **Installer** – handles download/extract/verify.
2. **Project Registry** – persists known workspaces, ensures separation between framework assets and user src (PRD §6.4).
3. **DevCycle Service** – wraps GenAIScript orchestrator, streams structured events into UI.
4. **Telemetry & Logging** – writes NDJSON to `.loaded-vibes/logs`, optional remote sink.
5. **Troubleshooter** – runs diagnostics, integrates with `doctor` command.
6. **Dashboard** – renders the retro UI, subscribes to events.
7. **Security Manager** – enforces restricted paths, secret scanning, signature checks.

### 4.3 Command Surface

```
loaded-vibes create <dir>         # alias to create-loaded-vibes
loaded-vibes init                 # configure MCP, VS Code profile, install deps
loaded-vibes dashboard            # launch retro UI
loaded-vibes devcycle <name>      # run orchestrator with prompts/toolsets
loaded-vibes logs [--follow]      # view structured logs, filter by phase
loaded-vibes doctor               # troubleshoot environment issues
loaded-vibes upgrade              # fetch latest release safely
loaded-vibes config set <key>     # manage settings
loaded-vibes tools <command>      # curated wrappers around pnpm/test/format
```

### 4.4 Workflow Integration

- CLI reads `devcycles.config.json` to populate menus, ensuring parity with shipped manifest.
- For each DevCycle run, CLI spawns `npx genaiscript run lv_artifacts/genaiscript/orchestrator.genai.js --phase <x>` and streams STDOUT → UI.
- Logs include EARS citation → requirement mapping for audit compliance.
- CLI can trigger `lv_artifacts/scripts/bootstrapper.genaiscript.ts` when new releases arrive or before DevCycles (toggle in settings).

## 5. Security, Performance, and Reliability

- **Security:** Signature verification on downloads, sandbox file writes (never touch `src/` unless user confirms), integration with `Bad Vibes Firewall` warnings, optional token redaction in logs.
- **Performance:** Cache release tarballs, parallelize downloads + checksum verification, incremental state updates for dashboards, frame-skipping for animations when CPU spikes.
- **Reliability:** Automatic retries with exponential backoff, offline mode (use cached artifacts), `doctor` command to detect drift, structured error codes for CI consumption.

## 6. User Journeys

### 6.1 New Project (Greenfield)

1. `npx create-loaded-vibes my-app`
2. CLI displays synthwave intro, prompts for stack presets, env answers, optional template seeds.
3. Download/extract -> git init -> install dependencies -> run `loaded-vibes init`.
4. Launch dashboard, auto-open README quickstart, highlight next DevCycle (Initialization).

### 6.2 Existing Repo Retrofit

1. `npx create-loaded-vibes --attach .`
2. CLI scans repo, identifies conflicts, shows diff preview in neon menu.
3. User chooses merge strategy; CLI writes `.loaded-vibes/` plus optional `.github` overlays.
4. Run `loaded-vibes doctor` to ensure compatibility, then continue via dashboard.

### 6.3 Daily Operations

- Developer launches `loaded-vibes dashboard`, selects DevCycle, monitors output, updates TODO/CHANGELOG from UI, exports transcripts for code review.
- Logs accessible via `loaded-vibes logs --phase features --since 2h`.
- Settings allow toggling ASCII density, telemetry, color themes, and key bindings.

## 7. Compatibility with Existing Assets

- All CLI commands operate exclusively on `lv_artifacts/**` mirrors placed under `.loaded-vibes/`; runtime `src/` generation remains untouched unless orchestrator outputs there.
- Dashboard context uses `docs/PRD.md`, `docs/TECH_REQUIREMENTS.md`, and `ENGINE_SPEC.md` copies from the release bundle, keeping parity with GenAIScript instructions.
- Command wrappers call the same scripts currently used in `lv_artifacts/scripts/`, ensuring no duplication of orchestration logic.

## 8. Implementation Roadmap (High Level)

1. **Prototype Installer:** Download + extract release, create `.loaded-vibes` tree, wire `init` command.
2. **Retro UI Shell:** Build Ink dashboard with ASCII art, nav, notifications, log tailing.
3. **DevCycle Adapter:** Stream orchestrator outputs into UI with actionable statuses.
4. **Diagnostics & Logs:** Implement `doctor`, log viewer, timeline exports.
5. **Polish & Packaging:** Add animations, settings, hipster touches, telemetry toggles, docs & tutorials.

## 9. Open Questions

- Should we bundle a lightweight local HTTP API for advanced integrations, or keep everything CLI-side?
- Do we provide optional VS Code Webview bridging to show the same dashboard? (Future consideration.)
- How do we version-manage user customizations inside `.loaded-vibes` when upgrading releases? (Proposed: semantic versioned config + diff hints.)

This blueprint aligns the requested user experience with the existing Loaded Vibes architecture, ensuring the retro CLI can fully control GenAIScript-powered DevCycles while delighting developers with a stylish, functional workflow.
