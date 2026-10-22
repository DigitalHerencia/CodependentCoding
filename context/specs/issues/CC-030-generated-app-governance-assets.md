---
id: CC-030
title: "Generated-app governance assets"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p0
size: m
labels: [type:feature, area:cli, priority:p0, size:m]
depends_on: [CC-029]
status: todo
---

# CC-030 · Generated-app governance assets

## Summary

Every generated app gets the same governance shape, unfilled, ready for `/idea`.

## Scope

- [ ] `packages/cli/assets/app-governance/`: CLAUDE.md, `context/docs/{PRD,tech-requirements,Architecture,Design,AUTH}.md` templates with prompts, `.claude/contracts/*.yaml` skeletons, `.claude/execution/*.json` empty states, `context/specs/issues/README.md`
- [ ] Architecture/AUTH templates pre-filled with the doctrine (only app-specific sections blank)
- [ ] Copied by `new`; never overwritten by `add`

## Acceptance criteria

- [ ] Generated app contains all governance files
- [ ] CLAUDE.md ≤ 60 lines

## Validation

```powershell
hipster-stack new .sandbox/gov --preset blank --yes --no-install
```

## Depends on

CC-029

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
