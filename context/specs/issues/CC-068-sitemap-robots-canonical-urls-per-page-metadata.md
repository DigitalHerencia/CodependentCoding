---
id: CC-068
title: "Sitemap, robots, canonical URLs, per-page metadata"
type: chore
area: site
milestone: "M-S6 · PWA and polish"
priority: p1
size: s
labels: [type:chore, area:site, priority:p1, size:s]
depends_on: [CC-055]
status: todo
---

# CC-068 · Sitemap, robots, canonical URLs, per-page metadata

## Scope

- [ ] `app/sitemap.ts`, `app/robots.ts`, `metadataBase`, canonical and OG per page

## Acceptance criteria

- [ ] `/sitemap.xml` lists every static route; no 404s from §1 S9 remain

## Validation

```powershell
pnpm build
```

## Depends on

CC-055

## References

- audit S9

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
