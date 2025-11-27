# Contributor Workflow Guide

**References:** `[SPEC-DEV §4]`, `[PRD §4.2, §5.3–§5.5]`, `[TECH_REQUIREMENTS §7–§10]`, `[SPEC-SECURITY §2]`

This guide explains how maintainers move from updated requirements to merge-ready pull requests without breaking the Spec-Driven Workflow. It ties every action to the governing specs, highlights the required automation, and lists the evidence reviewers expect in TODO/CHANGELOG entries.

## Requirements (EARS)

- **WHEN** a contributor updates `docs/PRD.md` or `docs/TECH_REQUIREMENTS.md`, **THE SYSTEM SHALL** capture the change in EARS format and cite the originating clause before any implementation begins `[PRD §5.3, SPEC-DEV §4]`.
- **WHEN** documentation, instructions, or prompts diverge from templates, **THE SYSTEM SHALL** regenerate the impacted artifacts from `templates/` and confirm parity using the bootstrapper validations `[PRD §4.2, TECH §7, SPEC-DEV §2]`.
- **WHEN** a DevCycle touches shipped automation, **THE SYSTEM SHALL** run `loaded-vibes doctor` plus `genaiscript test` to provide automated validation artifacts `[PRD §5.4, TECH §8, §10, SPEC-DEV §3, Issue #32]`.
- **WHEN** work reaches Reflect/Handoff, **THE SYSTEM SHALL** append TODO/CHANGELOG entries referencing DevCycle ID + requirement IDs and archive NDJSON evidence `[PRD §5.3, TECH §7, SPEC-OBS §3]`.

## Workflow Overview

| Stage                    | Goal                                                                 | Key Evidence                          |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------- |
| 1. Spec Alignment        | Capture requirement deltas in PRD/TechReq with EARS citations.       | Updated clauses, ADR if needed        |
| 2. Template Regeneration | Sync `templates/` and regenerate shipped assets via DevCycle gating. | Updated templates + regenerated files |
| 3. Bootstrapper Parity   | Prove workspace + shipped assets stay aligned.                       | `bootstrapper.ps1` JSON report        |
| 4. Testing & Diagnostics | Run `loaded-vibes doctor` + `genaiscript test` (and other suites).   | NDJSON logs, CLI exits 0              |
| 5. Evidence Capture      | Update TODO/CHANGELOG with requirement IDs and DevCycle tags.        | Markdown entries + referenced files   |
| 6. PR Handoff            | Package summaries, attach artifacts, cite specs/DevCycles.           | PR template filled, links to evidence |

## Step-by-Step Guidance

### 1. Align and Author Requirements

1. Edit `docs/PRD.md` and/or `docs/TECH_REQUIREMENTS.md` directly under `docs/` (the only authorized location per `[PRD §4.2]`).
2. Express new or changed requirements using EARS syntax and cite both PRD + Tech clauses inline before attempting implementation `[SPEC-DEV §4]`.
3. If a design choice affects governance or tooling, create/update a Decision Record under `docs/decisions/` and reference it in the relevant clauses.
4. Record the requirement IDs you will reference later in TODO/CHANGELOG entries; DevCycle manifests expect these IDs `[TECH §7]`.

### 2. Regenerate Templates & Shipped Assets

1. Modify the matching template in `templates/` (e.g., `templates/devcycle_documentation.template.md`) so that future regenerations stay consistent `[PRD §4.2]`.
2. Use the DevCycle pipeline to rebuild shipped artifacts:
   - Preview: `loaded-vibes devcycle documentation --mode plan-only` to confirm scope.
   - Execute: `loaded-vibes devcycle documentation --mode execute` (or `npx genaiscript run dist/genaiscript/orchestrator.genai.js --phase documentation`) to regenerate `dist/.github/**` assets bound to Documentation DevCycle `[TECH §7]`.
3. Validate that prompts → instructions → toolsets still resolve in `dist/genaiscript/devcycles.config.json`; the manifest + CI checks rely on those file paths `[TECH §7, SPEC-ARTIFACTS §3]`.

### 3. Verify Bootstrapper Parity

1. Run the PowerShell bootstrapper to ensure the workspace profile, MCP endpoints, and manifest remain consistent with shipped requirements `[TECH §4.4, SPEC-SECURITY §2, Issue #13]`:
   ```powershell
   pwsh dist/scripts/bootstrapper.ps1 -Check -JsonOutput .agent_work/bootstrapper-validation.json
   ```
2. Review the JSON report for failures involving VS Code profiles, MCP servers, or manifest mismatches. Resolve discrepancies in `.vscode/`, `.github/`, or `devcycles.config.json` before proceeding.

### 4. Execute Testing & Diagnostics

1. Run the retro CLI diagnostics to satisfy `[PRD §5.4]` and surface remediation hints:
   ```powershell
   loaded-vibes doctor --json > .agent_work/doctor.json
   ```
   Include the resulting NDJSON log path in your TODO/CHANGELOG entries.
2. Execute GenAIScript coverage per `[TECH §10]` whenever orchestrator, phase scripts, or instructions change:
   ```powershell
   npx genaiscript test dist/genaiscript/tests
   ```
3. If code changes affect the CLI or runtime, add `pnpm test`, `pnpm lint`, or command-specific smoke tests (e.g., `node tests/cli/smoke.test.js`) and archive their outputs alongside the doctor report.

### 5. Update TODO & CHANGELOG

1. Append or update the relevant table rows in `TODO.md`, changing the status column and citing the governing requirement IDs (e.g., `SPEC-DEV §4`, `TECH §7`).
2. Add a `CHANGELOG.md` action log entry using the Streamlined Action Log format with:
   - Category + timestamp
   - Goal referencing Issue/DevCycle
   - Action summary citing specs (e.g., `PRD §5.3`, `TECH §7–§8`)
   - Result + Next steps, plus `→ DevCycle: documentation`
3. Mention where validation artifacts live (`.agent_work/bootstrapper-validation.json`, doctor output, test logs) so reviewers can trace evidence `[SPEC-OBS §3]`.

### 6. Prepare Pull Request & DevCycle Gate

1. Re-run `loaded-vibes devcycle documentation --plan-only` to ensure no new TODOs or approvals are pending before handoff.
2. Complete `PULL_REQUEST_TEMPLATE.md` with:
   - `Closes #<issue>` (Issue #30 in this case)
   - DevCycle alignment (Documentation)
   - Validation evidence (bootstrapper, doctor, `genaiscript test` outputs)
3. Attach TODO/CHANGELOG diff excerpts, NDJSON log references, and spec citations so reviewers can verify compliance with `[TECH §7–§8]` and `[SPEC-DEV §4]`.

## Tooling Reference

| Command                                                        | Purpose                                                      | Requirement Tie                            |
| -------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `loaded-vibes devcycle documentation --plan-only`              | Dry-run Documentation DevCycle to confirm manifest + scope   | `TECH §7`, `SPEC-DEV §4`                   |
| `loaded-vibes devcycle documentation --mode execute`           | Regenerate documentation/template artifacts via orchestrator | `PRD §5.3`, `TECH §7`                      |
| `pwsh dist/scripts/bootstrapper.ps1 -Check -JsonOutput <file>` | Validate VS Code profile, MCP endpoints, manifest parity     | `TECH §4.4`, `SPEC-SECURITY §2`, Issue #13 |
| `loaded-vibes doctor --json`                                   | Run diagnostics, gather NDJSON evidence                      | `PRD §5.4`, `TECH §8`                      |
| `npx genaiscript test dist/genaiscript/tests`                  | Execute orchestrator + phase tests                           | `TECH §10`, Issue #32                      |
| `pnpm test` / `pnpm lint`                                      | Code-quality enforcement for supporting modules              | `SPEC-DEV §3`, `SPEC-CLI §6`               |

## Checklist Before Handoff

- [ ] PRD/Tech clauses updated with EARS requirements + spec citations.
- [ ] Templates regenerated and DevCycle outputs verified via orchestrator run.
- [ ] Bootstrapper JSON report clean; issues resolved or documented.
- [ ] `loaded-vibes doctor` + `genaiscript test` passed with logs archived.
- [ ] TODO/CHANGELOG entries updated with DevCycle + requirement IDs.
- [ ] PR template completed with evidence links and references to Issue #30.

Following this workflow keeps the Loaded Vibes repository compliant with Spec-Driven governance while giving reviewers a predictable packet of requirements, validations, and traceability artifacts.
