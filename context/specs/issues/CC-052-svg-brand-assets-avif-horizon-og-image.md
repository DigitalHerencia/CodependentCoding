---
id: CC-052
title: "SVG brand assets, AVIF horizon, OG image"
type: feature
area: site
milestone: "M-S2 · Design system"
priority: p1
size: m
labels: [type:feature, area:site, priority:p1, size:m]
depends_on: [CC-050]
status: todo
---

# CC-052 · SVG brand assets, AVIF horizon, OG image

## Scope

- [ ] SVG components for mark, wordmark, lockup in `components/brand/`
- [ ] Desert horizon as AVIF ≤ 60 KB with gradient fallback
- [ ] `app/opengraph-image.tsx` and per-chapter OG images

## Acceptance criteria

- [ ] No JPEG of text in `public/`
- [ ] Share preview renders on GitHub and Slack

## Validation

```powershell
pnpm build
```

## Depends on

CC-050

## References

- refurbish/PLAN.md §5.4

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
