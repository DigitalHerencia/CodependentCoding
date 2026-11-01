---
id: CC-065
title: "Site PWA: manifest, service worker, offline page, install prompt"
type: feat
area: site
milestone: "M-S6 · PWA and polish"
priority: p2
size: m
labels: [type:feat, area:site, priority:p2, size:m]
depends_on: [CC-055]
status: todo
---

# CC-065 · Site PWA: manifest, service worker, offline page, install prompt

## Scope

- [ ] `app/manifest.ts`; `public/sw.js` precaching visited docs pages and static assets; `/offline`
- [ ] Install island per doctrine Ch. 09

## Acceptance criteria

- [ ] Offline e2e passes; Lighthouse PWA installability passes

## Validation

```powershell
pnpm test:e2e -- offline
```

## Depends on

CC-055

## References

- context/canon/doctrine/09-pwa.md

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
