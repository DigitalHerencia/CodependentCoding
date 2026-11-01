---
id: CC-048
title: "Header CSP, full security headers, security.txt"
type: feat
area: site
milestone: "M-S1 · Foundation"
priority: p0
size: s
labels: [type:feat, area:site, priority:p0, size:s]
depends_on: [CC-046]
status: todo
---

# CC-048 · Header CSP, full security headers, security.txt

## Scope

- [ ] Static CSP from Plan §4 in `next.config.ts`; add HSTS, COOP
- [ ] `app/.well-known/security.txt/route.ts` (RFC 9116)
- [ ] `tests/e2e/site/headers.spec.ts`

## Acceptance criteria

- [ ] Every HTML, `.md`, `.json` and `sw.js` response carries CSP and the six headers
- [ ] No `X-XSS-Protection` header

## Validation

```powershell
pnpm build
pnpm test:e2e -- headers
```

## Depends on

CC-046

## References

- context/canon/doctrine/10-security.md
- ledger X-1

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
