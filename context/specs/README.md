# Loaded Vibes Implementation Specs

These specs record the completed issue-sized roadmap for the one-template repository migration.

GitHub Issues are the operational queue. Each Issue should correspond to one spec. The spec is durable scope and acceptance context, not a second project-management system.

## Completed order

1. **LV-201** — consolidate the one repository-owned master template.
2. **LV-202** — simplify configuration and absorb recipe ownership.
3. **LV-203** — convert generation to one-template retain/remove ownership.
4. **LV-204** — split and polish the developer-tool landing page and configurator.
5. **LV-205** — add canonical end-user docs and `/docs`.
6. **LV-206** — polish the CLI/package around the final model.
7. **LV-207** — remove migration debris and prepare the coherent release.

## Dependency map

```text
LV-201 template ownership
     │
     ├──────────────┐
     ▼              ▼
LV-202 config     template source ready
     │
     ▼
LV-203 generator
     │
     ├──────────────┬──────────────┐
     ▼              ▼              ▼
LV-204 web      LV-205 docs     LV-206 CLI/package
     └──────────────┴──────────────┘
                    │
                    ▼
               LV-207 cleanup
```

## Historical specs

LV-101 through LV-110 are preserved in Git history and are not active instructions.

## Verification rule

The user explicitly does not want new tests or validation systems as part of this cleanup.

Use existing checks only when they directly establish the behavior changed by the active Issue.
