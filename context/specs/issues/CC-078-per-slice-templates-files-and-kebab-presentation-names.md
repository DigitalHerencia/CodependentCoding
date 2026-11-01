---
id: CC-078
title: "Per-slice templates files and kebab presentation names"
type: refactor
area: template
milestone: "M-T · Template conformance"
priority: p2
size: m
labels: [type:refactor, area:template, priority:p2, size:m]
depends_on: []
status: done
---

# CC-078 · Per-slice templates files and kebab presentation names

## Scope

- [ ] Merge 53 per-page template files into `<slice>-templates.tsx`
- [ ] Update CLI slice templates and ownership tests
- [ ] Delete the `components/ui/index.ts` and `components/chart/index.ts` barrels; rewrite imports (CC-STYLE-004)

## Acceptance criteria

- [ ] `components/templates/` has one file per slice
- [ ] Composition tests pass

## Validation

```powershell
pnpm test
pnpm --dir template validate
```

## Depends on

—

## References

- ledger P-1

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
