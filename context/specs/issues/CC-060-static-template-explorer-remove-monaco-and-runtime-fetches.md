---
id: CC-060
title: "Static template explorer; remove Monaco and runtime fetches"
type: feat
area: site
milestone: "M-S4 · Product pages"
priority: p0
size: l
labels: [type:feat, area:site, priority:p0, size:l]
depends_on: [CC-054]
status: todo
---

# CC-060 · Static template explorer; remove Monaco and runtime fetches

## Scope

- [ ] `lib/content/template.ts` snapshots `template/` with the CLI's exclusion list, ownership and classifier
- [ ] Tree + Shiki source + layer bar + owner badge + preset toggle
- [ ] Remove `@monaco-editor/react`, `monaco-editor`

## Acceptance criteria

- [ ] 0 requests to other origins on `/maximal`
- [ ] First-load JS ≤ 90 KB gzip
- [ ] Build fails if any snapshot file lacks an owner or layer

## Validation

```powershell
pnpm build
pnpm test:e2e -- no-third-party
```

## Depends on

CC-054

## References

- refurbish/PLAN.md §3.5
- audit S4

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
