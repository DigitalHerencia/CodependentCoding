# Loaded Vibes Development Rules & Contributor Guide

**Reference ID:** SPEC-DEV

## Purpose

Define maintainer workflows, allowed edits, and proper modification practices across the Loaded Vibes workspace.

## Authoritative References

- `[PRD §2]` Separation of concerns and success metrics.
- `[PRD §4.1–4.3]` Directory responsibilities and workspace vs. release boundaries.
- `[PRD §5.2–5.4]` CLI, DevCycle governance, and observability expectations.
- `[TECH §1]` System context constraints.
- `[TECH §7–8]` Governance and tooling automation rules.

## 1. Allowed Modification Zones

| Folder       | Allowed Edits                          | Forbidden Edits             | Notes                                                                     |
| ------------ | -------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `.github/`   | Workflows, issue templates, automation | Modifying shipped artifacts | Reference `[PRD §4.2]`; store Copilot + MCP governance only.              |
| `.vscode/`   | Profile definitions, extensions        | Modifying runtime assets    | Must align with shipped `.vscode` snapshot `[TECH §3.6]`.                 |
| `docs/`      | Spec updates, documentation upkeep     | Injecting new requirements  | All new requirements must first land in PRD/Tech `[PRD §4.2]`.            |
| `templates/` | Prompt and instruction maintenance     | Altering canonical rules    | Templates mirror shipped assets; regenerate via bootstrapper `[TECH §3]`. |

WHEN edits fall outside these folders, THE SYSTEM SHALL treat them as shipped artifact changes and require explicit approval plus TODO/CHANGELOG entries `[PRD §4.1]`.

## 2. DevCycle Authoring Rules

- All prompt and instruction changes must reference `docs/PRD.md` or `docs/TECH_REQUIREMENTS.md`; cite EARS clauses inline `[TECH §7]`.
- Every GitHub PR involving specs must cite at least one spec ID plus the impacted PRD/Tech sections.
- DevCycle logic must live in templates only; never embed cycle logic directly into runtime code `[PRD §5.3]`.
- WHEN new DevCycles are proposed, THE SYSTEM SHALL update `TECH_REQUIREMENTS.md §6` and this spec before touching manifests or instructions.
- Maintain TODO/CHANGELOG evidence for each DevCycle edit, including manifest validation results `[TECH §7]`.

## 3. Local Testing & Validation

- Use the Loaded Vibes dashboard for inspection before submitting changes; ensure DevCycle queues mirror manifest entries `[PRD §5.2]`.
- Run `loaded-vibes doctor` prior to every pull request to validate the workspace and capture NDJSON logs referenced in PRs `[PRD §5.4]`.
- Execute `genaiscript test` for orchestrator/phase edits and commit logs with requirement IDs `[TECH §10]`.
- Document manual verification in `TODO.md` / `CHANGELOG.md` as part of the Spec-Driven Workflow.

## 4. Contributor Workflow Checklist

1. Update PRD/Tech if requirements change → regenerate affected templates → run bootstrapper parity checks.
2. Run `loaded-vibes doctor` and `genaiscript test` → attach outputs to PR/JIRA.
3. Update TODO/CHANGELOG with DevCycle ID, requirement references, validation summary.
4. Tag PR/issue with `[SPEC-DEV]` plus other impacted specs.

## 5. GitHub Issue Tagging

- Tag all development-governance issues with `[SPEC-DEV]`.
- Include `Requirement:` lines referencing PRD/Tech sections and attach NDJSON log excerpts when relevant.
