# Loaded Vibes CLI Specification

**Reference ID:** SPEC-CLI

## Purpose

Provide a readable explanation of CLI behaviors defined in `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md`.

## Authoritative References

- `[PRD §5.1–5.4]` Distribution, retro console experience, observability + troubleshooting.
- `[TECH §5]` Retro CLI platform requirements (distribution, UX modules, diagnostics, security).
- `[TECH §4.4]` Bootstrapper coupling.

## 1. CLI Commands

| Command     | Purpose                 |
| ----------- | ----------------------- |
| `create`    | Installation bootstrap  |
| `dashboard` | Retro TUI               |
| `devcycle`  | Manually run a DevCycle |
| `logs`      | View pipeline logs      |
| `doctor`    | Workspace validation    |

_All command semantics follow `TECH_REQUIREMENTS.md`._

## 2. Interaction & UX Model

- `dashboard` renders the synthwave UI (ASCII masthead, gradient canvas, semantic colors) with panes for DevCycle queue, logs, metrics, TODO/CHANGELOG feeds `[PRD §5.2]`.
- CLI streams orchestrator events with Analyze → Reflect checkpoints and prompts for approvals before destructive operations `[PRD §5.3]`.
- Command palette (`Ctrl+P`) exposes fuzzy actions (rerun DevCycle, open docs, tail logs) per Retro console requirements `[TECH §5.2]`.
- All outputs cite originating requirement IDs to satisfy auditability `[PRD §5.4]`.

## 3. Distribution & Bootstrap Coupling

- `create` downloads the latest signed release, mirrors `dist/**` into `.loaded-vibes/`, installs dependencies, then invokes `loaded-vibes init` `[PRD §5.1]`.
- Preflight checks ensure Node ≥ 20, git, pnpm, VS Code, and GenAIScript extension; failures emit actionable remediation `[TECH §5.1]`.
- Bootstrapper status (JSON) feeds the CLI so `dashboard` can highlight readiness or drift `[TECH §4.4]`.

## 4. Diagnostics & Logs

- `doctor` scans prerequisites, MCP availability, file permissions, manifest drift, and can auto-remediate with confirmation `[PRD §5.4]`.
- `logs` command surfaces NDJSON traces stored under `dist/.loaded-vibes/logs/*.ndjson` (shipped) then mirrored to `.loaded-vibes/logs/*.ndjson` in user projects, with filters for DevCycle, timeframe, severity `[TECH §5.3]`.
- CLI exports Markdown summaries for sharing in PRs or incidents; include TODO/CHANGELOG references.

## 5. Security & Safety Controls

- All downloads require SHA256 verification; unsigned payloads trigger Bad Vibes Firewall warnings `[PRD §5.5]`.
- CLI confines writes to `dist/.loaded-vibes/**` (during framework development) or user `.loaded-vibes/**` (after installation) unless the user approves copying templates into the project root `[TECH §5.4]`.
- Sensitive logs redact secrets/env vars before persistence `[TECH §9]`.

## 6. Validation & Tagging

- Smoke tests must cover `create`, `dashboard`, `doctor`, `logs`, and `devcycle` flows per `[TECH §10]`.
- Tag CLI issues with `[SPEC-CLI]` and cite requirement IDs plus NDJSON excerpts.
