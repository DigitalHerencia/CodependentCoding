# Chapter 18: Server Action

**The Book of Knowledge™**

## Definition

An Action is an application **mutation operation**. React/Next Server Actions are the framework mechanism commonly used to expose these mutations, but the architectural idea is simpler: Fetchers read; Actions write.

## Responsibilities

An Action accepts mutation input, validates untrusted runtime data with the domain Zod schema, establishes authentication, performs authorization, enforces mutation-specific invariants, executes the required persistence work under the correct tenant/RLS context, and returns an application-safe result.

An Action may read existing state when the mutation needs that state for authorization, invariant checking, deciding what to update, or returning the result. The fact that a mutation contains a read does not turn it into a Fetcher.

## Database helpers

Actions may use Prisma selects, DTO mappers, and transaction helpers. Transaction helpers are appropriate when multiple local database facts must commit atomically.

## Boundary

Actions should not become a dumping ground for every multi-step business process. When the business operation is primarily composition across existing Actions, Fetchers, integrations, calculations, or other capabilities, the composition belongs in a domain Workflow.
