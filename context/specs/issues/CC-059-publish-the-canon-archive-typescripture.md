---
id: CC-059
title: "Publish the canon; archive TypeScripture"
type: docs
area: site
milestone: "M-S3 · Docs platform"
priority: p0
size: s
labels: [type:docs, area:site, priority:p0, size:s]
depends_on: [CC-055]
status: todo
---

# CC-059 · Publish the canon; archive TypeScripture

## Scope

- [ ] Move `context/canon/doctrine/*.md` → `content/doctrine/*.mdx`
- [ ] Move `context/doctrine/` → `context/archive/typescripture/` with a README pointer
- [ ] Update CLAUDE.md router rows

## Acceptance criteria

- [ ] The live sidebar shows the 14 chapters + appendices and nothing else

## Validation

```powershell
pnpm build
```

## Depends on

CC-055

## References

- ledger S-1..S-5

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
