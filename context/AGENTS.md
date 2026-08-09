# Context Governance Instructions

Scope: `context/**`.

These files describe and decompose intent. They are not execution logs.

- `context/docs/` owns durable product intent.
- `context/specs/` owns bounded implementation scope derived from the docs.
- A spec may narrow a requirement for one work item but may not contradict a controlling doc.
- New durable product behavior belongs in the appropriate doc first, then in affected specs/contracts.
- Keep requirements observable and testable.
- Keep implementation detail out of the PRD unless it protects a required product property.
- Never mark a requirement implemented merely because a spec exists.
- Do not place transient branch, PR, command output, or test results in `context/docs/`.
- Execution evidence belongs in `.agents/execution/` and the relevant GitHub Issue/PR.
- Update links and dependency IDs whenever specs are added, removed, split, or superseded.
- Run governance validation after changing these files.
