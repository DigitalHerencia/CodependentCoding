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

## 11. Execution Summary Format

### 11.1 Decision

Execution summaries use **dual-mode output** (JSON + Markdown) to serve both machine and human consumers. See [ADR-0001](decisions/ADR-0001-execution-summary-format.md) for full rationale.

### 11.2 Format Specification

| Output | Format | Location | Purpose |
| --- | --- | --- | --- |
| Structured summary | JSON | `.loaded-vibes/summaries/<devCycleId>-<timestamp>.json` | CI gating, dashboards, programmatic queries |
| Human summary | Markdown | `.loaded-vibes/summaries/<devCycleId>-<timestamp>.md` | PR attachments, TODO/CHANGELOG, manual review |

Both files are emitted atomically at phase completion. The Markdown file includes YAML frontmatter mirroring JSON fields for light parsing.

### 11.3 JSON Schema

```json
{
  "devCycleId": "string",
  "phase": "string",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "status": "success | failure | skipped",
  "requirementIds": ["string"],
  "checkpoints": [{ "id": "string", "approved": "boolean", "approver": "string" }],
  "validationResult": { "passed": "boolean", "details": "string" },
  "artifacts": ["string"],
  "logFile": "relative path to .ndjson"
}
```

### 11.4 Migration Steps

1. Create shared utility `dist/genaiscript/shared/summary-writer.js` to emit both JSON and Markdown.
2. Update orchestrator to invoke the utility at each phase completion.
3. Extend `loaded-vibes logs` to display/export summaries.
4. Update CI workflows to consume `*.json` for gating decisions.

## 12. Roadmap & Open Questions

- Evaluate optional local HTTP API for CLI dashboards or VS Code webviews.
## 11. Customization Versioning Strategy

### 11.1 Overview

WHEN a user runs `loaded-vibes upgrade`, THE SYSTEM SHALL preserve user customizations while applying upstream changes, detect conflicts, and provide actionable resolution paths `[PRD §5.1]`.

The versioning strategy uses a three-tier approach:
1. **Framework Version Tracking:** Semantic versioning in `.loaded-vibes/manifest.json`
2. **Asset Version Tracking:** Checksum-based tracking in `.loaded-vibes/assets.json`
3. **Conflict Resolution:** Mirror/Merge/Sandbox strategies per `[PRD §5.1]`

### 11.2 Semantic Versioning Scheme

| Version Bump | Scope | Upgrade Impact |
|--------------|-------|----------------|
| **Major** (X.0.0) | Breaking changes to manifest schema, toolset APIs, or DevCycle contracts | Requires manual review; auto-upgrade blocked |
| **Minor** (1.X.0) | New DevCycles, prompts, toolsets, or non-breaking enhancements | Auto-merge safe for unmodified assets |
| **Patch** (1.2.X) | Bug fixes, documentation updates, security patches | Silent update for pristine assets |

### 11.3 Asset Tracking

Each shipped asset is tracked with:
- **frameworkChecksum:** SHA256 of the shipped version
- **localChecksum:** Current file checksum
- **frameworkVersion:** Version when last synced from upstream
- **lastModified:** Local modification timestamp
- **status:** `pristine` | `modified` | `conflict`

### 11.4 Diff Hint Generation

The CLI generates upgrade hints before applying changes:
- Pre-upgrade analysis via `loaded-vibes upgrade --analyze`
- Diff hints stored in `.loaded-vibes/upgrade-hints/v{version}.json`
- Visual indicators for added, modified, and conflicting sections

### 11.5 Conflict Handling Strategies

| Strategy | Use Case | Behavior |
|----------|----------|----------|
| **Mirror** | Exact parity with upstream | Overwrites all assets; backs up local modifications |
| **Merge** | Preserve customizations | Auto-merges non-conflicting changes; interactive resolution for conflicts |
| **Sandbox** | Evaluate before committing | Extracts to sandbox directory; user selectively applies changes |

### 11.6 Upgrade Workflow

1. **Pre-Upgrade:** Checksum validation, backup creation, diff analysis
2. **Strategy Selection:** User chooses Mirror/Merge/Sandbox
3. **Execution:** Apply strategy with Bad Vibes Firewall warnings `[PRD §5.5]`
4. **Post-Upgrade:** Asset registry update, NDJSON logging, doctor validation

### 11.7 Rollback & Recovery

- Automatic backup retention (last 5 upgrades) in `.loaded-vibes/backup/`
- Restore commands: `loaded-vibes restore --from v{timestamp}`
- Single-asset restore: `loaded-vibes restore --from v{timestamp} --asset <path>`

**Decision Record:** `docs/decisions/ADR-001-customization-versioning-strategy.md`

## 12. Roadmap & Open Questions

- Determine format for persisted execution summaries (JSON vs Markdown) before enabling CI gating.
- Design versioning strategy for user customizations inside `.loaded-vibes` during upgrades (semantic versions + diff hints proposed).
- Evaluate optional local HTTP API for CLI dashboards or VS Code webviews.
- Assess additional MCP/toolset needs for observability/performance phases.
- Design versioning strategy for user customizations inside `.loaded-vibes` during upgrades (semantic versions + diff hints proposed).
- ~~Assess additional MCP/toolset needs for observability/performance phases.~~ (Completed—see §11.1.)

### 11.1 MCP/Toolset Assessment for Observability & Performance DevCycles

This section documents the required MCP servers and toolsets for DevCycles 12 (Performance) and 13 (Observability), fulfilling the open question above.

#### 11.1.1 Observability DevCycle (DevCycle 13)

**Required Signals** (per SPEC-OBS §1):
- DevCycle start/end timestamps
- Validation summaries
- Toolset activation logs
- Engine state transitions
- Error stack traces (sanitized)
- NDJSON event logs with `devCycleId`, `phase`, `requirementId`, `severity`, `checkpointId`

**MCP Server Requirements:**

| MCP Server           | Purpose                                                                 | Status   | Notes                                                    |
| -------------------- | ----------------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `filesystem`         | Read/write NDJSON logs, state snapshots, Markdown reports               | Required | Already configured; primary I/O for log persistence      |
| `git`                | Track log file changes, commit evidence, diff generation                | Required | Already configured; enables traceability                 |
| `memory`             | Persist DevCycle context, checkpoint state across phases                | Required | Already configured; supports session continuity          |
| `sequentialthinking` | Structure telemetry reasoning, correlate events logically               | Required | Already configured; aids complex trace analysis          |
| `fetch`              | Export telemetry to external sinks (opt-in), validate remote endpoints  | Optional | Already configured; used only when remote export enabled |
| `github`             | Log DevCycle events to issue comments, create observability reports     | Optional | Already configured; useful for CI/PR integration         |
| `postgres` (Prisma)  | Query application logs if stored in DB, correlate with runtime metrics  | Optional | Already configured; fallback when NDJSON insufficient    |

### Proposed MCP Servers

| MCP Server   | Purpose                                                    | Status      | Notes                                                      |
| ------------ | ---------------------------------------------------------- | ----------- | ---------------------------------------------------------- |
| `todos`      | Surface telemetry gaps as TODO items for remediation       | Proposed    | Not implemented; would improve workflow. See Toolset Gaps. |

**Toolset Gaps Identified:**
1. **`todos` MCP server** – Proposed; currently not listed in `observability.toolset.jsonc`. Adding it would streamline TODO generation from telemetry gaps per SPEC-OBS §3. Implementation required.
2. **Dedicated telemetry helper** – No specialized NDJSON formatting utility; currently relies on filesystem writes. Consider adding a `telemetry` script helper in `dist/genaiscript/shared/` for consistent NDJSON schema enforcement.

**Fallback Behavior:**
- WHEN the proposed `todos` MCP is unavailable (i.e., not yet implemented), THE SYSTEM SHALL append remediation items directly to `TODO.md` via filesystem operations and log the fallback action.
- WHEN remote `fetch` export fails, THE SYSTEM SHALL persist logs locally under `.loaded-vibes/logs/` and queue retry via CLI `doctor` remediation.
- WHEN `memory` MCP is unavailable, THE SYSTEM SHALL rely solely on `dist/genaiscript/state/state.json` for checkpoint persistence without in-memory caching and warn about potential session continuity limitations.

#### 11.1.2 Performance DevCycle (DevCycle 12)

**Required Signals** (per PRD §6; some signals inferred and should be added to TECH_REQUIREMENTS):
- Core Web Vitals baselines
- API latency metrics
- Database query timing
- Memory usage snapshots
- Bundle size deltas
- Regression detection thresholds

**MCP Server Requirements:**

| MCP Server           | Purpose                                                                 | Status   | Notes                                                    |
| -------------------- | ----------------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `filesystem`         | Read source for profiling, write benchmark results and reports          | Required | Already configured; primary I/O for performance data     |
| `git`                | Track optimization commits, generate before/after diffs                 | Required | Already configured; enables regression detection         |
| `memory`             | Cache baseline metrics across phases, persist optimization context      | Required | Already configured; supports incremental optimization    |
| `sequentialthinking` | Structure performance analysis, prioritize optimization targets         | Required | Already configured; aids bottleneck identification       |
| `postgres` (Prisma)  | Query slow-query logs, analyze N+1 patterns, validate index usage       | Required | Already configured; critical for DB performance work     |
| `fetch`              | Retrieve external API performance data, validate endpoint latencies     | Optional | Already configured; used for external dependency profiling|
| `github`             | Post performance reports to PRs, trigger CI benchmarks                  | Optional | Already configured; useful for automated regression gates|

**Recommended MCP Servers (Not Yet Configured):**

| MCP Server           | Purpose                                                                 | Status        | Notes                                                    |
| -------------------- | ----------------------------------------------------------------------- | ------------- | -------------------------------------------------------- |
| `playwright`         | Run browser-based performance tests, capture Web Vitals                 | Not Configured | Playwright is available as a VS Code extension (`ms-playwright.playwright`), but not as an MCP server. Adding an MCP server would enable CWV automation. |
| `runTests`           | Execute Vitest benchmarks, capture timing data programmatically         | Not Configured | Not present as an MCP server; would enable benchmark automation via programmatic test runners. |

**Toolset Gaps Identified:**
1. **`playwright` MCP server** – Not listed; Playwright is currently available only as a VS Code extension. Adding an MCP server would enable automated Core Web Vitals capture and browser performance profiling per PRD §6.
2. **`runTests` MCP server** – Not listed; would allow programmatic benchmark execution via Vitest/Playwright test runners.
3. **Dedicated benchmark CLI entry** – Current toolset lacks `benchmark` in allowed operations at the MCP level; add pnpm/npx benchmark script capability.
4. **Profiler script helper** – No shared utility for consistent metric capture; consider adding `dist/genaiscript/shared/profiler.js` for repeatable benchmarking.

**Fallback Behavior:**
- WHEN `playwright` MCP is unavailable, THE SYSTEM SHALL instruct users to run browser performance tests manually via CLI and provide Lighthouse/DevTools guidance.
- WHEN `runTests` MCP is unavailable, THE SYSTEM SHALL execute benchmarks via direct CLI invocation (`pnpm run benchmark`) and parse stdout for metrics.
- WHEN profiling data is unavailable, THE SYSTEM SHALL coordinate with Observability DevCycle to provision instrumentation before proceeding.

#### 11.1.3 Recommended Toolset Updates

Based on this assessment, the following updates are recommended:

**For `observability.toolset.jsonc`:**
```jsonc
{
  "tools": {
    "mcpServers": [
      "filesystem",
      "git",
      "github",
      "postgres",
      "fetch",
      "memory",
      "sequentialthinking",
      "todos"  // ADD: Streamline TODO generation from telemetry gaps
    ]
  }
}
```

**Shared Utilities (Future Work):**
- `dist/genaiscript/shared/telemetry.js` – NDJSON schema enforcement, log rotation, sanitization hooks.
- `dist/genaiscript/shared/profiler.js` – Metric capture, baseline comparison, regression detection.

#### 11.1.4 Decision Record

| Field       | Value                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| Decision    | DR-2025-11-27-MCP-TOOLSET-ASSESSMENT                                                    |
| Date        | 2025-11-27                                                                              |
| Status      | Accepted                                                                                |
| Context     | Issue #38 requested assessment of MCP/toolset needs for Observability and Performance.  |
| Decision    | Add `todos` MCP to observability toolset; add `playwright` and `runTests` MCPs to performance toolset; document fallback behaviors; track shared utility creation in TODO. |
| Rationale   | Current toolsets lack automation for TODO generation, browser profiling, and benchmark execution. Adding these MCPs aligns with SPEC-OBS §3 and TECH §8 requirements. |
| Consequences| Toolset files require updates; shared utilities tracked as future work in TODO.         |
| References  | SPEC-OBS §1-3, TECH §4.5, TECH §8, PRD §6, Issue #38                                    |

### 11.1 Dashboard & VS Code Integration Architecture (Resolved)

Per [ADR-001](decisions/ADR-001-dashboard-http-api.md), the framework adopts a **hybrid file-based approach**:

- **CLI Dashboard:** Uses Ink/React-Ink components with direct file watching for NDJSON logs and state. No HTTP server required.
- **VS Code Extension:** Uses Extension Host file system APIs (`vscode.workspace.fs`, `fs.watch`) with webview message passing. No HTTP server required.
- **Optional HTTP API (Future):** Reserved for advanced use cases (browser dashboards, remote access). If implemented, SHALL:
  - Bind to `127.0.0.1` only
  - Require per-session authentication token
  - Support explicit opt-in via `loaded-vibes config set api.enabled true`
  - Document security implications in SECURITY.md

This architecture preserves the CLI-first philosophy, avoids network attack surface by default, and meets the `< 200 ms` dashboard latency target `[PRD §5.2]`, `[TECH §5.4]`, `[SPEC-SECURITY §1]`.

This consolidated Technical Requirements document supersedes standalone CLI and engine specs; all future technical changes must update this file and receive PRD sign-off.

