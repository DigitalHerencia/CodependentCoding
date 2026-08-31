# Chapter 14: Application Workflow

**The Book of Knowledge™**

## Definition

- A Workflow owns one named application use-case sequence across authorization, current facts, lifecycle/readiness, persistence, providers, audit/recovery, and result shaping.

## Responsibilities

- Receive trusted Actor plus validated command.
- Load current authoritative facts.
- Authorize the actual resource and legal transition.
- Coordinate local atomic phases and external provider phases without pretending they share a transaction.
- Establish idempotency/durable intent where external effects are consequential.
- Return framework-neutral DTO/result plus logical invalidation intent.

## Non-responsibilities

- No framework transport concerns, UI rendering, raw HTTP/signature adaptation, provider mechanics, or long database transactions across network calls.

## Ownership rule

- Workflows are owned by their business domain rather than by a generic application-services layer. Concrete file placement belongs in the paired Implementation chapter.
