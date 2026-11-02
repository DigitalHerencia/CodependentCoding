---
id: CC-049
title: "Move copy to content/ and loaders to lib/content"
type: refactor
area: site
milestone: "M-S1 · Foundation"
priority: p1
size: m
labels: [type:refactor, area:site, priority:p1, size:m]
depends_on: [CC-046]
status: in-review
---

# CC-049 · Move copy to content/ and loaders to lib/content

## Scope

- [x] `lib/constants/siteCopy.ts` → `content/{public,faq,legal,security}.ts`
- [x] `lib/fetchers/*` (file readers) → `lib/content/*`; update imports
- [x] Add doctrine rule CC-CONTENT-001 to the site lint profile

## Acceptance criteria

- [x] `lib/fetchers/` does not exist in the site
- [x] `lib/constants/` holds only URLs, version and dates
- [x] Changed-file site lint passes (owner policy supersedes a full lint run)

## Validation

```powershell
node --test --test-name-pattern=public-content --test-reporter=dot template/eslint/codependent-plugin.test.mjs
# ESLint/Prettier on changed files; site TypeScript check; one affected CI build.
```

## Depends on

CC-046

## References

- ledger A-5, P-4

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
