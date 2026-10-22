---
id: CC-001
title: "Pin the toolchain across root and template"
type: chore
area: governance
milestone: "M0 · Governance bootstrap"
priority: p0
size: s
labels: [type:chore, area:governance, priority:p0, size:s]
depends_on: []
status: in-review
---

# CC-001 · Pin the toolchain across root and template

## Summary

Lint cannot run at the root because TypeScript 7 is unsupported by typescript-eslint. Align root and template on one proven, exactly pinned toolchain.

## Scope

- [ ] Set `packageManager: pnpm@12.3.4` and `engines.node: 24.x` in root and `template/package.json`
- [ ] Root: `typescript` 6.0.3, `eslint` 9.39.5, `eslint-config-next` 16.3.4, `eslint-config-prettier` 10.1.8, `prettier` 3.9.6, add `prettier-plugin-tailwindcss` 0.8.1 and `yaml` (exact)
- [ ] Remove `typescript-eslint` direct dependency if unused after config change
- [ ] Remove `^`/`~` ranges from both package.json files
- [ ] Regenerate both lockfiles; remove the `apps/*` entry from `pnpm-workspace.yaml` (no apps folder)
- [ ] Fix `pnpm test` script to point at real tests or `vitest run --passWithNoTests` until M4

## Acceptance criteria

- [ ] `pnpm install --frozen-lockfile` succeeds at root and in `template/`
- [ ] `pnpm lint` at root runs to completion (findings allowed, no crash)
- [ ] `pnpm --dir template lint` runs to completion
- [ ] No version ranges remain in either package.json

## Validation

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm --dir template install --frozen-lockfile
pnpm --dir template lint
```

## References

- context/docs/tech-requirements.md §2
- DEC-006

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
