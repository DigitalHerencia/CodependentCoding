---
id: CC-031
title: "Post-compose setup and optional provisioning"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p1
size: m
labels: [type:feature, area:cli, priority:p1, size:m]
depends_on: [CC-029]
status: done
---

# CC-031 · Post-compose setup and optional provisioning

## Summary

Install, git init, and opt-in provisioning so a new app can be deployed the same day.

## Scope

- [ ] `pnpm install`, `git init`, initial commit `chore: scaffold from hipster-stack`
- [ ] `--provision`: `gh repo create --private`, `neonctl projects create` + roles (`owner`, `app_user`) + connection strings into `.env.local`, `vercel link` + `vercel env add`
- [ ] Each provisioning step is skippable and idempotent; missing CLIs produce clear guidance
- [ ] Print next steps: `pnpm db:init`, `pnpm dev`

## Acceptance criteria

- [ ] Manual run with --provision creates repo, Neon project, Vercel project
- [ ] Without --provision, no network calls are made

## Validation

```powershell
hipster-stack new .sandbox/prov --preset blank --provision
```

## Depends on

CC-029

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
