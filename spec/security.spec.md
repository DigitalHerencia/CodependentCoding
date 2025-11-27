# Loaded Vibes Security Specification

**Reference ID:** SPEC-SECURITY  
**Parent:** `TECH_REQUIREMENTS.md`

## Purpose

Centralize all security constraints already declared in `PRD.md` and `TECH_REQUIREMENTS.md`.

## Authoritative References

- `[PRD §5.5]` Bad Vibes Firewall, checksum verification, destructive-action approvals.
- `[PRD §5.4]` Observability/logging expectations.
- `[TECH §5.4]` CLI security/performance controls.
- `[TECH §9]` Security, quality, compliance guardrails.

## 1. Policies

- File writes restricted to allowed directories only `[PRD §5.5]`.
- SHA integrity checks required for templates and release archives; unsigned payloads stop execution.
- Secrets must be redacted in logs and telemetry exports `[TECH §9]`.
- DevCycles must be idempotent; rerunning cannot corrupt workspace or shipped assets `[TECH §9]`.
- “Bad Vibes Firewall” warnings must trigger pipeline stops and require human approval before retry `[PRD §5.5]`.
- CI must validate PRD + TechReq references plus manifest parity before releasing artifacts `[TECH §7]`.

## 2. Component Controls

| Component     | Mandatory Controls                                                                            | References                      |
| ------------- | --------------------------------------------------------------------------------------------- | ------------------------------- |
| Bootstrapper  | Dependency scan, VS Code/MCP profile verification, manifest parity check, checksum validation | `PRD §5.1`, `TECH §4.4`, `§5.1` |
| Orchestrator  | Enforce prompt → instruction → toolset chain, checkpoint approvals, restricted tool access    | `PRD §5.3`, `TECH §4.2`, `§7`   |
| CLI           | SHA256 verification, limited write scope, firewall prompts for destructive operations         | `PRD §5.5`, `TECH §5.4`         |
| Logging Stack | NDJSON redaction hooks, severity filters, opt-out toggle, requirement ID tagging              | `PRD §5.4`, `TECH §4.5`         |
| Templates     | Immutable after release; regeneration requires PRD/Tech updates + signed outputs              | `PRD §4.1`, `TECH §3`           |

## 3. DevCycle Hardening Checklist

1. Validate instruction + toolset existence before Analyze phase; fail fast when missing `[TECH §4.1]`.
2. Require checkpoint approvals for destructive operations (file deletes, migrations) recorded in NDJSON logs `[PRD §5.3]`.
3. Redact secrets/env vars before persisting reflect outputs or telemetry `[TECH §9]`.
4. Update TODO/CHANGELOG with security impacts, requirement IDs, and remediation tasks `[TECH §7]`.

## 4. GitHub Issue Tagging

- Tag reference: `[SPEC-SECURITY]`.
- Include affected component, requirement citations, and firewall/log excerpts for triage.
