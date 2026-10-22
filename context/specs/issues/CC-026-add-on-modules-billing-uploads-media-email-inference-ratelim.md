---
id: CC-026
title: "Add-on modules: billing, uploads, media, email, inference, ratelimit"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p1
size: l
labels: [type:feature, area:modules, priority:p1, size:l]
depends_on: [CC-021, CC-025]
status: todo
---

# CC-026 · Add-on modules: billing, uploads, media, email, inference, ratelimit

## Summary

Package provider capabilities as add-on modules; implement `ratelimit` (gap: RATE_LIMITED had no backing).

## Scope

- [ ] Assign `owns` globs for each provider (`lib/integrations/stripe/**`, `app/api/stripe/**`, …)
- [ ] Move Stripe billing settings/checkout into `billing`; Blob into `uploads`; Cloudinary into `media`; SendGrid into `email`; Hugging Face into `inference`
- [ ] Implement `ratelimit` (Upstash) with a `lib/integrations/upstash/ratelimit.ts` helper used by actions that return `RATE_LIMITED`
- [ ] Update domain `dependsOn` per presets

## Acceptance criteria

- [ ] Each add-on composes alone with base (manual compose script until CLI exists)
- [ ] Ownership check passes

## Validation

```powershell
pnpm --dir template check:ownership
pnpm --dir template validate
```

## Depends on

CC-021, CC-025

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
