---
title: Identity, Tenancy and Access
slug: identity-and-access
order: 6
summary: Clerk for identity, the application database for everything else; admission modes; the active organization; RBAC then ABAC; roles defined once; the audit log.
rules:
  [
    CC-ADMIN-001,
    CC-ADMIN-002,
    CC-AUDIT-001,
    CC-AUTH-001,
    CC-AUTH-002,
    CC-AUTH-003,
    CC-AUTH-004,
    CC-AUTHZ-001,
    CC-AUTHZ-002,
    CC-AUTHZ-003,
    CC-AUTHZ-004,
    CC-AUTHZ-005,
  ]
---

# Identity, Tenancy and Access

## The split

**Clerk owns identity and sessions. The application database owns tenancy**: users, organizations, memberships, roles, permissions and their history. Clerk Organizations, roles and public metadata are not used. Private metadata holds one convenience flag, `onboardingComplete`; the database row is the source of truth and redirects read the database, because a session token can lag.

Trust progression for every request:

```text
untrusted input → parsed (Zod) → authenticated (Clerk) → active user → active membership in the active organization
→ role permits the action (RBAC) → record rule permits this record (ABAC, when installed) → organization in the query predicate
→ RLS contains the statement → committed with its audit row → DTO
```

`<ClerkProvider dynamic>` wraps the `(auth)`, `(tenant)` and `(admin)` group layouts. It is not in the root layout: that would make every public page render per request (the nonce needs it) and ship Clerk's JavaScript to marketing pages.

## Authentication — `lib/auth/`

| File                     | Exports                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `clerk.ts`               | `getClerk()` — the backend client                                                               |
| `auth.ts`                | `getIdentity()`, `requireIdentity()`, `getCurrentSession()`, `requireAuthenticatedSession()`    |
| `redirects.ts`           | sign-in/up paths, `redirectForAccountState()` (reads DB status: onboarding, pending, suspended) |
| `active-organization.ts` | `readActiveOrganizationId()`, `setActiveOrganization()` (cookie)                                |

> **CC-AUTH-001** · `now` · `codependent/layer-boundaries`
> Authentication never decides access. `lib/auth` imports nothing from `lib/authz`, and `@clerk/*` server APIs are imported only in `lib/auth`.

> **CC-AUTH-002** · `now` · review
> Sign-in and sign-up are thin pages around Clerk's prebuilt components, styled through Clerk's appearance API with the app's tokens. Credentials are never handled by our code.

Clerk dashboard settings (tier `now`): email + password with email OTP verification, no username, no social providers; MFA available to all and **required for admin accounts**; new-device verification; user-enumeration protection; account lockout; bot sign-up protection; disposable-email blocking; breached-password check. Subaddress blocking off. "Remember this device" off. A shorter session lifetime for the admin surface (enforced in the admin layout and in admin actions by checking session age, CC-ADMIN-002).

> **CC-AUTH-003** · `now` · review
> Secret keys and webhook signing secrets never carry a `NEXT_PUBLIC_` prefix. Development, preview and production use separate Clerk instances; preview uses the development instance.

> **CC-AUTH-004** · `now` · review
> The Clerk webhook subscribes to `user.created`, `user.updated`, `user.deleted` only. `user.deleted` sets `status = DELETED` and anonymizes personal fields; it never deletes the row.

## Admission

The generator asks once and bakes the answer in (no runtime flag):

| Mode                 | New sign-up gets                                                                                                                                                                            | Fits                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `approval` (default) | `User(status: PENDING)`, no membership. Onboarding collects profile only, then the **pending** page. An admin approves: assigns organization, role and `ACTIVE` in one audited transaction. | Internal tools, operators, B2B with vetted customers |
| `self-serve`         | Onboarding creates an organization and an `OWNER` membership atomically.                                                                                                                    | Idea validation with strangers                       |
| `invite-only`        | Nothing until they accept an invitation; then the invited role.                                                                                                                             | Closed betas                                         |

In every mode the default is deny: no account receives a role in an organization someone else owns without an explicit approval or invitation.

Onboarding is a React Hook Form stepper in `(auth)/onboarding`. The action order is: authenticate → parse → write profile (and organization in `self-serve`) → set the Clerk `onboardingComplete` flag. The user ID always comes from the session, never from the form.

## The active organization

An httpOnly, `Secure`, `SameSite=Lax` cookie `active-org` holds an organization ID. It is a **preference**, not authority: the tenancy wrapper re-validates it against an `ACTIVE` membership on every request and falls back to the oldest active membership when it no longer matches. Switching organization is an action that validates membership before setting the cookie.

## Authorization — `lib/authz/`

| File             | Responsibility                                                                 |
| ---------------- | ------------------------------------------------------------------------------ |
| `roles.ts`       | the role tuple in rank order, derived from and checked against the Prisma enum |
| `permissions.ts` | the permission catalog and `assertPermission(access, "crm.contact:update")`    |
| `policies.ts`    | record rules (ABAC) — emitted only when the app chose ABAC                     |
| `resources.ts`   | base resources + each installed module's resources                             |
| `mode.ts`        | `tenancy` (`single` \| `multi`), validated at startup                          |

> **CC-AUTHZ-001** · `now` · `codependent/layer-boundaries`
> Authorization never reads Clerk and never writes data. It answers one question: may this access context perform this action on this thing?

> **CC-AUTHZ-002** · `now` · `codependent/no-role-literals`
> Role names are defined once. The Prisma `MembershipRole` enum is storage truth; `lib/authz/roles.ts` is the only code that lists them. No role string literal (`"ADMIN"`) appears in components, constants, content or hand-typed Zod enums.

```ts
// lib/authz/roles.ts — the one authz file without "server-only": role names are vocabulary, not secrets,
// and the admin role-change form's schema needs them in the browser.
import { MembershipRole } from "@/generated/prisma/enums";

/** Rank order, highest first. `satisfies` rejects unknown values; the type below rejects missing ones. */
export const appRoles = [
  MembershipRole.OWNER,
  MembershipRole.ADMIN,
  MembershipRole.MEMBER,
  MembershipRole.VIEWER,
] as const satisfies readonly MembershipRole[];

type Missing = Exclude<MembershipRole, (typeof appRoles)[number]>;
const _everyRoleIsRanked: [Missing] extends [never] ? true : never = true;

export type AppRole = (typeof appRoles)[number];
const privileged = new Set<AppRole>([
  MembershipRole.OWNER,
  MembershipRole.ADMIN,
]);

/** OWNER and ADMIN hold every permission in their organization. */
export function isPrivilegedRole(role: AppRole) {
  return privileged.has(role);
}

/** True when `role` ranks at or above `minimum`. */
export function hasRoleAtLeast(role: AppRole, minimum: AppRole) {
  return appRoles.indexOf(role) <= appRoles.indexOf(minimum);
}
```

Zod role schemas derive from the same tuple: `z.enum(appRoles)`. A client that needs to display role names receives them as DTO strings with labels from `content/`.

### Permissions

Strings of the form `<module>.<resource>:<action>`, actions `read | create | update | delete | manage`. Base resources: `base.organization`, `base.membership`, `base.settings`. Each module declares its resources and the grants for `MEMBER` and `VIEWER` in `lib/modules/<id>.module.ts`; `OWNER` and `ADMIN` hold everything.

> **CC-AUTHZ-003** · `now` · `codependent/permission-literal`
> Permission strings passed to `assertPermission` are literal types from the generated `Permission` union, so a typo is a compile error.

### Record rules (ABAC)

Added only when a real rule needs attributes, such as "viewers see only records shared with them or their own". Record rules belong **in the query predicate**, not after the fetch:

```ts
// lib/authz/policies.ts (ABAC only)
import "server-only";
import type { AccessContext } from "@/types/accessTypes";
import { MembershipRole } from "@/generated/prisma/enums";

/** Prisma where-fragment limiting outside viewers to shared or owned records. */
export function visibleRecordsWhere(access: AccessContext) {
  if (access.role !== MembershipRole.VIEWER) return {};
  return {
    OR: [
      { clientVisible: true },
      { ownerMembershipId: access.membershipId },
      { assigneeMembershipId: access.membershipId },
    ],
  };
}
```

> **CC-AUTHZ-004** · `now` · review
> Scope lives in the SQL-producing query. Never fetch broadly and filter in memory.

> **CC-AUTHZ-005** · `now` · review
> A record outside the caller's organization or visibility returns `NOT_FOUND`, never `FORBIDDEN`. Existence is not confirmed.

## Admin

> **CC-ADMIN-001** · `now` · review
> The `(admin)` layout check is UX. Every admin fetcher and action re-checks its own admin-only permission. Admin reports are the most sensitive reads in the system: each has its own permission, is paginated or streamed (never a full-table load), is rate-limited, and writes an audit row for every export.

> **CC-ADMIN-002** · `users` · review
> Approve, change role and suspend require step-up re-authentication (Clerk reverification) and MFA, and write to the audit log in the same transaction as the change.

The admin surface uses its own database role only when it needs cross-tenant reads (operator reports). That role is `app_admin`, `NOBYPASSRLS`, with policies that admit it by role name, so cross-tenant reach is an explicit grant and never an RLS bypass.

## Audit log

> **CC-AUDIT-001** · `now` · `tests/integration/rls`
> `AuditEvent` records every privileged action — approvals, suspensions, role and permission changes, organization lifecycle, billing state changes, admin exports — with actor, subject, action, before, after, organization, timestamp and request source. It is insert-only for every role, written in the same transaction as the change, never cascaded, never purged. Retention is set in the compliance review (tier `scale`).

The audit log is separate from the webhook inbox, which records provider deliveries and is purged of payload data after 30 days.
