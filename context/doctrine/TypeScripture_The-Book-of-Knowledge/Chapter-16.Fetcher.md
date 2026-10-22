# Chapter 16: Fetcher

**The Book of Knowledge™**

## Definition

A Fetcher is an application **read operation**. Reads are separated from Actions, which own mutations.

## Responsibilities

Protected Fetchers authenticate and authorize the caller, establish the appropriate tenant/RLS database context, execute bounded reads, use explicit Prisma selects where persistence is involved, and map persistence records into deliberate application DTOs.

A Fetcher may validate read criteria with Zod when the criteria cross an untrusted runtime boundary. It may perform more than one database read when those reads genuinely belong to the read use case.

Read shape follows the question being answered. Counting, summing, existence checks, and bounded summaries use purpose-built aggregate/projection reads rather than fetching broad DTOs and issuing a second read per row. Independent reads may run concurrently; dependent or consistency-sensitive reads use the boundary that owns their consistency requirement.

## Non-responsibilities

Fetchers do not perform writes. They do not call provider SDKs merely to assemble application state. They do not return entire persistence models simply because Prisma can. They should not absorb arbitrary business processes that belong in Workflows.

## Security

Tenant and resource identifiers are lookup criteria, not proof of authority. Authorization and SQL-producing tenant/resource scope remain explicit, with RLS as independent containment.
