---
title: {{appName}} — Product Requirements
doc: prd
status: draft
updated: {{createdAt}}
compiles_to: .claude/contracts/application.yaml (identity, goals, non_goals)
---

# {{appName}} — Product Requirements

<!-- Filled by `/idea` (Loaded Vibes) or with the owner. Replace every TODO; keep the headings. Short and concrete beats complete. -->

## 1. Problem

TODO: Who has the problem, what it costs them today, and how they cope now. One paragraph.

## 2. Users

| Persona | Role in the app (owner, admin, member, viewer, or a portal client) | Main job to be done |
| ------- | ------------------------------------------------------------------ | ------------------- |
| TODO    | TODO                                                               | TODO                |

## 3. Goals

TODO: Three to five measurable outcomes for v1 (for example "a member logs a job in under 30 seconds").

1. TODO

## 4. Non-goals

TODO: What v1 deliberately does not do. Agents stop and ask before building anything listed here.

- TODO

## 5. Scope: capabilities

<!-- One row per capability. Module = an installed module ({{modules}}) or a new domain the CLI will slice (`hipster-stack slice`). -->

| Capability | Module | Entities | Priority (p0 to p3) |
| ---------- | ------ | -------- | ------------------- |
| TODO       | TODO   | TODO     | TODO                |

## 6. Entities

<!-- Per entity: fields in the slice DSL, e.g. `name:string, amount:decimal?, status:enum(open|won|lost), dueAt:datetime?, ownerId:ref(User)`. -->

| Entity | Fields | Owned by (module) |
| ------ | ------ | ----------------- |
| TODO   | TODO   | TODO              |

## 7. Key flows

TODO: Numbered steps for the two or three flows that make or break the product.

## 8. Success metrics

TODO: How the owner will know v1 works (usage, time saved, revenue).

## 9. Open questions

- TODO
