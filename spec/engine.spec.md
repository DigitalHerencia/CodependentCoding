# Loaded Vibes Engine Specification

**Reference ID:** SPEC-ENGINE

## Purpose

Provide a readable elaboration of engine behavior defined in `TECH_REQUIREMENTS.md`.

## Authoritative References

- `[PRD §5.2–5.4]` DevCycle orchestration, CLI parity, observability.
- `[TECH §4]` DevCycle manifest, orchestrator, phase runners, bootstrapper.
- `[TECH §4.5]` State & telemetry persistence.
- `[TECH §7]` Governance for prompts → instructions → toolsets.

## 1. Engine Responsibilities

- Load manifest
- Bind prompts, instructions, and toolsets
- Create a deterministic DevCycle execution
- Provide state, logs, and validation objects
- Produce DevCycle deliverables in `dist/`

## 2. Orchestration Flow

```
bootstrap → load config → bind toolset → execute prompt → apply instruction rules → write results → validate → log
```

## 3. Manifest Requirements

- Must match schema in `TECH_REQUIREMENTS.md`.
- Must enforce cycle ordering.
- Must reject cycles missing instructions or toolsets.

## 4. Execution Guarantees

- Orchestrator must hydrate context from PRD, Tech Requirements, TODO, CHANGELOG, and state snapshot before Analyze phase `[TECH §4.2]`.
- Phase runners SHALL follow the Analyze → Design → Implement → Validate → Reflect sequence, logging requirement IDs per event `[TECH §4.3]`.
- Tool access is limited to the active toolset; destructive actions require checkpoint approvals logged to NDJSON traces `[PRD §5.3]`.
- Outputs (plans, validation logs, TODO/CHANGELOG deltas, telemetry) must be deterministic for identical inputs.

## 5. State, Logging, and Telemetry

- Persist `dist/genaiscript/state/state.json` with timestamps, inputs, and resulting artifacts `[TECH §4.5]`.
- Emit NDJSON event logs consumable by CLI dashboard and `loaded-vibes logs` command `[PRD §5.4]`.
- Reflect phase must update TODO/CHANGELOG entries referencing originating requirements; missing updates fail validation `[TECH §7]`.

## 6. Failure Handling

- Manifest validation failures block DevCycle start and surface actionable remediation (missing prompt/toolset, schema mismatch).
- Runtime errors must trigger Bad Vibes Firewall messaging plus checkpoint rollback guidance `[PRD §5.5]`.
- Engine must never write outside allowed directories; bootstrapper enforces guardrails prior to orchestration `[TECH §1]`.

## 7. GitHub Issue Tagging

- Tag reference: `[SPEC-ENGINE]` for manifest/orchestrator defects.
- Include run parameters, requirement IDs, and NDJSON excerpts when filing issues.

