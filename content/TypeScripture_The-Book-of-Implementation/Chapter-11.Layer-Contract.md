# Chapter 11: Layer Contract

**The Book of Implementation™**

## Dependency matrix

| From | May use | Must not become |
|---|---|---|
| Fetcher | schemas when needed, auth/authz, tenant DB context, Prisma selects, DTO mappers | mutation path, provider workflow, UI layer |
| Action | schemas, auth/authz, tenant DB context, transaction helpers, DTO mappers, cache helpers | generic business-logic dumping ground |
| Workflow | existing Actions, Fetchers, Integrations, Utils, Types, Schemas, other narrowly appropriate helpers | duplicate implementation of those lower-level concerns |
| DB Select | Prisma types/select grammar | business logic or transport formatting |
| DTO Mapper | selected persistence records, application DTO types | database query owner, locale formatter, display-label owner, or presentation layer |
| Transaction Helper | Prisma transaction client, canonical selects, invariant-preserving local reads/writes | network/provider call or broad workflow |
| Auth | Clerk identity/session mechanics, narrow local identity context | general provider-integration folder |
| AuthZ | roles, permissions, resources, policies | authentication or persistence layer |
| Integration | provider SDK/client plus provider-specific capability helpers | product authorization layer |
| Utils | generic reusable helpers | miscellaneous dumping ground |
| Feature | authorized application DTOs, presentation state, Blocks, action references | persistence mapper, authorization owner, or domain invariant owner |

## Data crossing

Persistence-shaped records should stay behind the data boundary when a DTO is intended. Prisma selects define the exact persistence shape needed; DTO mappers deliberately convert that shape into application data, including explicit serialization of values such as dates.

Presentation-only transformations happen after DTO mapping in the Feature/presentation owner. A localized timestamp or visual risk label is not a persistence concern. Application/security semantics move in the opposite direction: Features consume authorized results and never recreate authorization or lifecycle rules.

## Enforcement

Use static import rules for deterministic constraints, real database tests for tenant/RLS containment, and review for semantic ownership. The important question is not whether a file has the approved name; it is whether the file actually owns the approved responsibility.
