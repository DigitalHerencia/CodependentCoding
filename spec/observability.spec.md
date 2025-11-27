# Loaded Vibes Observability Specification

**Reference ID:** SPEC-OBS  
**Parent:** `TECH_REQUIREMENTS.md`

## Purpose

Elaborate TechReq observability requirements into a reusable reference.

## Authoritative References

- `[PRD §5.4]` Troubleshooting, logs, doctor workflows.
- `[PRD §6]` Success metrics + telemetry expectations.
- `[TECH §4.5]` State persistence + telemetry snapshots.
- `[TECH §5.3]` CLI log storage and export requirements.

## 1. Required Signals

- DevCycle start/end timestamps
- Validation summary
- Toolset activation logs
- Engine state transitions
- Error stack traces (sanitized)
- NDJSON event logs

## 2. Required Outputs

- Markdown reports
- `logs/` directory artifacts
- Telemetry summary (local only unless user opts in)

## 3. Implementation Guidance

- Persist NDJSON logs under `.loaded-vibes/logs/*.ndjson` with `devCycleId`, `phase`, `requirementId`, `severity`, `checkpointId` `[TECH §5.3]`.
- Generate Markdown summaries for TODO/CHANGELOG updates referencing the same requirement IDs `[PRD §5.3]`.
- Store engine state snapshots (`dist/genaiscript/state/state.json`) so CLI dashboards can reconstruct timelines `[TECH §4.5]`.
- Provide opt-in/out toggles for telemetry exports; default to local-only storage `[PRD §5.4]`.

## 4. Validation Checklist

1. Run `loaded-vibes doctor` and confirm NDJSON entries exist for each scan step.
2. Execute at least one DevCycle and verify start/end timestamps plus validation summary appear in CLI dashboard.
3. Confirm Markdown exports include TODO/CHANGELOG references and are attached to PRs `[TECH §10]`.
4. Ensure sanitized stack traces omit secrets/environment variables `[TECH §9]`.

## 5. GitHub Issue Tagging

- Tag reference: `[SPEC-OBS]`.
- Include affected log files and relevant requirement citations when filing issues.

