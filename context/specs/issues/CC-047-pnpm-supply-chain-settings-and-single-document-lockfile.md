---
id: CC-047
title: "pnpm supply-chain settings and single-document lockfile"
type: build
area: ci
milestone: "M-S1 · Foundation"
priority: p0
size: s
labels: [type:build, area:ci, priority:p0, size:s]
depends_on: []
status: done
---

# CC-047 · pnpm supply-chain settings and single-document lockfile

## Scope

- [ ] Root and template `pnpm-workspace.yaml`: `minimumReleaseAge: 10080`, `trustPolicy: no-downgrade`, `pmOnFail: ignore`, keep `allowBuilds`
- [ ] Regenerate both lockfiles; add `scripts/check-lockfile.mjs` (fails if `pnpm-lock.yaml` has more than one YAML document)
- [ ] Remove template `postinstall`; run `prisma generate` in `build` and `typecheck`

## Acceptance criteria

- [ ] Both lockfiles start with `lockfileVersion` (no leading env document)
- [ ] GitHub dependency graph shows a non-zero dependency count after merge
- [ ] CI runs the lockfile check on lockfile changes

## Validation

```powershell
corepack pnpm install --frozen-lockfile
node scripts/check-lockfile.mjs
```

## Depends on

—

## References

- context/canon/doctrine/02-foundation.md
- ledger F-3, F-4, F-5

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
