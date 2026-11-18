# Authentication, Authorization and Tenancy

> **Status:** Draft · **Owner:** TODO: · **Last updated:** TODO:

Who users are, what they belong to, what they may do, and how that is enforced.

Fill every `TODO:`. Write `None` or `N/A — reason` when a section does not apply; never delete a section. Each section lists the specs it feeds, so the build process can be traced back to this document.

## Identity and sessions

_Identity provider, sign-in methods and session rules. Clerk handles identity and sessions only; organizations are app-owned._

- **Provider:** Clerk
- **Sign-in methods:** TODO:
- **Session lifetime:** TODO:

**Feeds:** `ENG-M1-P1.2-SCAFF-T04`

## Tenancy model

_Single or multi tenant (set by the generator), and how users join an organization._

- **Mode:** TODO: (single | multi)
- **Uninvited sign-ups:** TODO:
- **Active organization resolution:** TODO:

**Feeds:** `ENG-M1-P1.3-AUTH-T01`

## Roles and permissions

_The access model (RBAC or ABAC, set by the generator) and the full permission matrix._

- **Model:** TODO: (rbac | abac)
- **Default role for new members:** TODO:

| Permission | TODO: owner | admin | member |
| ---------- | ----------- | ----- | ------ |
| TODO:      | ✓           |       |        |

**Feeds:** `ENG-M1-P1.3-AUTH-T02`

## Onboarding and invitations

_How a new user goes from sign-up to a working account, and how invitations work._

1. TODO:

**Feeds:** `ENG-M1-P1.3-AUTH-T01`, `ENG-M2-P2.1-MVP-T05`

## Server-side enforcement

_Every read and write path checks identity, tenant and permission on the server._

- **Read path:** fetcher requires tenant context and permission
- **Write path:** action validates input, then checks permission
- **Exceptions (public routes):** TODO:

**Feeds:** `ENG-M1-P1.3-AUTH-T04`, `ENG-M2-P2.2-VALIDATE-T04`, `ENG-M3-P3.1-SEC-T01`

## Row-level security

_Database policies that enforce tenant isolation even if application code is wrong._

| Table | Policy       | Tested by       |
| ----- | ------------ | --------------- |
| TODO: | tenant match | `pnpm test:rls` |

**Feeds:** `ENG-M1-P1.3-DATA-T04`, `ENG-M2-P2.2-VALIDATE-T04`

## Webhook sync

`POST /api/clerk/webhooks` delegates to server-only `lib/workflows/authWorkflows.ts`.
Clerk verifies the raw request signature before any event is claimed. The handler
requires `svix-id`; the shared `webhookEventTx.ts` ledger hashes the raw payload,
acknowledges duplicates and rejects changed payload/type reuse with HTTP 409.
Failed or stale claims retain the existing retry behavior. Identity changes and
event completion share a provider transaction; failures record only a bounded
diagnostic code, never the request payload, credentials or personal data.

- `user.created` / `user.updated`: retain identity synchronization and the accepted
  PR #363 verified-primary-email provisioning and tenancy gates.
- `user.deleted`: suspend memberships, audit deactivation, anonymize the local user.
- Other verified event types: acknowledge through the same idempotency ledger.

Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` for the intended
Clerk instance. Both remain optional in `schemas/envSchemas.ts` to preserve local
Clerk keyless development. Only the publishable key is browser-visible. The base
reader in `lib/utils/env.ts` validates these lazily. The webhook verifier reads
`CLERK_WEBHOOK_SIGNING_SECRET` through that reader and rejects requests if it is
unset; no development or unsigned processing bypass exists.

Create separate webhook endpoints for development and production in the matching
Clerk instances. Each has its own signing secret: set the corresponding
`CLERK_WEBHOOK_SIGNING_SECRET` in that environment's secret store. Do not reuse a
development signing secret in production or commit real values or tunnel domains.
Subscribe to the three user events above.

Optional local forwarding uses `clerk webhooks listen --forward-to http://localhost:3000/api/clerk/webhooks`.
Inspect the installed CLI's help for authentication/token requirements, register
its relay URL as a development webhook endpoint, and use that endpoint's signing
secret. Alternatively follow Clerk's official local webhook guide with a temporary
HTTPS tunnel to the same endpoint.
Do not point local deliveries at a production database. No listener or live
delivery is required by the static checks for #364, and none was run.

Provider transactions and RLS helpers are preserved. A dedicated least-privilege
webhook database login needs separately authorized database-role/configuration
work; this task does not widen privileges or alter migrations or RLS policies.

Official references: [Clerk webhook verification](https://clerk.com/docs/reference/backend/verify-webhook),
[Clerk CLI](https://clerk.com/docs/cli),
[webhook setup and local forwarding](https://clerk.com/docs/guides/development/webhooks/syncing),
[Core 3 finalization](https://clerk.com/articles/from-setactive-to-finalize-migrating-custom-auth-flows-to-clerk-core-3).

Auth presentation was compared with upstream BoldKit `application/auth-forms`,
`onboarding-flow` and `error-pages` at commit
`93ffef8ac58ae45c3574ebe07c0cafbb6bf32a38`. The existing split layout is retained;
the form field/password-toggle and server-error presentation is adapted to the
existing primitives, editorial copy and Clerk operations. No demo authentication
handlers or onboarding requirements were imported. `components.json` had a missing
opening brace; its existing `@boldkit` URL is retained. The three corresponding
`https://boldkit.dev/r/{name}.json` requests returned HTML during this inspection,
so registry installation itself remains unverified.

**Feeds:** `ENG-M1-P1.3-AUTH-T03`

## Admin and user management

_What administrators can do and the guardrails around it._

- **Admin actions:** TODO:
- **Guardrails:** the last owner cannot be removed; every action is audited

**Feeds:** `ENG-M2-P2.1-MVP-T05`

## Secrets and key management

_Where each secret lives, who can read it, and how it is rotated._

| Secret | Stored in | Rotation |
| ------ | --------- | -------- |
| TODO:  |           |          |

**Feeds:** `ENG-M1-P1.2-SCAFF-T05`, `ENG-M1-P1.2-CONFIG-T03`, `ENG-M2-P2.3-CICD-T03`, `ENG-M3-P3.1-SEC-T04`

## Data protection and PII

_Personal data held, why, for how long, and who receives it._

| Data  | Purpose | Retention | Shared with |
| ----- | ------- | --------- | ----------- |
| TODO: |         |           |             |

**Feeds:** `ENG-M2-P2.1-MVP-T04`, `ENG-M3-P3.1-SEC-T02`, `ENG-M3-P3.2-HARD-T02`

## Audit logging

_Which actions are audited and how long the audit log is kept._

- **Audited actions:** TODO:
- **Retention:** TODO:

**Feeds:** `ENG-M2-P2.1-MVP-T05`

## Threat model and security review

_Main threats and the control for each. Reviewed at each security gate._

| Threat                   | Control            | Verified by     |
| ------------------------ | ------------------ | --------------- |
| Cross-tenant data access | RLS + server authz | `pnpm test:rls` |
| TODO:                    |                    |                 |

**Feeds:** `ENG-M1-P1.3-AUTH-T05`, `ENG-M3-P3.1-SEC-T01`, `ENG-M3-P3.1-SEC-T05`

## Auth/authz ownership update (CC-080, approved 2026-11-18)

For Maximal Template, the owner-approved [CC-080 specification](../../../../context/specs/issues/CC-080-auth-route-slices.md) supersedes previous profile/onboarding details. Auth owns identity, Clerk sessions, and a local profile stored in nullable User columns. An explicit completion timestamp makes empty optional profiles complete. Mandatory onboarding is a modal, independent of tenancy, with no profile page or edit trigger yet. Authz owns organizations, permissions and tenancy.

Auth and onboarding workflows compose application logic; credential templates compose blocks; blocks compose shadcn primitives and copy. Auth page routes only wrap features in Suspense. Scoped import boundaries are enforced in the template ESLint configuration. Auth/authz Prisma, RLS and seed ownership follow the same split.
