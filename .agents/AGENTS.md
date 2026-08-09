# Machine Governance Instructions

Scope: `.agents/**`.

## Contracts

- `.agents/contracts/*.yaml` encode enforceable subsets of the human-readable sources.
- Contracts must reference their controlling Markdown sources.
- Contracts may not invent product behavior absent from the controlling docs.
- When a doc changes an enforceable boundary, update the affected contract in the same change.
- Keep identifiers stable once referenced by tests, validators, Issues, or PRs.

## Execution state

- `.agents/execution/*.json` records work state and evidence only.
- Execution state never overrides docs, specs, contracts, implementation, or live evidence.
- Record `executed`, `skipped`, `blocked`, and `inferred` distinctly.
- Never record a check as passed unless it actually ran against the recorded revision.
- Use `null`, an empty array, or an explicit blocked state instead of fabricating missing evidence.
- Promote consequential implementation discoveries into controlling docs/contracts when they change durable truth.

## Integrity

- YAML and JSON must parse after every edit.
- JSON remains strict JSON with no comments.
- Do not store secrets, credentials, tokens, environment values, or provider payloads here.
- Run governance validation after edits.
