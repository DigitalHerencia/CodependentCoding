# Chapter 04: Engineering System Definition

**The Book of Knowledge™**

## Definition

Codependent Coding™ is the WebApp architecture and the system that explains and governs how it is understood and built. Hipster Stack™ resolves product choices and materializes an Arrangement from the shared schema, core, CLI, and Maximal Template. Loaded Vibes™ operates on an Arrangement after generation as the agent/tooling layer for inspection, validation, maintenance, and enforcement. A generated template or product application instantiates the architecture; it is not the architecture itself.

## Operational backbone

The application's backend-ish operational backbone is `lib`: Actions, Auth, AuthZ, Cache, Constants, DB, Fetchers, Integrations, Utils, and Workflows. It is intentionally broader than a folder literally named `server`.

At the project root, `types/` owns TypeScript contracts, `schemas/` owns domain-organized Zod runtime validation, `prisma/` owns the authored database schema/migrations/seed/RLS lifecycle, and `generated/prisma/` is generated output rather than hand-authored architecture.

## State ownership

Clerk owns external authentication/identity truth. PostgreSQL owns local application state, membership, RBAC, and tenant-owned persistence. Provider services own their external truth. Application operations interpret that truth through explicit boundaries rather than letting provider objects or persistence records leak everywhere.

## Security defaults

Protected reads and mutations authenticate and authorize. Tenant-owned database operations establish the intended tenant context and use RLS as independent containment. Zod validates untrusted runtime input at the boundary where it becomes trusted application data.

## Abstraction rule

Prefer direct domain-named modules and explicit imports over speculative generic layers or barrel exports. Extract a reusable abstraction when it has one stable meaning and clear callers, not merely because two files look similar.

## Semantic contracts

Placement does not prove coherence. Each cross-layer concept names its authority and its derivatives: role vocabulary, lifecycle states, configuration keys, error taxonomy, resource policies, webhook identity, and sequence/allocation rules. Generated types may describe a persistence representation, but generated output does not silently become product authority unless the architecture explicitly says it does.

Domain rules stay with the operation or domain owner that enforces them. `utils/` is not a refuge for calculations, transition rules, provider limits, or scheduling policy that already have an obvious business owner.
