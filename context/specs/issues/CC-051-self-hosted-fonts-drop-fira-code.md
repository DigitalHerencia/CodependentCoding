---
id: CC-051
title: "Self-hosted Cinzel and JetBrains Mono; drop Archivo Black and Fira Code"
type: feature
area: site
milestone: "M-S2 · Design system"
priority: p1
size: s
labels: [type:feature, area:site, priority:p1, size:s]
depends_on: [CC-050]
status: done
---

# CC-051 · Self-hosted Cinzel and JetBrains Mono; drop Archivo Black and Fira Code

## Scope

- [x] Cinzel 600/700 self-hosted via `next/font/local` with `size-adjust` fallback metrics (ledger P-10)
- [x] JetBrains Mono variable via `next/font/local`, Latin subset
- [x] Remove `Archivo_Black`, `Fira_Code`; rename variables to what they load

## Acceptance criteria

- [x] No request to fonts.googleapis.com or fonts.gstatic.com at build or runtime
- [x] Font payload ≤ 120 KB total: 66,308 bytes
- [ ] CLS 0 on `/` and a chapter page

## Validation

```powershell
node node_modules/typescript/bin/tsc --project tsconfig.build.json --noEmit
```

## Depends on

CC-050

## References

- context/canon/refurbish/PLAN.md §5.2
- ledger P-8

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`

Owner resource policy: one affected-site CI build, no local build/Lighthouse/dev server. Installed Next local-font loader successfully reads both files and generates size-adjust fallback metrics. Owner preview CLS verification on `/` and a chapter remains pending. PR #352 merged before this implementation.

## Delivery

Merged in PR #353 at `f464035`; issue #303 closed. Previously recorded focused checks and CI passed. Owner browser/appearance checks remain unrun follow-up; unchecked runtime criteria are not claimed as passing.
