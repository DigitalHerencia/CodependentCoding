# Chapter 20: Transaction Helper

**The Book of Knowledge™**

## Prisma Selects

A Prisma Select defines the exact persistence fields and relations an operation needs. This avoids casually retrieving whole records and also creates a typed persistence contract: Prisma can derive the TypeScript result type from the select itself.

## DTO Mappers

A Data Transfer Object mapper converts persistence-shaped data into the application shape that is allowed to cross the data boundary. It deliberately chooses fields and normalizes representations such as dates. In plain terms: Prisma gives us database-shaped data; the mapper turns it into application-shaped data.

DTO mapping is not presentation formatting. Locale-dependent timestamps, display strings, badges, and view risk classifications belong to presentation orchestration. Manual date/decimal serialization outside the established mapper is a boundary smell when the same persistence type already has a canonical DTO.

## Transaction Helpers

A Transaction Helper defines local database facts that must succeed or fail together. Its defining property is **atomicity**: all of the transaction commits, or none of it does.

Atomicity is not idempotency. **Atomicity** is all-or-nothing. **Idempotency** means repeating the same logical operation does not create unintended additional effects. Transactions can help implement an idempotent workflow, but using a transaction does not automatically make an operation idempotent.

## Responsibilities

Transaction Helpers accept a transaction-scoped Prisma client and perform the reads/writes required for one atomic local operation. Audit or outbox records that are part of the same logical database fact should be written in the same transaction when appropriate.

Race-sensitive read-then-write logic must be atomic at the database boundary. `MAX + 1`, count-then-create rate limits, version checks, claims, and allocation decisions are unsafe when the deciding read and admitting write can interleave. A unique constraint preserves integrity but does not by itself provide a successful concurrency contract for callers.

## Boundary

Network/provider calls do not belong inside long database transactions. Tenant-aware runners establish transaction-local tenant/identity context before protected work executes; provider-side runners establish the trusted provider/organization context required by that flow.
