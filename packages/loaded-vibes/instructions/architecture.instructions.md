# Loaded Vibes — Architecture Instructions

- Treat repository-local adopted architecture and current code as the implementation authority beneath explicit user direction.
- Classify by responsibility, not vendor or abstraction fashion.
- Thin routes; Features orchestrate; PureUI Blocks render; primitives remain lowest-level presentation.
- Persisted reads → fetchers. Ordinary CRUD writes → actions. Business/application orchestration → workflows. Atomic DB invariants → transactions.
- Authentication establishes identity; authorization decides access.
- Provider mechanics stay provider-owned except Clerk→auth, Neon→db, Prisma→db + root prisma lifecycle.
- Provider webhook HTTP lifecycle stays under `app/api/{provider}/.../route.ts`.
- Prefer minimum hierarchy. Do not add generic services/managers/processors when a named responsibility already exists.
