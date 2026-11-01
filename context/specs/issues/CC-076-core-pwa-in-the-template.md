---
id: CC-076
title: "Core PWA in the template"
type: feat
area: template
milestone: "M-T · Template conformance"
priority: p1
size: m
labels: [type:feat, area:template, priority:p1, size:m]
depends_on: [CC-075]
status: todo
---

# CC-076 · Core PWA in the template

## Scope

- [ ] Manifest, `public/sw.js` per doctrine Ch. 09, offline page, install island, logout cache purge

## Acceptance criteria

- [ ] SW never caches HTML (test intercepts and asserts)
- [ ] Logout empties all caches

## Validation

```powershell
pnpm --dir template test:e2e -- pwa
```

## Depends on

CC-075

## References

- context/canon/doctrine/09-pwa.md

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
