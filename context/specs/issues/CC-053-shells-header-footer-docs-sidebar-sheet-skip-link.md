---
id: CC-053
title: "Shells, header, footer, docs sidebar sheet, skip link"
type: feat
area: site
milestone: "M-S2 · Design system"
priority: p1
size: m
labels: [type:feat, area:site, priority:p1, size:m]
depends_on: [CC-050, CC-051, CC-052]
status: todo
---

# CC-053 · Shells, header, footer, docs sidebar sheet, skip link

## Scope

- [ ] `site-shell`, `docs-shell`; header per Plan §2; footer with version + verified date
- [ ] Docs sidebar becomes a Sheet below 1024 px
- [ ] Skip-to-content link; landmarks

## Acceptance criteria

- [ ] Keyboard: Tab reaches skip link first; Esc closes the sheet and returns focus
- [ ] No horizontal scroll at 320 px

## Validation

```powershell
pnpm test:e2e -- a11y
```

## Depends on

CC-050, CC-051, CC-052

## References

- refurbish/PLAN.md §2, §3.3

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
