---
id: CC-050
title: "Unified tokens and contrast check"
type: feat
area: site
milestone: "M-S2 · Design system"
priority: p1
size: m
labels: [type:feat, area:site, priority:p1, size:m]
depends_on: [CC-049]
status: todo
---

# CC-050 · Unified tokens and contrast check

## Scope

- [ ] Rewrite `app/globals.css` to the Plan §5.1 token set; delete `--site-*` and legacy aliases; zero `!important`
- [ ] `scripts/check-contrast.mjs` reads `/* @pairs */` and fails below 4.5:1 text / 3:1 UI
- [ ] Replace every text use of `--signal` with `--signal-text`

## Acceptance criteria

- [ ] Contrast script passes and runs in CI
- [ ] axe reports 0 color-contrast violations on every route

## Validation

```powershell
node scripts/check-contrast.mjs
pnpm test:e2e -- a11y
```

## Depends on

CC-049

## References

- refurbish/PLAN.md §5.1
- ledger P-9

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
