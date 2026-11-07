# Authentication, Authorization and Tenancy

> **Status:** Draft · **Owner:** TODO: · **Last updated:** TODO:

Who users are, what they belong to, what they may do, and how that is enforced.

Fill every `TODO:`. Write `None` or `N/A — reason` when a section does not apply; never delete a section. Each section lists the specs it feeds, so the build process can be traced back to this document.

## Identity and sessions

_Identity provider, sign-in methods and session rules. Clerk handles identity and sessions only; organizations are app-owned._

- **Provider:** Clerk
- **Sign-in methods:** TODO:
- **Session lifetime:** TODO:
- **Bootstrap owner:** `BOOTSTRAP_OWNER_CLERK_USER_ID`

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

_How identity events reach the database._

- **Events handled:** TODO:
- **Verification:** signing secret
- **Retries:** idempotent by event ID

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
