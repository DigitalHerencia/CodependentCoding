---
id: CC-077
title: "Hardened Stripe webhook path"
type: feat
area: template
milestone: "M-T · Template conformance"
priority: p1
size: m
labels: [type:feat, area:template, priority:p1, size:m]
depends_on: [CC-069]
status: todo
---

# CC-077 · Hardened Stripe webhook path

## Scope

- [ ] Inbox lease columns; `withSystemTransaction`; re-fetch provider truth for consequential events

## Acceptance criteria

- [ ] Out-of-order replay test: `updated` after `deleted` does not resurrect a subscription

## Validation

```powershell
pnpm --dir template test:rls
```

## Depends on

CC-069

## References

- context/canon/doctrine/08-integrations-webhooks-jobs.md

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
