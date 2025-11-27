# Loaded Vibes Technical Requirements

## Document Control

| Field         | Value                                 |
| ------------- | ------------------------------------- |
| Product       | Loaded Vibes Framework                |
| Document Type | Technical Requirements                |
| Status        | Draft (consolidated)                  |
| Last Updated  | 2025-11-24                            |
| Owners        | Framework Architecture & Tooling Team |

## 1. System Context & Principles

- Authoring occurs inside `D:/LoadedVibes` and is limited to `.github/`, `.vscode/`, `docs/`, and `templates/` unless explicitly updating `dist/`.
- Shipped payloads live under `dist/**`; runtime output lives under `dist/src/**` only after users install the framework.
- Tooling (tasks, MCP servers, Copilot instructions) must reference development assets exclusively to avoid contaminating the shipped snapshot.
- Spec-Driven Workflow artifacts (PRD, this document, TODO, CHANGELOG) anchor every DevCycle.

## 2. Layered Architecture Overview

| Layer                | Responsibilities                                                              | Key Artifacts                                                             |
| -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Bootstrap**        | Detect profile gaps, sync MCP + extensions, expose CLI entry points.          | `dist/scripts/bootstrapper.genaiscript.ts`, `bootstrapper.ps1`    |
| **Orchestration**    | Load manifest, hydrate context, coordinate Analyze → Handoff lifecycle.       | `dist/genaiscript/orchestrator.genai.js`, `devcycles.config.json` |
| **Phase Runners**    | Execute DevCycle-specific logic with manifest-provided instructions/toolsets. | `dist/genaiscript/phases/*.genai.js`                              |
| **Shared Utilities** | Context loading, memory/state persistence, validation helpers.                | `dist/genaiscript/shared/*.js`                                    |
| **Governance**       | Instructions, prompts, toolsets, TODO/CHANGELOG, PRD/TechReq references.      | `dist/.github/**`, workspace docs                                 |
| **Retro CLI**        | Installer, dashboard, diagnostics, DevCycle UX.                               | `create-loaded-vibes`, `loaded-vibes` CLI, `.loaded-vibes/**`             |

## 3. Artifact Layers & Deliverables

1. **Global Instructions (Framework Layer)** – `dist/.github/global.instructions.md` defines universal rules, canonical DevCycle names, artifact taxonomy, and governance contract.
2. **Custom Agent (Stack Layer)** – `.github/copilot-instructions.md` for workspace + `dist/.github/agents/*.agent.md` for shipped product enforce Next.js 15 / React 19 / Prisma / Clerk / Tailwind / Vercel guidance, formatting, safety, and self-correction behavior.
3. **Prompts (DevCycle Entry)** – `dist/.github/prompts/*.prompt.md` trigger exactly one DevCycle, load correct instruction + toolset, and wire environment context.
4. **Instruction Files (Domain Layer)** – `dist/.github/instructions/*.instructions.md` specify DevCycle goals, acceptance criteria, and security/performance guardrails.
5. **Toolsets (Execution Layer)** – `dist/.github/toolsets/*.toolset.jsonc` enumerate allowed VS Code tools, MCP servers, CLIs, and safety checks per DevCycle; generated from workspace settings + MCP configs.
6. **Workspace Profile** – `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/mcp.json`, `.vscode/tasks.json` define maintainer environment; shipped equivalents live under `dist/.vscode/`.
7. **Automation & Scripts** – `dist/genaiscript/**` and `dist/scripts/**` implement bootstrapper/orchestrator/phase tooling with deterministic outputs.

## 4. DevCycle Manifest & Engine Requirements

### 4.1 Manifest (`devcycles.config.json`)

- Maps each DevCycle key to `{instruction, prompt, toolset, description, defaultTools, checkpoints}`.
- Validated during bootstrap; missing files or mismatched references block execution.
- Includes metadata for CLI menus (display name, summary, risk flag) to ensure parity between orchestrator and console.

### 4.2 Orchestrator (`orchestrator.genai.js`)

- Parameters: `phase`, `task`, `mode (plan-only|execute|validate)`, `skipBootstrap`, and optional `chain` flag.
- Responsibilities: bootstrap verification, manifest load, context hydration (PRD, TechReq, TODO, CHANGELOG, state), plan generation, phase invocation, checkpoint enforcement.
- Tool access: `filesystem`, `git`, `memory`, `sequentialthinking`, `runTests`, `todos`, `runSubagent`, `fetch_webpage` (per instructions).
- Outputs: structured log segments (Analyze, Design, Implement, Validate, Reflect), TODO/CHANGELOG deltas, state snapshot, and optional telemetry event.

### 4.3 Phase Runner Template

- Each `phases/*.genai.js` script MUST export metadata `{name, description, requiredInputs}`.
- Execution stages:
  1. **Analyze:** Summarize relevant PRD/TechReq excerpts + instructions (EARS citations required).
  2. **Design:** Produce ordered plan referencing manifest + risk register.
  3. **Implement:** Execute allowed commands/tools only; require explicit approvals for destructive actions.
  4. **Validate:** Run tests/verifications; capture outputs.
  5. **Reflect/Handoff:** Update TODO/CHANGELOG, memory, changelog hooks.
- Scripts should call shared helpers for context hydration, logging, and TODO updates to ensure parity.

### 4.4 Bootstrapper Flow

1. Ensure VS Code profile + MCP config match workspace requirements (extensions installed, `genaiscript.localTypeDefinitions=true`).
2. Validate manifest coherence (files exist, instructions reference real toolsets, CLI + orchestrator in sync).
3. Provide CLI entry points: `pwsh ./dist/scripts/bootstrapper.ps1 -Phase scaffolding` and `npx genaiscript run ./dist/genaiscript/orchestrator.genai.js --phase scaffolding`.
4. Emit machine-readable status (JSON) for CLI dashboard + CI gating.

### 4.5 State & Telemetry

- Persist execution snapshots in `dist/genaiscript/state/state.json` (phase, params, outputs, timestamps).
- Append summary stubs to `TODO.md` and `CHANGELOG.md`; DevCycle instructions flesh out details.
- Provide hooks for future telemetry exports (NDJSON, remote sink) referenced by CLI logs.

## 5. Retro CLI Platform Requirements

### 5.1 Distribution Model

- **Packages:** `create-loaded-vibes` npm package bootstraps projects; optional binaries (pkg/Vercel) for air-gapped environments.
- **Entry Points:**
  - `npx create-loaded-vibes@latest` (interactive wizard)
  - `npx create-loaded-vibes my-app --stack next` (non-interactive)
  - `npx create-loaded-vibes --attach ./existing` (retrofit)
- **Workflow:** discovery badge → preflight (Node ≥ 20, git, pnpm, VS Code, GenAIScript extension) → download signed release → extract to `.loaded-vibes/` → run `loaded-vibes init` → ASCII success + next steps.

### 5.2 Console UX & Modules

- UI toolkit: `ink`, `ink-select-input`, `ink-text-input`, `blessed-contrib` for charts; rendering via `figlet`, `gradient-string`, `chalk`, `cli-spinners`, `listr2`.
- Modules: Installer, Project Registry, DevCycle Service (wraps orchestrator), Telemetry/Logging, Troubleshooter (`doctor`), Dashboard, Security Manager.
- Command surface:

```
loaded-vibes create <dir>
loaded-vibes init
loaded-vibes dashboard
loaded-vibes devcycle <name>
loaded-vibes logs [--follow]
loaded-vibes doctor
loaded-vibes upgrade
loaded-vibes config set <key>
loaded-vibes tools <command>
```

- Dashboard panes: DevCycle queue, real-time logs, system metrics, TODO/CHANGELOG feed, notifications.
- Command palette (`Ctrl+P`) surfaces fuzzy actions (Run DevCycle, View Logs, Configure Settings).

### 5.3 Diagnostics & Logs

- `doctor` scans prerequisites, connectivity, MCP health, file permissions, `.loaded-vibes` drift; offers auto-remediation with confirmation.
- Logs stored as NDJSON in `.loaded-vibes/logs/*.ndjson`, filterable by DevCycle/time/severity; CLI exports Markdown snapshots for reviews.
- CLI streams orchestrator events; each event must cite the originating requirement (PRD or TechReq section).

### 5.4 Security & Performance

- Downloaded releases require SHA256 verification; unsigned payloads abort with actionable guidance.
- File writes restricted to `.loaded-vibes/**` and explicit user-approved copies.
- “Bad Vibes Firewall” prompts warn before destructive operations, describing affected paths + rollback steps.
- Cache release tarballs, parallelize download + checksum, throttle UI animations when CPU spikes, keep dashboard log latency < 200 ms.

## 6. Canonical DevCycle Table

| #   | DevCycle       | Purpose                                                                                            |
| --- | -------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Initialization | Bootstrap environment, audit extensions/MCP/settings, validate PRD/TechReq, output readiness.      |
| 2   | Scaffolding    | Convert PRD/TechReq into project structure, base components, server actions, layout.               |
| 3   | Configuration  | Configure ESLint, Prettier, TS, Tailwind, Vitest, Playwright, `.env`, secrets, workspace settings. |
| 4   | Verification   | Run lint/typecheck/config validation/connectivity scans, detect missing files.                     |
| 5   | Data           | Design Prisma schema, migrations, safety checks, seeding, drift detection.                         |
| 6   | Auth           | Integrate Clerk, configure ABAC/RBAC, session security, onboarding flows.                          |
| 7   | Testing        | Configure test infra, generate plans, enforce acceptance criteria.                                 |
| 8   | Validation     | Confirm implementation matches PRD intent, UX flows, contracts.                                    |
| 9   | Features       | Implement application logic with performance budgets.                                              |
| 10  | Debug          | Resolve errors/failing tests, coordinate with perf/observability.                                  |
| 11  | Security       | Enforce CSP, HSTS, permissions, logging redaction, PII handling.                                   |
| 12  | Performance    | Optimize bundle size, DB queries, dependencies, tech debt.                                         |
| 13  | Observability  | Instrument telemetry/logs/alerts/dashboards.                                                       |
| 14  | Code Review    | Automate PR reviews, policies, static analysis.                                                    |
| 15  | Documentation  | Generate README, CONTRIBUTING, SECURITY, CODEOWNERS, templates.                                    |
| 16  | CI/CD          | Define GitHub Actions for lint/test/build/E2E, Vercel pipelines.                                   |
| 17  | Deploy         | Execute deployments, smoke tests, rollback/canary flows.                                           |
| 18  | Updates        | Post-launch fixes, QoL improvements, release notes.                                                |

Global instructions MUST list only these names; instruction files define behavior.

## 7. Workflow & Governance Requirements

- Prompts → Instructions → Toolsets chain is mandatory per DevCycle; add CI checks verifying manifest entries resolve.
- Custom agent obeys `global instructions → instruction file → toolset`; deviations require documented Decision Records.
- TODO/CHANGELOG updates are required outputs for every DevCycle; missing updates fail validation.
- Human checkpoints: `plan` approval, `pre-implement` approval for destructive steps, `reflect` summary sign-off.

## 8. Tooling & Automation Requirements

- Keep workspace profile (`.vscode/*.json`) in sync with shipped profile; differences logged in README + TODO.
- Provide `tasks.json` entries for running orchestrator, CLI, and lint/test operations (future work tracked in TODO).
- `genaiscript/localTypeDefinitions` flag must remain `true`; update `.genaiscript.d.ts` references when upstream changes.
- Prefer MCP servers/GenAIScript APIs over raw filesystem/network operations; document exceptions with Decision Records.

## 9. Security, Quality, and Compliance

- Instruction files enforce CSP, HSTS, ABAC, RBAC, content-safety, and secret-scanning guardrails.
- CLI and orchestrator must avoid touching `src/` trees unless acting within a user project’s `.loaded-vibes` environment.
- Automated operations are idempotent; rerunning a DevCycle cannot corrupt workspace or shipped artifacts.
- Telemetry pipelines must redact secrets and allow opt-out toggles via CLI settings.

## 10. Validation & Traceability

- `genaiscript test` covers orchestrator + phase scripts with mocked env.
- CLI smoke tests verify install, dashboard, doctor, logs, upgrade commands; results documented in TODO/CHANGELOG.
- Maintain mapping between PRD clauses and manifest entries; CLI logs must include `requirementId` metadata for audits.
- Periodically compare this document’s DevCycle list with `dist/.github/global.instructions.md`; CI check recommended.

## 11. Roadmap & Open Questions

- Determine format for persisted execution summaries (JSON vs Markdown) before enabling CI gating.
- Evaluate optional local HTTP API for CLI dashboards or VS Code webviews.
- Design versioning strategy for user customizations inside `.loaded-vibes` during upgrades (semantic versions + diff hints proposed).
- Assess additional MCP/toolset needs for observability/performance phases.

This consolidated Technical Requirements document supersedes standalone CLI and engine specs; all future technical changes must update this file and receive PRD sign-off.

