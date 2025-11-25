# Loaded Vibes Product Requirements Document (PRD)

## Document Control

| Field         | Value                                 |
| ------------- | ------------------------------------- |
| Product       | Loaded Vibes Framework                |
| Document Type | Product Requirements Document         |
| Status        | Draft (consolidated)                  |
| Last Updated  | 2025-11-24                            |
| Owners        | Framework Architecture & Tooling Team |

## 1. Executive Summary

Loaded Vibes delivers a spec-driven framework that keeps authoring assets, shipped artifacts, and runtime code permanently isolated while delighting builders with a retro, DevCycle-aware CLI. This PRD consolidates the former PRD, CLI blueprint, and engine experience requirements into a single source of truth for product behavior, ensuring every workflow—from `npx create-loaded-vibes` through the synthwave console—aligns with the Spec-Driven Workflow enforced by the custom agent.

## 2. Product Goals & Success Metrics

- **Separation of concerns:** Authoring stays inside `.github/`, `.vscode`, `docs`, `templates`; shipped assets live in `lv_artifacts/**`; runtime code generates only under `lv_artifacts/src/**` in end-user projects.
- **Deterministic DevCycles:** Every DevCycle run produces traceable plans, validation evidence, TODO/CHANGELOG hooks, and human approval checkpoints.
- **Delightful CLI experience:** The retro console presents DevCycle queues, logs, diagnostics, and ASCII-first feedback that mirror the orchestrator state.
- **Distribution clarity:** Releases publish via `create-loaded-vibes`, optional binaries, and mirrored `.loaded-vibes/` folders with signed artifacts.
- **Measured outcomes:** 100% of IDE automation references development files only; every DevCycle task cites a PRD/TechReq clause; CLI interactions log to `.loaded-vibes/logs/*.ndjson`.

## 3. Personas & Journeys

| Persona                         | Needs                                                                                                          | Primary Touchpoints                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Framework Maintainer**        | Author specs, prompts, instructions, and toolsets without touching shipped payloads.                           | VS Code workspace, docs/, templates/, custom agent.                  |
| **Automation Agent (@copilot)** | Execute DevCycles deterministically, surface checkpoints, update TODO/CHANGELOG, honor safety tooling.         | Copilot instructions, toolsets, GenAIScript orchestrator.            |
| **End-User Builder**            | Install via CLI, run retro dashboard, trigger DevCycles, view logs/diagnostics without needing authoring repo. | `create-loaded-vibes`, `.loaded-vibes/`, retro CLI, docs in release. |

## 4. Scope & Boundaries

### 4.1 Asset Taxonomy

1. **Development Assets:** `.github/`, `.vscode/`, `docs/`, `templates/` govern authoring. Only these directories may change during framework development.
2. **Shipped Product:** `lv_artifacts/**` mirrors what users receive (agents, prompts, toolsets, docs, scripts, GenAIScript engine, VS Code defaults).
3. **Runtime Output:** End users generate `lv_artifacts/src/**` inside their projects; framework authors never lint or edit runtime files.

### 4.2 Directory Responsibilities

- `docs/` holds PRD + Tech Requirements plus all engineering specs—no standalone spec files elsewhere.
- `.github/` stores dev-environment governance (Copilot instructions, issue templates, automation configs).
- `.vscode/` configures IDE behavior for maintainers only; it never references shipped instructions.
- `templates/` stores gold master content used to regenerate shipped artifacts.
- `lv_artifacts/.github/**` defines the product-facing constitution (global instructions, agent manifests, prompts, toolsets).

### 4.3 Workspace vs. Release Enforcement

- WHEN authoring inside `D:/LoadedVibes`, THE SYSTEM SHALL block edits outside the allowed directories unless explicitly updating `lv_artifacts`.
- WHEN generating runtime code, THE SYSTEM SHALL emit assets exclusively under `lv_artifacts/src/**` within the consumer project.
- WHEN IDE tooling loads instructions or settings, THE SYSTEM SHALL source them from `.github`/`.vscode` in the workspace, never from shipped payloads.

## 5. Product Pillars & Requirements (EARS)

### 5.1 Distribution & Installation

- WHEN a user runs `npx create-loaded-vibes [project]`, THE SYSTEM SHALL download the latest signed release, mirror `lv_artifacts/**` into `.loaded-vibes/`, install dependencies, and invoke `loaded-vibes init` for profile setup.
- WHEN the CLI runs preflight checks, THE SYSTEM SHALL verify Node ≥ 20, git, pnpm, VS Code, and the GenAIScript extension, surfacing actionable remediation steps.
- WHEN attaching to an existing repo, THE SYSTEM SHALL detect conflicts in `.github`, `.vscode`, or `lv_artifacts/**` and offer Mirror, Merge, or Sandbox strategies while logging decisions to `.loaded-vibes/logs/install-YYYYMMDD.md`.

### 5.2 Retro Console Experience

- WHEN the user launches `loaded-vibes dashboard`, THE SYSTEM SHALL render the synthwave UI (ASCII masthead, gradient canvas, semantic colors) with panes for DevCycle queue, live logs, metrics, and TODO/CHANGELOG feeds.
- WHEN a DevCycle runs from the console, THE SYSTEM SHALL stream orchestrator events (plan, analyze, implement, validate, reflect) with pause/resume checkpoints and approval prompts for risky actions.
- WHEN notifications or errors occur, THE SYSTEM SHALL show animated toasts plus contextual remediation links to docs or `doctor` results.

### 5.3 DevCycle Governance

- WHEN a prompt triggers any DevCycle, THE SYSTEM SHALL load the associated instruction + toolset entry from `devcycles.config.json` before executing.
- WHEN DevCycles finish, THE SYSTEM SHALL append summarized work items to `TODO.md` and `CHANGELOG.md`, citing the originating requirement.
- WHEN a DevCycle needs additional guidance, THE SYSTEM SHALL offer a command palette entry (Ctrl+P) so users can rerun phases, view history, or open docs instantly.

### 5.4 Observability & Reporting

- WHEN troubleshooting (`loaded-vibes doctor`), THE SYSTEM SHALL scan prerequisites, MCP availability, file permissions, and drift between workspace + shipped manifest, offering optional auto-remediation.
- WHEN users request historical insight, THE SYSTEM SHALL provide searchable NDJSON logs filterable by DevCycle, timeframe, and severity, with export-to-Markdown support.
- WHEN release notes are generated, THE SYSTEM SHALL map CLI telemetry + changelog deltas directly to DevCycle identifiers for compliance.

### 5.5 Security & Risk Controls

- WHEN downloading releases, THE SYSTEM SHALL validate SHA256 signatures before extraction and block unsigned payloads.
- WHEN writing files, THE SYSTEM SHALL confine changes to `.loaded-vibes/**` unless the user explicitly approves copying templates into project roots.
- IF unsafe operations are requested, THEN THE SYSTEM SHALL raise a “Bad Vibes Firewall” warning describing impacted paths, required approvals, and rollback steps.

## 6. Success Metrics

- 100% of DevCycle runs include EARS-cited requirements within their execution logs.
- 0% of IDE settings reference shipped instructions; CI enforces guardrails.
- 100% of CLI installations log install strategy + checksum validation outcomes.
- CLI dashboard latency < 200 ms for log updates on modern hardware; `doctor` completes within 60 s for standard projects.

## 7. Dependencies & Assumptions

- Spec-Driven Workflow artifacts (PRD, Tech Requirements, TODO, CHANGELOG) stay current and live under `docs/`.
- GenAIScript orchestrator + bootstrapper referenced in Tech Requirements are available inside `lv_artifacts/genaiscript/**`.
- ASCII artwork, gradients, and fonts referenced by the CLI ship within releases or are generated locally without external fetches.

## 8. Risks & Mitigations

- **Confused responsibilities:** Mitigated by explicit directory ownership table and README guidance (Section 9).
- **CLI drift from orchestrator:** Mitigated by shared `devcycles.config.json` manifest and CI checks verifying parity with Tech Requirements (Section 4).
- **Token/safety regressions:** Mitigated by human-in-loop checkpoints, Bad Vibes Firewall prompts, and adherence to Copilot agent guardrails.

## 9. Directory Ownership Matrix

| Directory           | Owner            | Purpose                                                                                |
| ------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| `.github/`          | Maintainers      | Dev-environment governance (instructions, templates, automation configs).              |
| `.vscode/`          | Maintainers      | IDE profile for authoring workspace only.                                              |
| `docs/`             | Maintainers      | Canonical specs (this PRD + Tech Requirements) and supporting references.              |
| `templates/`        | Maintainers      | Gold masters used to regenerate shipped artifacts.                                     |
| `lv_artifacts/`     | Product Snapshot | Shipped assets (agents, prompts, docs, scripts, GenAIScript engine, VS Code defaults). |
| `lv_artifacts/src/` | End User         | Runtime output produced in consumer projects; never referenced by workspace tooling.   |

## 10. Related Documents

- `docs/TECH_REQUIREMENTS.md` – Consolidated technical/architectural requirements, DevCycle manifest schema, engine automation, CLI implementation plan.
- `README.md` – Contributor quickstart and directory usage guidelines.
- `TODO.md` / `CHANGELOG.md` – Rolling execution evidence mandated by Spec-Driven Workflow.

This consolidated PRD supersedes prior standalone CLI and engine specs; future product changes MUST update this document before implementation.
