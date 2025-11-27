# TODO

This backlog tracks Spec-Driven Workflow actions for the Loaded Vibes framework. Update this file at the end of every DevCycle per `docs/PRD.md` §2 and `docs/TECH_REQUIREMENTS.md` §10.

## Active Items

### Engine & Orchestration

| Status | Item                                                                                                                                                                                          | Source                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| ☐      | Finish GenAIScript engine coverage: populate `devcycles.config.json` entries for all 18 phases, author prompts/toolsets/instructions, and ensure phase scripts update TODO/CHANGELOG + state. | Tech Requirements §4.1-4.3, SPEC-ENGINE §3 |
| ☐      | Implement orchestrator context hydration: load PRD, TechReq, TODO, CHANGELOG, and `state.json` before Analyze phase.                                                                          | Tech Requirements §4.2, SPEC-ENGINE §4     |
| ☑      | Build phase runner template with Analyze → Design → Implement → Validate → Reflect stages and EARS requirement citations.                                                                     | Tech Requirements §4.3, SPEC-ENGINE §4     |
| ☐      | Integrate DevCycle runner service that streams `genaiscript/orchestrator.genai.js` output into CLI with pause/resume checkpoints and approval prompts.                                        | Tech Requirements §4.2, SPEC-ENGINE §4     |
| ☑      | Create shared utilities (`dist/genaiscript/shared/*.js`) for context loading, memory persistence, validation helpers.                                                                         | Tech Requirements §2, SPEC-ARCH §1.2       |

### CLI & Dashboard

| Status | Item                                                                                                                                                                                                              | Source                                            |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| ☐      | Ship the `create-loaded-vibes` npm package with download/verification/extraction flow plus `loaded-vibes init` automation that mirrors `dist/**` into `.loaded-vibes/`.                                           | PRD §5.1-5.3, Tech Requirements §5.1, SPEC-CLI §3 |
| ☐      | Build the retro dashboard (`loaded-vibes dashboard`) with synthwave UI: ASCII masthead, gradient canvas, DevCycle queue, live logs, metrics, TODO/CHANGELOG feeds, notifications, and command palette (`Ctrl+P`). | PRD §5.2, Tech Requirements §5.2, SPEC-CLI §2     |
| ☐      | Implement `loaded-vibes doctor` diagnostics: scan prerequisites, MCP availability, file permissions, manifest drift, with auto-remediation prompts.                                                               | PRD §5.4, Tech Requirements §5.3, SPEC-CLI §4     |
| ☐      | Implement `loaded-vibes logs` command: surface NDJSON traces from `.loaded-vibes/logs/*.ndjson`, filterable by DevCycle/time/severity, with Markdown export.                                                      | Tech Requirements §5.3, SPEC-CLI §4, SPEC-OBS §3  |
| ☐      | Implement `loaded-vibes devcycle <name>` to manually trigger DevCycles from CLI, streaming orchestrator events with requirement ID citations.                                                                     | Tech Requirements §5.2, SPEC-CLI §1               |
| ☐      | Implement `loaded-vibes upgrade` for updating `.loaded-vibes/` assets with semantic versioning + diff hints.                                                                                                      | Tech Requirements §11, SPEC-CLI §3                |
| ☐      | Implement retrofit/attach workflow (Mirror / Merge / Sandbox) with conflict detection for `.github`, `.vscode`, and `dist/**`, logging results to `.loaded-vibes/logs/install-YYYYMMDD.md`.                       | PRD §5.1, Tech Requirements §5.1, SPEC-CLI §3     |

### Bootstrapper & Validation

| Status | Item                                                                                                                                                       | Source                                        |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ☐      | Harden bootstrapper (TS + PowerShell) to validate VS Code profiles, MCP endpoints, manifest coherence, and emit machine-readable JSON status for CI + CLI. | Tech Requirements §4.4, SPEC-SECURITY §2      |
| ☑      | Implement preflight checks: verify Node ≥ 20, git, pnpm, VS Code, GenAIScript extension with actionable remediation guidance.                              | PRD §5.1, Tech Requirements §5.1, SPEC-CLI §3 |
| ☐      | Add CI validation that `dist/.github/global.instructions.md` DevCycle list matches Tech Requirements §6 canonical table.                                   | Tech Requirements §10, SPEC-DEV §2            |

### Observability & Logging

| Status | Item                                                                                                                     | Source                                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| ☐      | Implement NDJSON log format with fields: `devCycleId`, `phase`, `requirementId`, `severity`, `checkpointId`, timestamps. | Tech Requirements §4.5, SPEC-OBS §1-3       |
| ☐      | Persist execution snapshots in `dist/genaiscript/state/state.json` with phase, params, outputs, timestamps.              | Tech Requirements §4.5, SPEC-ENGINE §5      |
| ☐      | Generate Markdown summaries from NDJSON for TODO/CHANGELOG updates with requirement ID references.                       | PRD §5.3, Tech Requirements §7, SPEC-OBS §3 |
| ☐      | Implement dual-mode execution summaries (JSON + Markdown) per ADR-0001; create `summary-writer.js` utility.              | Tech Requirements §11, SPEC-OBS §2, ADR-0001 |

### Security & Safety

| Status | Item                                                                                                                                | Source                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| ☐      | Implement SHA256 verification for all downloaded releases; block unsigned payloads with actionable guidance.                        | PRD §5.5, Tech Requirements §5.4, SPEC-SECURITY §1-2 |
| ☐      | Implement "Bad Vibes Firewall" prompts for destructive operations: describe affected paths, required approvals, and rollback steps. | PRD §5.5, Tech Requirements §5.4, SPEC-SECURITY §1   |
| ☐      | Confine CLI file writes to `.loaded-vibes/**` unless user explicitly approves template copies to project root.                      | PRD §5.5, Tech Requirements §5.4, SPEC-SECURITY §1   |
| ☐      | Add secret/environment variable redaction hooks in NDJSON logs and telemetry exports.                                               | Tech Requirements §9, SPEC-SECURITY §2, SPEC-OBS §4  |
| ☐      | Ensure DevCycle operations are idempotent; rerunning cannot corrupt workspace or shipped artifacts.                                 | Tech Requirements §9, SPEC-SECURITY §1               |

### Governance & Artifacts

| Status | Item                                                                                                                                                                              | Source                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ☑      | Implement CI guard that ensures `.vscode/settings.json` only references `.github/copilot-instructions.md` (no shipped instructions) and blocks edits outside allowed directories. | Tech Requirements §11, PRD §4.3, SPEC-ARCH §3 |
| ☐      | Add CI checks verifying manifest entries (`devcycles.config.json`) resolve to valid prompt/instruction/toolset files.                                                             | Tech Requirements §7, SPEC-ARTIFACTS §3       |
| ☐      | Validate artifact presence, schema compliance, and manifest references during bootstrap before DevCycles run.                                                                     | Tech Requirements §4.4, SPEC-ARTIFACTS §4     |
| ☑      | Add reusable `tasks.json` entries for orchestrator runs, retro CLI smoke tests, lint/test shortcuts, and bootstrap validation.                                                    | Tech Requirements §8                          |

### Documentation

| Status | Item                                                                                                                                                                | Source                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| ☐      | Author end-user documentation (README quickstart, SUPPORT, SECURITY, CHANGELOG) explaining installation, dashboard usage, DevCycle governance, and troubleshooting. | PRD §§2-4, Tech Requirements §5.2            |
| ☐      | Document contributor workflow: PRD/Tech update → template regeneration → bootstrapper parity → `doctor` + `genaiscript test` → TODO/CHANGELOG.                      | SPEC-DEV §4, Tech Requirements §7-8          |
| ☐      | Map CLI telemetry + changelog deltas to DevCycle identifiers for release notes compliance.                                                                          | PRD §5.4, Tech Requirements §10, SPEC-OBS §3 |

### Testing & Validation

| Status | Item                                                                                                                  | Source                             |
| ------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| ☐      | Implement `genaiscript test` coverage for orchestrator + phase scripts with mocked env.                               | Tech Requirements §10, SPEC-DEV §3 |
| ☐      | Create CLI smoke tests covering `create`, `dashboard`, `doctor`, `logs`, `devcycle`, `upgrade` commands.              | Tech Requirements §10, SPEC-CLI §6 |
| ☐      | Maintain mapping between PRD clauses and manifest entries; CLI logs must include `requirementId` metadata for audits. | Tech Requirements §10, SPEC-OBS §3 |

### Open Questions (Tech Requirements §12)

| Status | Item                                                                                       | Source                |
| ------ | ------------------------------------------------------------------------------------------ | --------------------- |
| ☐      | Evaluate optional local HTTP API for CLI dashboards or VS Code webviews.                   | Tech Requirements §12 |
| ☐      | Design versioning strategy for user customizations inside `.loaded-vibes` during upgrades. | Tech Requirements §12 |
| ☐      | Assess additional MCP/toolset needs for observability/performance phases.                  | Tech Requirements §12 |
| ☐      | Determine persisted execution summary format (JSON vs Markdown) before enabling CI gating. | Tech Requirements §12 |
| ☐      | Evaluate optional local HTTP API for CLI dashboards or VS Code webviews.                   | Tech Requirements §12 |
| ☐      | Assess additional MCP/toolset needs for observability/performance phases.                  | Tech Requirements §12 |
| ☐      | Determine persisted execution summary format (JSON vs Markdown) before enabling CI gating. | Tech Requirements §11 |
| ☑      | Evaluate optional local HTTP API for CLI dashboards or VS Code webviews.                   | Tech Requirements §11.1, ADR-001 |
| ☐      | Design versioning strategy for user customizations inside `.loaded-vibes` during upgrades. | Tech Requirements §11 |
| ☑      | Assess additional MCP/toolset needs for observability/performance phases.                  | Tech Requirements §11.1 |

### MCP/Toolset Follow-up Items (Tech Requirements §11.1)

| Status | Item                                                                                       | Source                     |
| ------ | ------------------------------------------------------------------------------------------ | -------------------------- |
| ☐      | Update `observability.toolset.jsonc` to add `todos` MCP server.                            | Tech Requirements §11.1.3  |
| ☐      | Update `performance.toolset.jsonc` to add `playwright` and `runTests` MCP servers.         | Tech Requirements §11.1.3  |
| ☐      | Create `dist/genaiscript/shared/telemetry.js` for NDJSON schema enforcement.               | Tech Requirements §11.1.3  |
| ☐      | Create `dist/genaiscript/shared/profiler.js` for metric capture and regression detection.  | Tech Requirements §11.1.3  |

## Recently Completed

| Status | Item                                                                                                        | Notes                                      |
| ------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| ☑      | Decided execution summary format: dual-mode JSON + Markdown output (ADR-0001). Closes #35.                  | See [ADR-0001](../docs/decisions/ADR-0001-execution-summary-format.md), TECH §11 |
| ☑      | Evaluated local HTTP API for CLI dashboards and VS Code webviews.                                           | Hybrid file-based approach adopted; see `docs/decisions/ADR-001-dashboard-http-api.md`, TECH §11.1 |
| ☑      | Design versioning strategy for user customizations inside `.loaded-vibes` during upgrades.                  | ADR-001 created; Tech Requirements §11 updated; Closes #37 |
| ☑      | Assessed MCP/toolset needs for Observability and Performance DevCycles (Issue #38).                         | Logged in Tech Requirements §11.1          |
| ☑      | Consolidated PRD + Tech Requirements to absorb CLI & engine specs.                                          | Logged in `CHANGELOG.md`                   |
| ☑      | Created 7 spec files (SPEC-ARCH, SPEC-ARTIFACTS, SPEC-CLI, SPEC-DEV, SPEC-ENGINE, SPEC-OBS, SPEC-SECURITY). | Provide reusable references for issues/PRs |
