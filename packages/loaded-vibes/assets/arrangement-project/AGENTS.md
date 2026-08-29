# Arrangement™ — Loaded Vibes™ Operating Contract

This repository is an Arrangement generated under The Codependent Coding™ WebApp Architecture.

## Universal workflow

```text
inspect actual state
→ classify owning responsibility
→ make the smallest complete change
→ run proportional verification
→ inspect the diff
→ deliver only when requested
```

## Architecture

- Routes own URL/HTTP boundaries.
- Features orchestrate application capabilities.
- `components/blocks` is pure reusable presentation.
- `components/ui` is raw presentation primitives; normal features consume Blocks. React Hook Form feature forms are the explicit direct-primitive exception.
- Every persisted application read belongs in `lib/fetchers`.
- Ordinary persisted CRUD mutation boundaries belong in `lib/actions`.
- Business/application logic is constituted in `lib/workflows/{domain}` from existing server operations/helpers.
- Atomic DB invariants belong in `lib/db/transactions`; no provider/network I/O inside transactions.
- Prisma selects and DTO mappers belong in `lib/db/selects` and `lib/db/dto`.
- Clerk/authentication → `lib/auth`. Authorization/RBAC/ABAC/resource policy → `lib/authz`.
- Provider-specific mechanics → `lib/integrations/{provider}`, except Neon/Prisma database ownership and Clerk auth ownership.
- Provider webhook HTTP lifecycle → `app/api/{provider}/.../route.ts`.
- Prefer minimum hierarchy. Do not create `services/`, `managers/`, `processors/`, or speculative abstractions when an existing responsibility already names the work.

## Security

Preserve authentication, authorization, tenant/resource scoping, RLS containment, secret boundaries, provider truth separation, and webhook verification/idempotency. Never weaken a security control merely to make a change pass.

## Validation

Choose checks based on changed behavior. Focused checks first; broad suites when required by repository policy or blast radius. Never report an unrun check as passing.

## Delivery

Preserve unrelated work. Do not commit, push, open/merge PRs, deploy, mutate production data, or perform other consequential external actions unless requested and authorized. Read back external state before claiming it changed.
