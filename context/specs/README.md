# Loaded Vibes Implementation Specs

GitHub Issues are the operational queue. Each active implementation Issue corresponds to one focused spec. The spec is durable scope and acceptance context, not a second project-management system.

## Completed one-template migration

1. **LV-201** — consolidate the one repository-owned master template.
2. **LV-202** — simplify configuration and absorb recipe ownership.
3. **LV-203** — convert generation to one-template retain/remove ownership.
4. **LV-204** — split the developer-tool landing page and configurator.
5. **LV-205** — add canonical end-user docs and `/docs`.
6. **LV-206** — polish the CLI/package around the final model.
7. **LV-207** — remove migration debris and prepare the coherent release.

## Active mockup-driven web refresh

The current web UI/UX replacement is deliberately only three implementation units:

1. **LV-208** — replace the shared shell and Product landing page from the local mockup.
2. **LV-209** — add the Libraries catalog and linked detail pages from the local mockups.
3. **LV-210** — refactor the Builder around the local mockup, preserve real config semantics, and remove replaced web code.

```text
LV-208 shell + Product
          │
          ▼
LV-209 Libraries + detail
          │
          ▼
LV-210 Builder + final web cleanup
```

This sequence is intentionally small. Do not split it further unless an actual blocked dependency makes one Issue unreviewable.

## Visual authority

For LV-208 through LV-210, the local `context/mockups/` subjects are the visual acceptance artifacts. `context/docs/web.md` defines how to interpret them: reproduce design/structure faithfully, but adapt literal labels and controls when needed to implement truthful Loaded Vibes behavior.

## Historical specs

LV-101 through LV-110 are preserved in Git history and are not active instructions.

## Verification rule

Do not create new test or validation systems for this UI replacement.

Use existing web typecheck/build plus the narrow manual interaction/visual checks named by the active spec. Escalate to wider repository checks only when focused verification exposes a real cross-package regression.
