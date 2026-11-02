---
id: CC-053
title: "Shells, header, footer, docs sidebar sheet, skip link"
type: feature
area: site
milestone: "M-S2 · Design system"
priority: p1
size: m
labels: [type:feature, area:site, priority:p1, size:m]
depends_on: [CC-050, CC-051, CC-052]
status: in-review
---

# CC-053 · Shells, header, footer, docs sidebar sheet, skip link

## Scope

- [x] `site-shell`, `docs-shell`; header per Plan §2; footer with version + verified date
- [x] Docs sidebar becomes a Sheet below 1024 px
- [x] Skip-to-content link; landmarks

## Acceptance criteria

- [ ] Keyboard: Tab reaches skip link first; Esc closes the sheet and returns focus
- [ ] No horizontal scroll at 320 px

## Validation

```powershell
# Focused changed-file formatting and ESLint; root TypeScript check.
# Owner-run preview: first Tab / skip, drawer Escape + focus return, 320px overflow.
```

## Depends on

CC-050, CC-051, CC-052

## References

- refurbish/PLAN.md §2, §3.3

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`

## Delivery notes

- Browser checks are owner-run under the resource policy; automated browser suite not run.
- Native modal dialog supplies the responsive chapter sheet without dependency installation.
- Existing chapter-title filter remains until CC-057 adds global search. Footer RSS awaits a real changelog feed; no dead link is published.
