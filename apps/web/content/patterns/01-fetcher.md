# Pattern 001: Fetcher

**Purpose/context.** A fetcher is a plain async server-only protected read use case called by routes, Server Components, or feature loaders when application data is needed.

**Responsibilities.** Parse unknown input; resolve trusted Actor; derive membership/capability/resource read scope; enter canonical RLS-scoped transaction; execute bounded tenant-scoped query with explicit select; map record to serializable DTO; return deliberate singular/list cardinality.

**Non-responsibilities.** No writes, provider calls, synchronization, email, redirect/not-found, JSX, framework invalidation, Prisma-model return, or unbounded `getAll`.

**Contract.** Input is `unknown` or a validated internal criterion; output is `DTO | null`, bounded list DTO, or typed error. Routes/features may call it. It calls schema, auth/authz, scoped data client, select, and mapper. It MUST embed legal tenant/ownership scope in the SQL-producing predicate and MUST NOT fetch broadly then reject.

**Behavior.** Authentication/authorization/validation failure is typed and fail-closed; missing authorized singular data returns `null` when defined; unknown failures retain safe correlation. Read-only transaction behavior only. Authenticated operational data is fresh by default; cache requires explicit scope/freshness/invalidation proof.

**Security/tenant.** Client identifiers are lookup criteria, never membership proof. RLS supplements query scope. Output is least-data and serializable.

**Naming/placement.** `lib/fetchers/<domain>/<verb>-<representation>.fetcher.ts`; names reveal cardinality, scope, representation, for example `listOrganizationProjects`.

**Lifecycle/tests.** Parse → actor → legal scope → RLS context → select/read → map → return. Unit-test schema/mapping/policy composition; real PostgreSQL tests prove role and cross-tenant containment; architecture tests forbid writes/providers/framework effects.

**Anti-patterns/adjacent.** Prisma in a feature; `getAll`; hidden sync writes; returning Date/Prisma records. Adjacent: authz, select, DTO, cache, route-feature orchestration.
