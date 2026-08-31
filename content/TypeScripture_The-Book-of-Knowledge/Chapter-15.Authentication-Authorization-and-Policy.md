# Chapter 15: Authentication, Authorization, and Policy

**The Book of Knowledge™**

## Layering

- Authentication establishes who/what is calling. Authorization establishes what that Actor may do in a tenant/resource context. Policy evaluates a named decision over explicit facts. Readiness determines whether operational/provider prerequisites are satisfied. RLS contains rows; it is not product authorization.

## Identity model

- Clerk proves external identity/session. The authentication boundary maps that identity to an active local User/Actor. Actor is tenant-neutral until active Membership is resolved.
- PostgreSQL owns Membership, Role, and Capability relationships. Business code evaluates capabilities and record-aware policies, not scattered raw role strings.

## Authority rules

- Route/layout gating may improve UX but does not replace authoritative authorization in Fetchers/Workflows.
- Client user IDs, roles, capabilities, organization IDs, prices, customer/account IDs, or provider metadata never establish authority.
- Inaccessible cross-tenant resources should generally resolve as not found when disclosure would leak existence.

## RLS relationship

- Every tenant-owned row has an explicit tenant key. Every protected DB operation scopes tenant/resource in SQL-producing predicates and executes under transaction-local RLS context with a restricted non-owning runtime role.
