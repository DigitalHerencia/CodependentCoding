# Chapter 19: System Lifecycle

**The Book of Implementation™**

## Canonical model

```ts
export const projectStates = ["active", "archived"] as const;
export type ProjectState = (typeof projectStates)[number];

const legalTransitions: Record<ProjectState, readonly ProjectState[]> = {
  active: ["archived"],
  archived: [],
};

export function assertProjectTransition(from: ProjectState, to: ProjectState) {
  if (!legalTransitions[from].includes(to)) throw new DomainConflict("ILLEGAL_TRANSITION");
}
```

Other representations derive from the canonical state list or translate it exhaustively. Do not independently retype the same states in TypeScript, Zod, Prisma, provider adapters, and UI options.

## Concurrent mutation

- Persist transitions with tenant scope plus expected current state/version in the SQL-producing predicate. A failed conditional update is a conflict or not-found according to the disclosure contract.
- Allocate sequential human numbers and enforce rate/admission windows with a database-backed serialization, allocator, advisory lock, or conditional atomic mutation. `MAX + 1` and count-then-create are not concurrency-safe unless the deciding read and write are protected as one admission decision.

## Validation

- Test transition matrices, illegal states, concurrent writers, idempotent duplicates, recovery from partial failures, and audit/output invariants.
