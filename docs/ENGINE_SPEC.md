# Loaded Vibes Engine & Automation Specification

**Document Control**  
- **Status:** Draft (ready for engineering review)  
- **Owners:** Framework Architecture & Tooling Team  
- **Last Updated:** 2025-11-24  
- **Related Artifacts:** `docs/PRD.md` (§6, §7), `docs/TECH_REQUIREMENTS.md` (§2, §3), `lv_artifacts/.github/global.instructions.md`

## 1. Purpose & Scope
- WHEN the framework executes any DevCycle, THE SYSTEM SHALL rely on a deterministic orchestration layer that binds prompts, instructions, and toolsets (PRD §7.4, TechReq §4.4).
- WHEN contributors author new automation, THE SYSTEM SHALL keep shipped assets (`lv_artifacts/*`) isolated from development assets (PRD §6.2).
- Scope covers orchestration, phase execution, bootstrap automation, state handling, and tool governance for all eighteen DevCycles.

## 2. Objectives & Success Criteria
1. **Single Source of Truth:** Centralize DevCycle metadata (instructions, prompts, toolsets) in a shared manifest accessible to GenAIScript + bootstrap scripts.
2. **Deterministic Flow:** Enforce the Spec-Driven Workflow (Analyze → Design → Implement → Validate → Reflect → Handoff) inside every DevCycle. Success = each phase emits plan, execution log, validation evidence, and changelog hook.
3. **Context Hygiene:** Guarantee every run loads PRD, Tech Requirements, todo/changelog snapshots, and prior outputs without touching runtime `src/` trees.
4. **Human-in-the-loop:** Provide pause/resume checkpoints for plan approval, risky actions, and final review per TechReq §4.4.
5. **Extensibility:** Adding a DevCycle requires updating only the manifest, not bespoke code paths.

## 3. Architecture Overview
| Layer | Responsibilities | Key Artifacts |
| --- | --- | --- |
| **Bootstrap Layer** | Detect profile gaps, sync MCP + extensions, expose CLI entry points. | `lv_artifacts/scripts/bootstrapper.genaiscript.ts`, `bootstrapper.ps1` |
| **Orchestration Layer** | Accept user input (phase, task, mode), load manifest, hydrate context, coordinate phase lifecycle. | `lv_artifacts/genaiscript/orchestrator.genai.js`, `devcycles.config.json` |
| **Phase Runner Layer** | Execute DevCycle-specific logic: gather context, invoke prompts, enforce instructions/toolsets, emit outputs. | `lv_artifacts/genaiscript/phases/*.genai.js` |
| **Shared Utilities** | Context loading, state persistence, validation, logging. | `lv_artifacts/genaiscript/shared/context.js`, `shared/state.js` |
| **Governance Layer** | Instructions, prompts, toolsets, tasks, changelog. | `lv_artifacts/.github/**`, `todo.md`, `CHANGELOG.md` |

## 4. Component Specifications
### 4.1 DevCycle Manifest (`devcycles.config.json`)
- Maps canonical DevCycle keys → { instructions, toolset, prompt, default tools, required contexts, stop-points }.
- Consumed by orchestrator + bootstrapper so both stay aligned. Manifest validation runs at bootstrap time.

### 4.2 Orchestrator Script
- Parameters: `phase`, `task`, `mode` (`plan-only`, `execute`, `validate`), `skipBootstrap`.
- Responsibilities: bootstrap check, manifest validation, context hydration, plan generation, phase invocation, result collation, human checkpoint prompts.
- Tooling: `filesystem`, `git`, `memory`, `sequentialthinking`, `runTests`, `todos`, `runSubagent`.
- Outputs: structured log (per phase), plan summary, validation evidence stub, memory/todo updates.

### 4.3 Phase Runner Template
- Steps per DevCycle:
  1. **Analyze:** Load PRD/TechReq excerpts + DevCycle instructions; produce requirement digest.
  2. **Design:** Request plan from LLM referencing manifest context.
  3. **Implement:** Execute tasks gated by toolset allowances; require confirmation for destructive ops.
  4. **Validate:** Run tests or verifications (if available) and summarize.
  5. **Reflect/Handoff:** Update TODO + CHANGELOG entries referencing DevCycle + PRD clause.
- Each phase script exports metadata (name, description, required inputs) to support discoverability.

### 4.4 Bootstrapper Flow
1. Ensure VS Code profile + MCP config align with TechReq §2.6.
2. Validate manifest coherence (instructions/toolset/prompt files exist).
3. Provide CLI entry points: `pwsh ./lv_artifacts/scripts/bootstrapper.ps1 -Phase scaffolding`, `npx genaiscript run ./lv_artifacts/genaiscript/orchestrator.genai.js --phase scaffolding`.
4. Expose machine-readable status for CI gating.

### 4.5 State & Telemetry
- Store execution snapshot in `memory/state.json` (phase, params, outputs, timestamps).
- Append summary stub to `todo.md` + `CHANGELOG.md`; full content handled by DevCycle instructions.
- Provide hook for future telemetry (TechReq §6 open question).

## 5. Data Flow
1. User invokes bootstrapper → ensures environment + manifest.
2. Orchestrator loads manifest, determines phase, fetches required context (PRD, TechReq, TODO, CHANGELOG, memory).
3. Orchestrator generates plan (LLM) referencing instructions to confirm understanding.
4. Orchestrator runs phase script with context + plan + manifest entry.
5. Phase script performs work, updates tracking docs, returns status.
6. Orchestrator logs outputs, surfaces checkpoints, optionally advances to next phase.

## 6. Non-Functional Requirements
- **Security:** Never touch `lv_artifacts/src/**`, block secret exfiltration, enforce restricted paths (PRD §9). All prompts include safety guardrails from `genaiscript-extension.instructions.md`.
- **Performance:** Cache context loads, stream long outputs, parallelize independent validations (TechReq §2.7).
- **Reliability:** Fail fast on missing manifest entries or instructions; provide actionable remediation instructions.
- **Extensibility:** Adding or editing a phase requires editing only `devcycles.config.json` + optional new phase script.

## 7. Implementation Plan (High Level)
1. **Manifest & Shared Utilities** – Create `devcycles.config.json`, `shared/context.js`, `shared/state.js`.
2. **Orchestrator Rewrite** – Implement param parsing, bootstrap invocation, context hydration, plan + execution pipeline.
3. **Phase Template** – Create base helper `phases/phase-runner.genai.js`; refactor `scaffolding.genai.js` to new template, add placeholders for remaining phases (stub referencing instructions).
4. **Bootstrapper Updates** – Align `.ts` manifest import, add validation + CLI entry, update PowerShell wrapper to call orchestrator or CLI with defaults.
5. **Documentation & Hooks** – Update README/CHANGELOG after DevCycle runs (future automation).

## 8. Open Questions / Future Enhancements
- Should orchestrator auto-chain phases or default to single-phase per invocation? (Recommend single-phase with optional `--chain next` flag.)
- How should telemetry integrate with `lv_artifacts/genaiscript/tools`? (Placeholder for future MCP-based logging tools.)
- Determine format for persisted execution summaries (JSON vs Markdown) before enabling CI gating.

## 9. Validation Strategy
- `genaiscript test` for orchestrator + phase scripts with mocked env vars.
- Dry-run mode (`mode=plan-only`) to ensure instructions load without file mutations.
- Unit-style prompts verifying manifest coherence + context loader output.

This specification satisfies the request for an optimized engine/infrastructure/tooling architecture and guides the subsequent code overhaul.
