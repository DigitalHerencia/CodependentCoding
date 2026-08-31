# Chapter 16: Fetcher

**The Book of Knowledge™**

## Definition

- A Fetcher is a self-securing, server-only protected read use case returning bounded serializable DTOs. It is the complete application read boundary, not a generic fetch wrapper.

## Responsibilities

- Parse unknown read criteria.
- Resolve trusted Actor and tenant/capability/resource read scope.
- Enter the canonical RLS-scoped transaction for protected tenant data.
- Execute bounded tenant-scoped reads using explicit selects.
- Map persistence records to DTOs.
- Return deliberate singular/list cardinality.

## Non-responsibilities

- No writes, provider calls, synchronization, messaging, rendering, framework navigation/invalidation, persistence-record leakage, or unbounded collection reads.
- Do not create `getThingPageState` Fetchers that absorb Feature orchestration. A Feature composes multiple Fetchers when the page needs multiple read use cases.

## Authority

- Identifiers are lookup criteria, not membership/ownership proof. Legal scope must participate in the SQL-producing predicate, with RLS as independent containment.
