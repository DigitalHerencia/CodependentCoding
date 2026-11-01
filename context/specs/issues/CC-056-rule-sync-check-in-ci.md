---
id: CC-056
title: "Rule sync check in CI"
type: ci
area: site
milestone: "M-S3 · Docs platform"
priority: p0
size: s
labels: [type:ci, area:site, priority:p0, size:s]
depends_on: [CC-055]
status: todo
---

# CC-056 · Rule sync check in CI

## Scope

- [ ] `lib/content/rules.ts` merges chapter rule blocks, `validation.yaml`, `doctrine-map.mjs`
- [ ] Build fails on an ID present in one source and missing in another

## Acceptance criteria

- [ ] Deleting one rule from `validation.yaml` fails CI with the ID named

## Validation

```powershell
pnpm doctrine:check
```

## Depends on

CC-055

## References

- doctrine/12-quality-and-delivery.md CC-GOV-001

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
