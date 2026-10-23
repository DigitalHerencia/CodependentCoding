---
id: CC-013
title: "Prettier baseline across the repo"
type: chore
area: governance
milestone: "M2 · Template conformance"
priority: p1
size: xs
labels: [type:chore, area:governance, priority:p1, size:xs]
depends_on: [CC-012]
status: in_review
---

# CC-013 · Prettier baseline across the repo

## Summary

Unify formatting (double quotes, Tailwind class order) in one mechanical commit.

## Scope

- [ ] Run `pnpm format` at root and in `template/`
- [ ] Commit alone as `chore(format): apply prettier baseline`
- [ ] Add the commit SHA to `.git-blame-ignore-revs`

## Acceptance criteria

- [ ] `pnpm format:check` passes at root and in template
- [ ] Commit contains formatting only

## Validation

```powershell
pnpm format:check
pnpm --dir template format:check
```

## Depends on

CC-012

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
