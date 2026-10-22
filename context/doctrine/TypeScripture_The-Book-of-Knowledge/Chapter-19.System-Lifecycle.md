# Chapter 19: System Lifecycle

**The Book of Knowledge™**

## Definition

- A lifecycle defines legal states, transitions, transition authority, invariants, concurrency behavior, recovery, audit, and terminal semantics for something that changes over time.

## Lifecycle classes

- Domain entity lifecycle.
- Provider mirror lifecycle.
- Operation/idempotency lifecycle.
- Delivery/webhook/outbox lifecycle.
- Access/membership lifecycle.
- Release lifecycle.

## Invariants

- States and transition names are explicit closed vocabularies.
- One authoritative owner decides each transition.
- Illegal transitions fail closed.
- Race-sensitive transitions use current facts plus conditional/atomic enforcement.
- Provider state and local state remain distinct and reconcile explicitly.
- Recovery paths and audit evidence are part of the lifecycle, not optional afterthoughts.
- Every closed state vocabulary has one semantic owner; schemas, types, persistence, mappings, and UI derive from or exhaustively translate it.
- Human-readable sequential identifiers and rate/admission limits are allocation problems, not ordinary reads. Concurrent attempts require serialization, a database allocator, conditional mutation, or another atomic admission mechanism.

## Runtime ownership

- Page/request lifecycles describe responsibility flow; they do not create a Feature-loader layer. Page → Feature → Fetcher(s) is the canonical read composition.
