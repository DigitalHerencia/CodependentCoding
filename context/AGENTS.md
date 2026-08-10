# Context Governance

Scope: `context/**`.

`context/` is maintainer and Codex context for building Loaded Vibes. It is not end-user documentation and it is not generated-application runtime content.

## Directory roles

- `context/README.md` — entrypoint and source map.
- `context/docs/` — durable human-readable product, architecture, design, transition, and release context.
- `context/specs/` — active issue-sized implementation modules used to create GitHub Issues and guide Codex.

## Context rules

- Describe the product that is actually intended, not the history of every prior implementation.
- Keep current-state facts separate from target-state requirements.
- Mark migration structures as transitional rather than silently presenting them as the final architecture.
- Do not copy the full Hipster Stack corpus into Loaded Vibes. Reference the canonical DevNotes material and encode only the Loaded Vibes-specific consequences.
- Do not use context as a substitute for implementation.
- Do not create process or validation artifacts unrelated to shipping the active roadmap.
- Delete superseded active specs when their historical value is already preserved by Git history and keeping them would confuse current work.
- A spec is not complete merely because files changed. Its user/product outcome must be satisfied.

## Spec rule

Each active `context/specs/LV-*.md` must be usable as the basis of one focused GitHub Issue and should contain:

- outcome;
- starting state;
- scope;
- explicit non-goals;
- likely affected areas;
- acceptance criteria;
- proportional verification guidance;
- dependencies on earlier specs where required.

Do not add separate planning documents that duplicate the spec.
