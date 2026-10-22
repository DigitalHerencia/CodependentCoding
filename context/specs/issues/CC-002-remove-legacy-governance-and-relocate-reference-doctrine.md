---
id: CC-002
title: "Remove legacy governance and relocate reference doctrine"
type: chore
area: governance
milestone: "M0 · Governance bootstrap"
priority: p0
size: s
labels: [type:chore, area:governance, priority:p0, size:s]
depends_on: [CC-001]
status: in-review
---

# CC-002 · Remove legacy governance and relocate reference doctrine

## Summary

Five overlapping authorities confused agents. Leave exactly one governance system: context/docs, .claude/contracts, .claude/execution, context/specs/issues.

## Scope

- [ ] Delete `.agents/` (contracts, execution, LoadedVibesCodexPlugin)
- [ ] Move `content/TypeScripture_The-Book-of-*` and `content/CANONICAL-RECONSTRUCTION.md` to `context/doctrine/`
- [ ] Delete `content.zip`, `template-disposition.json`, `tsconfig.tsbuildinfo`
- [ ] Delete `context/specs/{anthimeria,generation,ontologies,simples,loaded-vibes}` and `context/mockups` (keep mockups only if referenced by Design.md — they are not)
- [ ] Replace root `AGENTS.md` with a 3-line pointer to `CLAUDE.md`
- [ ] Update `.prettierignore` to ignore `context/doctrine/`
- [ ] Search the repo for references to removed paths and fix or remove them

## Acceptance criteria

- [ ] Only one governance system exists (paths above)
- [ ] `rg -n "\.agents/|template-disposition|Anthimeria" --glob '!context/doctrine/**' --glob '!.claude/execution/**'` returns only intentional historical mentions in decisions.json
- [ ] Books readable under `context/doctrine/`

## Validation

```powershell
pnpm format:check
pnpm lint
```

## Depends on

CC-001

## References

- DEC-005
- DEC-013

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
