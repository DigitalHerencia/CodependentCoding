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
status: in-review
---

# CC-052 · SVG brand assets, AVIF horizon, OG image

## Scope

- [x] SVG components for mark, wordmark, lockup in `components/brand/`
- [x] Desert horizon as AVIF ≤ 60 KB with gradient fallback
- [x] `app/opengraph-image.tsx` and per-chapter OG images

## Acceptance criteria

- [x] No JPEG of text in `public/`
- [ ] Share preview renders on GitHub and Slack

## Validation

Focused ESLint and `tsc --project tsconfig.build.json --noEmit` passed.
Direct ImageResponse root and longest-chapter PNGs rendered and were inspected.
AVIF: 1920 × 1097, 26,818 bytes. One affected-site CI build on the PR; no local build.
Owner desktop/mobile and GitHub/Slack share previews remain unrun.

## Depends on

CC-050

## References

- context/canon/refurbish/PLAN.md §5.4

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
