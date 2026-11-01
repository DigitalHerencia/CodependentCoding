---
id: CC-055
title: "Doctrine routes: chapters, rule index, rule pages, glossary, golden slice, changelog"
type: feat
area: site
milestone: "M-S3 · Docs platform"
priority: p0
size: l
labels: [type:feat, area:site, priority:p0, size:l]
depends_on: [CC-054]
status: todo
---

# CC-055 · Doctrine routes: chapters, rule index, rule pages, glossary, golden slice, changelog

## Scope

- [ ] Routes per Plan §2 with `generateStaticParams`
- [ ] Rule pages pull failing/passing examples from `template/eslint/codependent-plugin.test.mjs`
- [ ] Chapter furniture per Plan §3.3

## Acceptance criteria

- [ ] One page per rule in the index (143 today) builds; each anchor `#cc-…` resolves
- [ ] Previous/Next order follows `order` frontmatter

## Validation

```powershell
pnpm build
pnpm test:e2e -- links
```

## Depends on

CC-054

## References

- refurbish/PLAN.md §3.2–3.4

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
