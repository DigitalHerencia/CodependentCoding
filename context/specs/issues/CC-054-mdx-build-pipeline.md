---
id: CC-054
title: "MDX build pipeline"
type: feature
area: site
milestone: "M-S3 · Docs platform"
priority: p0
size: l
labels: [type:feature, area:site, priority:p0, size:l]
depends_on: [CC-049]
status: todo
---

# CC-054 · MDX build pipeline

## Scope

- [ ] `lib/content/doctrine.ts`: compile MDX with `@mdx-js/mdx` in a `'use cache'` function keyed by content hash
- [ ] remark/rehype: `<Rule>` blocks, heading ids, Shiki highlighting, Mermaid → SVG, internal link check
- [ ] Remove `marked` and every `dangerouslySetInnerHTML`

## Acceptance criteria

- [ ] Docs pages ship no JS beyond islands
- [ ] A broken internal link fails the build
- [ ] `grep -r dangerouslySetInnerHTML app components features` is empty

## Validation

```powershell
pnpm build
```

## Depends on

CC-049

## References

- refurbish/PLAN.md §4
- ledger X-2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
