---
id: CC-048
title: "Header CSP, full security headers, security.txt"
type: feature
area: site
milestone: "M-S1 · Foundation"
priority: p0
size: s
labels: [type:feature, area:site, priority:p0, size:s]
depends_on: [CC-046]
status: in-review
---

# CC-048 · Header CSP, full security headers, security.txt

## Scope

- [x] Static CSP from Plan §4 in `next.config.ts`; add HSTS, COOP
- [x] `app/.well-known/security.txt/route.ts` (RFC 9116)
- [x] `tests/e2e/site/headers.spec.ts`

## Acceptance criteria

- [ ] Every HTML, `.md`, `.json` and `sw.js` response carries CSP and the six headers
- [ ] No `X-XSS-Protection` header

## Validation

```powershell
# No automatic server or local build; use the existing deployment.
$env:PLAYWRIGHT_BASE_URL = 'https://<existing-preview-host>'
node node_modules/@playwright/test/cli.js test tests/e2e/site/headers.spec.ts --workers=1 --retries=0
# Focused static regression: tests/site/securityHeaders.test.ts.
# The affected-site build runs once in the existing CI workflow.
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
