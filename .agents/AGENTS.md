# Loaded Vibes Machine Governance

Scope: `.agents/**`.

Machine governance is a compact projection of the controlling Markdown context. It exists to help Codex preserve fixed boundaries while implementing Issues.

## Contracts

- `.agents/contracts/*.yaml` encode stable, enforceable subsets of `context/docs/*`.
- Every contract names its controlling source documents.
- Contracts do not invent product behavior.
- A Markdown source-of-truth change that alters a machine boundary must update the affected contract in the same focused change.
- Keep IDs stable while they are referenced by active specs, Issues, or implementation.
- Do not create machine contracts for every paragraph. Encode only boundaries that materially prevent product or architecture drift.

## Execution state

- `.agents/execution/decisions.json` records durable Loaded Vibes-specific decisions.
- `.agents/execution/progress.json` records current roadmap state.
- `.agents/execution/handoff.json` records the next coherent implementation handoff.
- Execution files do not prove code correctness.
- Execution files never override context, contracts, implementation, or live repository evidence.
- Record unknown or blocked state explicitly rather than inventing evidence.

## Integrity

- Keep JSON strict JSON.
- Keep YAML simple and human-readable.
- Never store provider secrets, tokens, credential values, or private payloads.
- Do not introduce a new governance-validation system as part of this migration.
