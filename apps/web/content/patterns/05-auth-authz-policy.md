# Pattern 005: Authentication, Authorization, and Policy

**Purpose/context.** Separate identity, local account, membership, capability, resource policy, workflow legality, readiness, and RLS containment so each question has one owner.

**Responsibilities.** Auth maps verified Clerk session to active local Actor. Authz resolves active Organization Membership and role-derived capabilities, returns legal read scopes, and evaluates resource/workflow policies over facts. System actors are explicit and narrowly typed.

**Non-responsibilities.** Clerk metadata does not own roles/tenant/billing/workflow. UI hiding is not authorization. Capability policy is not readiness or lifecycle transition legality. RLS is not the complete product policy.

**Contract.** Server operations call auth/authz. User Actor includes local and external identity; system Actor includes named system and request/event correlation. Policy consumes plain facts and returns scope/allow or typed denial. Missing cross-tenant membership/resource fails closed.

**Transaction/cache.** Membership reads use approved data boundaries/RLS context. Pure policies have no transaction. Request-local Actor memoization is allowed; persistent authz cache requires revocation/freshness proof.

**Security/tenant.** Client user/tenant/role/capability is never authoritative. Role → capabilities → resource/workflow policy. RLS independently contains tenant rows.

**Naming/placement.** `lib/auth/actor.ts`; `lib/authz/<domain>.scope.ts`, `.policy.ts`; capability `<resource>.<operation>.<scope>`.

**Lifecycle/tests.** session → local User → Membership → capability → resource policy → workflow guard; test missing/disabled/suspended, every role/resource combination, system restrictions, stale membership, and real RLS bypass attempts.

**Anti-patterns/adjacent.** global admin by email, boolean soup, raw role comparisons, Clerk public metadata truth. Adjacent: fetcher, workflow, lifecycle, RLS.
