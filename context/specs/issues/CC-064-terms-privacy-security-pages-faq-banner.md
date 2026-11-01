---
id: CC-064
title: "Terms, Privacy, Security pages; FAQ banner"
type: docs
area: site
milestone: "M-S5 · Trust pages"
priority: p1
size: s
labels: [type:docs, area:site, priority:p1, size:s]
depends_on: [CC-049]
status: todo
---

# CC-064 · Terms, Privacy, Security pages; FAQ banner

## Scope

- [ ] Copy from `refurbish/legal.md` into `content/legal.ts`, `content/security.ts`
- [ ] FAQ satire banner and three real questions

## Acceptance criteria

- [ ] Pages render with version stamps and match `context/canon/refurbish/legal.md` word for word

## Validation

```powershell
pnpm build
```

## Depends on

CC-049

## References

- context/canon/refurbish/legal.md

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
