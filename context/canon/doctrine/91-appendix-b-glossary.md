---
title: Glossary
slug: glossary
order: 91
summary: Every term the doctrine uses, in the standard engineering vocabulary, with the house name where one exists.
---

# Glossary

| Term                           | Meaning                                                                                                                                                            | House name (if different)      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| **Access context**             | `{ userId, organizationId, membershipId, role }` resolved from the database inside the tenant transaction. The only source of "who" and "where" for authorization. | —                              |
| **Action**                     | A Next.js Server Function exported from a `"use server"` file. A public POST endpoint; the mutation entry point.                                                   | —                              |
| **Admission mode**             | How a new sign-up gains access: `approval`, `self-serve`, `invite-only`.                                                                                           | approval gate                  |
| **Block**                      | A reusable, pure composition of primitives with narrow props.                                                                                                      | —                              |
| **Cache Components**           | Next.js 16 model where caching is opt-in per function/component with `'use cache'`, `cacheLife`, `cacheTag`.                                                       | —                              |
| **Client island**              | A small client component inside a server-rendered feature.                                                                                                         | —                              |
| **Composition (logic)**        | Arranging fetchers, transaction helpers and integrations into a use case.                                                                                          | BusinessLogic Block / workflow |
| **Composition (presentation)** | Arranging primitives into blocks, blocks into templates.                                                                                                           | PureUI                         |
| **CSP nonce**                  | A per-request random value that marks which inline scripts the browser may run. Requires dynamic rendering.                                                        | —                              |
| **Defense in depth**           | Independent controls, each written assuming the others failed.                                                                                                     | —                              |
| **DTO**                        | Data transfer object: the exact JSON shape allowed to leave the server. The mapper is the allowlist.                                                               | —                              |
| **Fetcher**                    | A server-only read use case: validate → authenticate → authorize → scoped bounded read → DTO.                                                                      | —                              |
| **Feature**                    | The server component that awaits logic and hands DTOs to a template. Where the two compositions meet.                                                              | feature orchestration          |
| **Idempotent**                 | Running twice has the same effect as once. Achieved with idempotency keys and unique constraints.                                                                  | —                              |
| **IDOR**                       | Insecure direct object reference: changing an ID in a request to reach someone else's record.                                                                      | —                              |
| **InitPlan**                   | A sub-select Postgres evaluates once per statement and reuses; why policies wrap `current_setting` in `(SELECT …)`.                                                | —                              |
| **Inbox**                      | The `WebhookEvent` table: one row per provider delivery, unique by `(provider, eventId)`, with lease columns.                                                      | webhook process log            |
| **Lease**                      | A time-boxed claim on an inbox row so two concurrent deliveries cannot process the same event.                                                                     | lock token                     |
| **Module**                     | A unit of the Maximal Template (domain like `crm`, add-on like `billing`) whose files are owned by naming convention.                                              | —                              |
| **Optimistic concurrency**     | Updating `WHERE version = expected` and treating zero rows as a conflict.                                                                                          | —                              |
| **Primitive**                  | A shadcn/Radix control in `components/ui`.                                                                                                                         | —                              |
| **Provider truth**             | The state a provider (Stripe, Clerk) is authoritative for. The app owns the consequences.                                                                          | —                              |
| **Proxy**                      | `proxy.ts`, the Next 16 rename of middleware. A gate, never the enforcement point.                                                                                 | front door                     |
| **RBAC / ABAC**                | Role-based access control (role → permissions) / attribute-based (rules over record attributes like owner, assignee, shared).                                      | —                              |
| **RLS**                        | Postgres row-level security. `FORCE` makes the table owner obey too — but not a role with `BYPASSRLS`.                                                             | —                              |
| **Runtime role**               | `app_runtime`: the database role the app connects as. Not an owner, `NOBYPASSRLS`.                                                                                 | restricted role                |
| **Select**                     | A Prisma `select` object: the column allowlist for a read.                                                                                                         | projection                     |
| **Slice**                      | One business domain cut vertically through every layer (`crm`, `invoicing`).                                                                                       | —                              |
| **Step-up authentication**     | Re-verifying identity (and MFA) immediately before a dangerous action.                                                                                             | —                              |
| **Template**                   | A pure arrangement of blocks for a slice's pages.                                                                                                                  | page template                  |
| **Tier**                       | When a rule becomes mandatory: `now`, `users`, `scale`.                                                                                                            | solo-scale tiering             |
| **Transaction helper**         | A function that takes a transaction client and trusted input and performs an atomic write.                                                                         | —                              |
| **Trust boundary**             | Any point where outside input enters: forms, params, request bodies, webhooks, env vars, queued jobs. Validate there.                                              | —                              |
| **Workflow**                   | A named server-only use case composed from fetchers, transaction helpers and integrations. Called by features (reads) and actions (writes). Never calls an action. | BusinessLogic Block            |
