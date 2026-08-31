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

## Concurrent mutation

- Persist transitions with tenant scope plus expected current state/version in the SQL-producing predicate. A failed conditional update is a conflict or not-found according to the disclosure contract.

## Validation

- Test transition matrices, illegal states, concurrent writers, idempotent duplicates, recovery from partial failures, and audit/output invariants.
