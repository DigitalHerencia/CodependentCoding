# Chapter 11: Layer Contract

**The Book of Implementation™**

## Dependency matrix

| From | May use | Must not become |
|---|---|---|
| Fetcher | schemas when needed, auth/authz, tenant DB context, Prisma selects, DTO mappers | mutation path, provider workflow, UI layer |
| Action | schemas, auth/authz, tenant DB context, transaction helpers, DTO mappers, cache helpers | generic business-logic dumping ground |
| Workflow | existing Actions, Fetchers, Integrations, Utils, Types, Schemas, other narrowly appropriate helpers | duplicate implementation of those lower-level concerns |
| DB Select | Prisma types/select grammar | business logic or transport formatting |
| DTO Mapper | selected persistence records, application DTO types | database query owner or presentation layer |
| Transaction Helper | Prisma transaction client, canonical selects, invariant-preserving local reads/writes | network/provider call or broad workflow |
| Auth | Clerk identity/session mechanics, narrow local identity context | general provider-integration folder |
| AuthZ | roles, permissions, resources, policies | authentication or persistence layer |
| Integration | provider SDK/client plus provider-specific capability helpers | product authorization layer |
| Utils | generic reusable helpers | miscellaneous dumping ground |

## Data crossing

Persistence-shaped records should stay behind the data boundary when a DTO is intended. Prisma selects define the exact persistence shape needed; DTO mappers deliberately convert that shape into application data, including explicit serialization of values such as dates.

## Enforcement

Use static import rules for deterministic constraints, real database tests for tenant/RLS containment, and review for semantic ownership. The important question is not whether a file has the approved name; it is whether the file actually owns the approved responsibility.
