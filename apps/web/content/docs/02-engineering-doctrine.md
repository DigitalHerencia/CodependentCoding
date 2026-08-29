# Engineering Doctrine

## Causal model

The target applications handle tenant-owned state, provider-owned truth, asynchronous delivery, and agent-assisted change. Therefore the doctrine optimizes for explicit ownership, bounded authority, recoverable operations, narrow interfaces, and executable proof. Those values produce the layer grammar, server-operation contracts, security model, lifecycle model, and governance system.

## Principles

1. **Model before folders.** Define concepts, relationships, truth owners, invariants, and lifecycles before organizing code.
2. **Architecture owns responsibility.** Every consequential decision and side effect has one authoritative owner.
3. **Server owns business truth.** Clients submit intent and render results; they do not establish identity, scope, price, entitlement, settlement, or legal transition.
4. **Trust is earned progressively.** External data becomes runtime-valid, authenticated, authorized, domain-valid, persistence-ready, committed, and transport-safe through explicit boundaries.
5. **Reads and writes are different systems.** Fetchers are self-securing and read-only; actions adapt mutation transport; workflows coordinate use cases; transactions protect atomic facts.
6. **State ownership is plural but precise.** Clerk owns identity truth, Stripe owns provider payment truth, PostgreSQL owns application truth, and workflows own interpretation and transitions.
7. **Defense in depth is not duplicated policy.** Application authz makes business decisions; RLS contains tenant rows if application code errs.
8. **External success is not local completion.** Provider operations require durable intent, stable idempotency, recoverable intermediate state, webhook reconciliation, and operator-visible failures.
9. **Pure presentation is reusable presentation.** Components accept typed props/slots and do not acquire protected data or provider authority.
10. **Frameworks adapt around the application.** Next.js owns routes and framework effects; application workflows remain framework-neutral.
11. **Types do not validate runtime input.** Zod or equivalent runtime schemas guard every untrusted boundary.
12. **Persistence representations do not escape.** Selects limit retrieval; DTO mappers translate and serialize; generated Prisma models remain internal.
13. **Transactions are short and honest.** Network calls never run inside database transactions. Concurrent invariants use constraints, conditional writes, versions, and justified isolation.
14. **Errors are contracts.** Expected errors use stable codes; unknown errors preserve internal causes and expose safe messages.
15. **Freshness is a security property.** Authz, entitlement, readiness, payment, and time-sensitive decisions MUST NOT rely on unproven stale caches.
16. **Validation precedes completion.** A claim names the command or review performed, result, environment, and limits of what it proves.
17. **Specifications precede consequential implementation.** Product intent, acceptance, security, data, migration, and test impacts are bounded before code changes.
18. **Agents operate narrowly.** They inspect governing sources, preserve fixed boundaries, record decisions and evidence, and escalate authority-changing choices.
19. **Automation enforces settled decisions.** Formatting, types, imports, contracts, schema, tests, builds, and deployment checks mechanize doctrine where feasible.
20. **Exceptions are governed debt.** A deviation requires an owner, rationale, scope, risk, compensating control, expiry/review condition, and removal path.

## Opinionated defaults

- React Server Components by default; client islands only for browser interaction.
- Mobile-first Tailwind CSS 4 responsive composition; semantic tokens; accessible primitives.
- React Hook Form for nontrivial browser forms, backed by shared Zod schemas and authoritative server validation.
- Organization/Membership multi-tenancy; capability-based RBAC plus resource/workflow policies.
- Fresh authenticated tenant reads unless persistent caching is deliberately proved safe.
- One named workflow per business use case and one authoritative workflow per durable transition.
- Real PostgreSQL tests for RLS, constraints, transactions, concurrency, and leases.
- Pull-request delivery with CI, review, deploy authorization, and post-deploy smoke verification.

## Change and abstraction

Prefer the smallest correct change, direct domain-named modules, and local duplication over premature generic frameworks. Extract an abstraction only when a stable repeated concept has one meaning, one contract, and clear callers. Refactor behind characterization and contract tests. Broad rewrites require explicit scope and migration evidence.
