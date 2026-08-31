# Chapter 11: Layer Contract

**The Book of Implementation™**

## Dependency matrix

| From | May call | Must not call |
|---|---|---|
| Page/Layout | Feature, presentation | Fetcher, Action, Workflow, Prisma, provider SDK |
| Feature | Fetcher, Blocks/Primitives, action references | Prisma, provider SDK, Workflow directly |
| Component/Block | lower presentation, supplied callbacks/actions | protected I/O, authz, Prisma, provider SDK |
| Fetcher | schema, auth/authz, DB read primitives, mapper | writes, providers, framework effects |
| Action | schema, auth, Workflow, cache/navigation adapter | Prisma, provider SDK, transaction |
| Workflow | authz/policy, approved DB helpers/transactions, integrations | React, Next navigation/cache |
| DB primitive | Prisma/SQL | React, routes, providers |
| Integration | provider SDK, config | product authorization, React |

## Enforcement

- Use ESLint/import rules for deterministic dependency constraints, contract tests for boundary shapes, real DB/browser tests for runtime properties, and review for semantic ownership.
