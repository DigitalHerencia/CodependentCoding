# Codependent Coding Machine Governance

Scope: `.agents/**`.

Machine governance is a compact projection of the controlling handoff authority in `context/00-governance/`. It never overrides current owner instructions, the TypeScripture identity map, canonical domain authority, or live implementation evidence.

## Current transition

- The active work unit is the next incomplete segment in `context/00-governance/04-Segmented-Build-Spec.md`.
- Segment plans and checkpoints live in `context/01-codex/`.
- `.agents/contracts/*.yaml` are transitional projections from the earlier Hipster Stack repository. Each is updated with the segment that changes its public or machine boundary; stale names in them are migration targets, not authority.
- `.agents/execution/progress.json` records the current segment.
- `.agents/execution/handoff.json` records the current local implementation package.
- `.agents/execution/decisions.json` is append-only; newer entries supersede named older decisions without deleting history.

## Integrity

- Keep JSON strict JSON and YAML simple and human-readable.
- Record unknown, skipped, blocked, and inferred state explicitly.
- Never store secrets, tokens, credential values, or private payloads.
- Do not create a parallel governance validator or semantic rules engine.
- Do not treat this consolidation workspace as an Arrangement merely because Loaded Vibes source is present.
