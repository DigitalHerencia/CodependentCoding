```instructions
---
name: initialization.instructions
applyTo: "**"
description: "Domain-agnostic rules for the Initialization DevCycle."
---

# Initialization DevCycle Instructions

## 1. Purpose
- Establish the Loaded Vibes environment state before any other DevCycle executes.
- Validate PRD (`docs/PRD.md`), Tech Requirements (`docs/TECH_REQUIREMENTS.md`), templates, and shipped artifacts for completeness.
- Produce an environment readiness report and log remediation tasks for human review.

## 2. Responsibilities
### 2.1 Audit VS Code & MCP Environment
- Enumerate installed VS Code extensions, settings, and CLI tasks exposed through the Initialization toolset.
- Detect available MCP servers (filesystem, git, github, postgres, fetch, memory, sequentialthinking) and verify connectivity per `.vscode/mcp.json`.

### 2.2 Audit Workspace Structure
- Confirm `.github/`, `.vscode/`, `docs/`, `templates/`, and `lv_artifacts/` match the ownership model (PRD §6.2).
- Ensure `global.instructions.md`, prompts, instructions, toolsets, orchestrators, and bootstrapper scripts exist and are readable.

### 2.3 Validate Source Documents
- Parse the PRD and Tech Requirements, ensuring all mandatory sections exist (architecture, data, security, testing, deployment, updates, etc.).
- Flag missing appendices, outdated dates, or contradictions between documents and log follow-up tasks.

### 2.4 Establish Baselines
- Capture revision hashes or timestamps for critical artifacts (global instructions, orchestrator scripts, templates, bootstrapper scripts).
- Record current git status, branch name, pending changes, and open tasks for downstream DevCycles.

### 2.5 Report Readiness
- Generate a readiness summary describing findings, blockers, and remediation actions.
- Update `todo.md` and `CHANGELOG.md` with any gaps discovered during initialization.

## 3. Inputs
- `docs/PRD.md`
- `docs/TECH_REQUIREMENTS.md`
- `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/mcp.json`
- Template catalog under `templates/`
- Shipped assets in `lv_artifacts/`

## 4. Outputs
- Environment readiness summary with pass/fail indicators per audit category
- Logged tasks for missing tooling, docs, or assets
- Changelog entry referencing Initialization findings

## 5. Success Criteria
- All mandatory assets exist and pass syntax validation.
- Toolset components listed in `../toolsets/initialization.toolset.jsonc` respond successfully.
- Human reviewer confirms readiness to proceed or accepts the documented remediation plan.

## 6. Error Handling
- Stop execution if PRD or Tech Requirements are missing or invalid; request updated copies.
- Surface unavailable MCP servers/extensions with actionable steps to install or reconfigure them.
- Record git conflicts or dirty states requiring human intervention before proceeding.

## 7. Toolset Hook
Use only the capabilities declared in `../toolsets/initialization.toolset.jsonc`.

## 8. Traceability
- WHEN a framework session begins, THE SYSTEM SHALL execute this Initialization DevCycle before any other work (PRD §7.4, TechReq §2.4/§3).
- WHEN readiness gaps are detected, THE SYSTEM SHALL log remediation tasks and changelog notes mapped to PRD oversight requirements (PRD §8, TechReq §7).
```
