# Loaded Vibes Artifact Specification

**Reference ID:** SPEC-ARTIFACTS  
**Parent Specs:** `PRD.md`, `TECH_REQUIREMENTS.md`

## Purpose

Define the taxonomy, boundaries, and relationships of every Loaded Vibes artifact so DevCycles, CLI flows, and shipped payloads stay consistent with the Spec-Driven Workflow.

## Scope

This spec governs artifact types only.  
It does not define product behavior, technical requirements, CLI behavior, or engine internals.

## Authoritative References

- `[PRD §4.1–4.3]` workspace vs. release separation and directory ownership.
- `[PRD §5.3]` DevCycle governance contract.
- `[TECH §3]` artifact layers + deliverables.
- `[TECH §7]` governance rules for prompts → instructions → toolsets.

## 1. Artifact Types

### 1.1 Global Instructions

Located at `dist/.github/global.instructions.md` (generated from `templates/global_instructions.template.md`).

- WHEN DevCycles run, THE SYSTEM SHALL load the canonical DevCycle list and layer boundaries from this file `[PRD §5.3]`.
- WHEN new artifact categories are introduced, THE SYSTEM SHALL update this spec first, then regenerate global instructions to preserve parity `[TECH §3]`.

### 1.2 Prompts (DevCycle Prompts)

- Location: `templates/devcycles/<cycle>/prompt.md` → shipped copy in `dist/.github/prompts/`.
- One prompt per DevCycle; each must cite `[SPEC-ARTIFACTS]` and the relevant PRD / Tech requirements it fulfills.
- WHEN a prompt is invoked, THE SYSTEM SHALL reference `devcycles.config.json` to hydrate the matching instruction + toolset `[TECH §4.1]`.

### 1.3 Instruction Files (Cycle Instructions)

- Location: `templates/devcycles/<cycle>/instructions.md` → shipped copy in `dist/.github/instructions/`.
- Provide domain constraints, acceptance criteria, security/performance guardrails, and TODO/CHANGELOG expectations `[TECH §3.4]`.
- WHEN TechReq DevCycle definitions change, THE SYSTEM SHALL update the corresponding instructions before re-running the bootstrapper `[PRD §5.3]`.

### 1.4 Toolsets

- Location: `templates/devcycles/<cycle>/toolset.json` (JSONC) → shipped copy in `dist/.github/toolsets/`.
- Define allowed MCP servers, VS Code tools, CLI commands, and safety checks per DevCycle `[TECH §3.5]`.
- Toolsets must not introduce new requirements; they only constrain execution context.

### 1.5 Workspace Profile

- Files: `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/mcp.json`, `.vscode/tasks.json`.
- Define maintainer-only VS Code settings and MCP servers. Shipped equivalents live under `dist/.vscode/` `[TECH §3.6]`.
- Profiles must reference `[SPEC-ARTIFACTS]` to prevent accidental coupling with runtime assets `[PRD §4.2]`.

### 1.6 Bootstrapper

- Workspace location: `/bootstrapper/` (scripts + GenAIScript orchestration entry points) → shipped scripts under `dist/scripts/` `[TECH §4.4]`.
- Prepares workspace, validates manifest parity, and installs dependencies per PRD distribution workflows `[PRD §5.1]`.

### 1.7 Custom Agent

- Works as the glue between DevCycles, toolsets, and workspace instructions `[TECH §3.2]`.
- Must enforce rule order: global instructions → cycle instructions → toolset limitations `[TECH §7]`.

## 2. Artifact Relationships

| Artifact     | Depends On                              | Governed By                 | Primary Outputs                                                |
| ------------ | --------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| Prompts      | Global instructions, manifest entries   | `PRD §5.3`, `TECH §4.1`     | DevCycle entry UX, context capture, requirement citations      |
| Instructions | Prompts, TechReq DevCycle definitions   | `TECH §3.4`, `PRD §5.3`     | Constraints, acceptance criteria, TODO/CHANGELOG hooks         |
| Toolsets     | Instructions, workspace profile         | `TECH §3.5`, `TECH §7`      | Tool/MCP allowances, safety gates, destructive-action policies |
| Profile      | Artifact spec, TechReq workspace limits | `PRD §4.2`, `TECH §1`       | Maintainer IDE settings, MCP config, tasks                     |
| Bootstrapper | Manifest, toolsets, profile             | `PRD §5.1`, `TECH §4.4`     | Environment readiness report, CLI entry points, parity checks  |
| Custom agent | Global instructions + cycle assets      | `PRD §2`, `TECH §3.2`, `§7` | Deterministic DevCycle execution + governance enforcement      |

## 3. Constraints

- Artifacts cannot override `PRD.md` or `TECH_REQUIREMENTS.md`; changes flow PRD → TechReq → specs `[PRD §4]`.
- Artifacts cannot define new “shall” requirements; they reiterate or contextualize product/technical rules.
- Artifacts must remain backward-compatible with engine interfaces and CLI manifest schema `[TECH §4.1]`.
- WHEN artifacts are regenerated, THE SYSTEM SHALL update `TODO.md`/`CHANGELOG.md` with traceable references `[TECH §7]`.

## 4. Validation & Tagging

- Every GitHub issue or PR touching artifacts must cite `[SPEC-ARTIFACTS]` plus the originating PRD/Tech clause.
- Bootstrapper + CI SHALL verify artifact presence, schema compliance, and manifest references before DevCycles run `[TECH §4.4]`.
- Example issue note: `Implementation must follow artifact taxonomy in [SPEC-ARTIFACTS] and reference PRD §4.1`.

