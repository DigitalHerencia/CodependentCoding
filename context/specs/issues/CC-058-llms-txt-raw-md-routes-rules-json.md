---
id: CC-058
title: "llms.txt, raw .md routes, rules.json"
type: feat
area: site
milestone: "M-S3 · Docs platform"
priority: p1
size: s
labels: [type:feat, area:site, priority:p1, size:s]
depends_on: [CC-055]
status: todo
---

# CC-058 · llms.txt, raw .md routes, rules.json

## Scope

- [ ] `/llms.txt` index; `/doctrine/<chapter>.md` static route handlers; `/doctrine/rules.json`
- [ ] Point the Loaded Vibes `references/doctrine.md` generator at `rules.json`

## Acceptance criteria

- [ ] Responses are static and carry the security headers

## Validation

```powershell
pnpm build
```

## Depends on

CC-055

## References

- refurbish/PLAN.md §2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
