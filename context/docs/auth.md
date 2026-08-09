---
title: Loaded Vibes Authentication Authorization and Security Requirements
artifact: auth
status: approved-governance
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Authentication, Authorization, and Security

This document governs:

1. security of the Loaded Vibes CLI/generator;
2. auth/authz invariants of generated SaaS output.

## 1. Generator identity model

The local CLI has no application user-account system.

V1 must not:

- authenticate to Neon, Clerk, Stripe, GitHub, or Vercel on the user's behalf;
- collect provider secrets;
- copy ambient credentials into output;
- persist CLI auth tokens;
- auto-provision provider resources;
- auto-deploy.

## 2. Filesystem trust

Target path is untrusted input.

Before mutation:

- normalize/resolve;
- reject dangerous roots;
- reject non-empty destinations;
- reject symlink/path escapes;
- keep staging/final target inside intended parent;
- never delete a path not created by the current run.

## 3. Command execution

- Use subprocess APIs with argument arrays.
- Never concatenate untrusted values into shell strings.
- Do not execute arbitrary config-provided commands.
- Do not download/execute arbitrary remote templates in V1.
- Treat exit codes as evidence.
- Sanitize failure output for secrets.

## 4. Secret handling

Generated projects may include `.env.example` and typed schemas, never real values.

Template absorption and package publication must exclude:

- populated `.env*`;
- Clerk caches/keyless material;
- provider CLI auth;
- Vercel local auth/state;
- DB credentials;
- npm tokens;
- GitHub credentials;
- secret-bearing test artifacts.

Release validation includes secret scanning.

## 5. Generated authentication

Clerk proves identity. The app maps identity into local application state.

```text
Clerk session
-> local User
-> active Membership
-> local role/capabilities
-> resource/workflow authorization
-> tenant-scoped persistence
```

Clerk identity alone is not application authorization.

## 6. Local tenancy and authorization

Generated baseline owns:

- local `User`;
- `Organization` as default tenant entity;
- `Membership`;
- roles/capabilities;
- resource policies;
- workflow policies.

Every protected server operation authenticates and authorizes server-side.

Never trust client-supplied:

- user IDs;
- tenant/org IDs;
- membership IDs;
- roles/capabilities;
- provider IDs;
- prices/payment authority;
- privileged return URLs.

## 7. Tenant containment and RLS

Tenant-owned records require an unambiguous tenant key.

Where canonical doctrine specifies RLS:

- PostgreSQL RLS provides defense in depth;
- tenant context is transaction-local through the canonical helper;
- tenant operations use the transaction-scoped Prisma client;
- application authorization and RLS are complementary.

Generator configuration may not disable canonical tenant security.

## 8. Read boundary

```text
untrusted input
-> Zod
-> actor
-> membership/capability authorization
-> tenant/RLS scope
-> explicit select
-> DTO
-> transport-safe output
```

Fetchers are read-only and self-secure.

## 9. Mutation boundary

```text
Server Action
-> runtime validation
-> actor
-> authorization
-> workflow
-> invariants/readiness
-> transaction/provider sequence
-> audit/recovery
-> invalidation/redirect
-> typed result
```

Actions do not own persistence mechanics. Transactions do not own UI behavior.

## 10. Provider boundaries

Provider SDKs remain server-owned behind integration adapters.

Consequential provider workflows:

- persist local intent/idempotency before external calls;
- perform network calls outside DB transactions;
- persist normalized results;
- reconcile authoritative provider truth via retrieval/webhooks;
- expose recoverable partial states.

## 11. Webhooks

```text
raw request
-> signature verification
-> normalized runtime validation
-> durable atomic claim
-> idempotent processing
-> terminal/retryable state
-> provider-compatible response
```

An event row does not prove completed processing.

Do not persist unrestricted payloads or secrets.

## 12. Security-change triggers

Changes to privileged roles, capabilities, tenant keys, RLS, auth routes, provider money movement, or webhook authority require explicit spec coverage and targeted security tests.

## 13. Validation ownership

Generator tests prove the generator preserves security surfaces.

Generated-application tests prove app behavior.

High-risk claims about auth, RLS, money movement, provider reconciliation, or migrations require real-boundary tests where practical. Mock-only success is insufficient.

## 14. Deployment boundary

V1 generates Vercel-oriented code but does not authenticate to or deploy through Vercel.

Credentials/provider config are supplied later through approved target-environment processes.
