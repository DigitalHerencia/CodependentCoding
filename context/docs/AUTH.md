---
title: Codependent Coding — Authentication, Authorization and Tenancy
doc: auth
status: active
updated: 2026-10-22
compiles_to: .claude/contracts/application.yaml (security), .claude/contracts/validation.yaml (security rules)
---

# Authentication, Authorization and Tenancy

Applies to the template and every generated app. The factory itself (landing page, CLI, plugin) has no auth: the landing page is static, the CLI and plugin run locally.

## 1. Principles

1. **Authentication establishes identity. Authorization decides access.** They are separate modules and separate function calls.
2. **Clerk owns identity and sessions. The application database owns tenancy**: users, organizations, memberships, roles, and permissions. Clerk Organizations and metadata are never the source of truth.
3. **Scope in the query.** Tenant and resource scope go into the persisted read/write predicate, not a post-fetch check.
4. **RLS is containment, not policy.** Postgres row-level security backs up application authorization; it never replaces it.
5. **Fresh decisions.** Authorization, membership, payment, and readiness are never decided from cache.
6. **Server-only secrets.** No secret reaches client bundles; `server-only` guards every server module (CC-SRV-001).

## 2. Trust progression

```text
authenticated (Clerk) → active tenant context → general permission granted (RBAC)
→ runtime-validated input (Zod) → resource/tenant policy satisfied (ABAC) → tenant-scoped query
→ RLS-contained write → committed → DTO (transport-safe)
```

## 3. Authentication — `lib/auth/`

| File                | Responsibility                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `clerk.ts`          | Clerk backend client instance                                                             |
| `auth.ts`           | `requireIdentity()` → `{ clerkUserId }`; verified Clerk identity, without database access |
| `redirects.ts`      | Sign-in/up/after-auth redirect targets                                                    |
| `clerk-webhooks.ts` | `verifyClerkWebhook(request)` using Clerk's webhook verification on the raw body          |

- `proxy.ts` uses `clerkMiddleware` to protect tenant/admin paths and `/api` (except webhooks). It only gates; it never reads the database.
- Development: Clerk keyless mode until keys are set; `doctor` warns when keys are missing.
- Clerk webhook (`app/api/clerk/webhooks/route.ts`): verify → idempotency check → `user.created|updated|deleted` sync through `lib/db/transactions/clerkUserTx.ts` → `200`.

## 4. Tenancy model (application-owned)

```prisma
model User {
  id          String   @id // Clerk user ID
  email       String?
  displayName String?
  profileCompletedAt DateTime?
  memberships Membership[]
}

model Organization {
  id          String   @id @default(uuid()) @db.Uuid
  name        String
  slug        String   @unique
  memberships Membership[]
  // module relations carry  // @module <id>  tags
}

model Membership {
  id             String           @id @default(uuid()) @db.Uuid
  userId         String
  organizationId String
  role           MembershipRole   @default(MEMBER)
  status         MembershipStatus @default(ACTIVE)
  @@unique([userId, organizationId])
}

enum MembershipRole   { OWNER ADMIN MEMBER VIEWER }
enum MembershipStatus { ACTIVE INVITED SUSPENDED REVOKED }
```

### 4.1 Active organization

- Stored in an httpOnly, `Secure`, `SameSite=Lax` cookie `active-org` holding the organization ID.
- **Every request re-validates** it against an active Membership. Invalid or missing → fall back to the user's first active membership → none → redirect `/onboarding`.
- Switching orgs is a server action (`switchOrganization`) that validates membership before setting the cookie. The cookie is read and written only in `lib/auth/activeOrganization.ts`; the tenant shell shows the switcher to users with two or more organizations.

### 4.2 Onboarding

`(setup)/onboarding` → form → `createOrganization` action → `onboarding.tx.ts` creates Organization + owner Membership atomically → sets `active-org` → redirect `/dashboard`.

### 4.3 Invitations and tenancy mode

- An owner or admin (`base.membership:create`) invites an email with a role (`admin`, `member` or `viewer`). The action returns a one-time link `/invite/<token>`; only the token's SHA-256 is stored in `Invitation.tokenHash`. Invitations expire after `INVITATION_TTL_DAYS` (`lib/constants/invitations.ts`) and can be revoked (`base.membership:delete`).
- Accepting (`invitation.tx.ts`) is one idempotent transaction: it sets the invitation's organization as RLS context, flips `pending → accepted`, creates the membership or reactivates a suspended one (an active membership keeps its role), and writes an audit event. The Clerk `user.created` webhook accepts a pending invitation to the user's email before anything else.
- RLS on `Invitation`: rows of the selected organization, plus invitations sent to the signed-in user's own email (read only). Writes stay inside the organization.
- `tenancy` in `lib/authz/mode.ts` (set by `hipster-stack new --tenancy`, Zod-validated when the module loads) is `multi` (each new user without an invitation gets their own organization) or `single` (the first user creates the one organization, slug `main`, and owns it; everyone else joins by invitation).

## 5. Authorization — `lib/authz/`

| File             | Responsibility                                                                       |
| ---------------- | ------------------------------------------------------------------------------------ |
| `roles.ts`       | Role hierarchy `owner > admin > member > viewer`                                     |
| `resources.ts`   | Base resources + module resources from `installedModules`                            |
| `permissions.ts` | RBAC: `assertPermission(ctx, "crm.contact:update")`, `hasPermission(...)`            |
| `policies.ts`    | ABAC: record rules after the role check (tenant, owner, assignee, requester, shared) |
| `attributes.ts`  | Only when a module needs ABAC attributes beyond the record's own                     |
| `mode.ts`        | `tenancy` (`multi` or `single`), baked in by the generator                           |

`hipster-stack new --access` bakes the choice into `policies.ts`; no code branches on it at runtime. `abac` (the default) keeps both checks below; `rbac` replaces `policies.ts` with one that keeps only the organization boundary, so the role check alone decides and viewers are not limited to shared or own records. The choice is recorded in `hipster.json`. RLS applies either way.

Every fetcher and action runs both checks in order: the role check (may this role do this action on this kind of resource?), then the record check (is this record in the caller's organization, and may this caller touch it?). `owner` and `admin` hold every permission. `member` is staff. `viewer` is for people outside the staff, such as clients: policies limit them to records shared with them (`clientVisible`) or their own (owner, assignee, requester).

Stored role values come from the Prisma-generated MembershipRole enum, consumed by `lib/authz/roles.ts`, the one `lib/authz` file without `server-only`: client companions and schemas may import it for role pickers and enums; every other `lib/authz` file stays server-only (CC-SRV-001, CC-FEAT-004, CC-SCHEMA-001). Other stored enum values also come from Prisma; Zod owns runtime input contracts.

### 5.1 Tenant context

```ts
type TenantContext = {
  user: { id: string; clerkUserId: string };
  organization: { id: string; slug: string };
  membership: { id: string; role: MembershipRole };
};
```

`requireTenant()` (in `lib/db/tenant.ts`): `requireIdentity()` → active-org cookie → Membership lookup → `TenantContext`. Fresh every request; never cached.

### 5.2 Permission strings

`<module>.<resource>:<action>` with actions `read | create | update | delete | manage`. Base resources: `base.organization`, `base.membership`, `base.settings`; billing adds `billing.subscription` when installed. Each module lists its `<module>.<resource>` names in `permissions.resources`; `permissions.grants` gives `member` and `viewer` actions (applied to every resource of the module) or single permissions.

### 5.3 Standard read and write paths

```text
Fetcher:  requireTenant → assertPermission(read) → withAuthenticatedRead(ctx, tx =>
          tx.model.findMany({ where: { organizationId: ctx.organization.id, ... }, select })) → toDTO

Action:   requireTenant → assertPermission(write) → schema.safeParse(input)
          → policy check → withTenantTransaction(ctx, tx => write / *.tx helper)
          → invalidate cache tags → ActionResult
```

## 6. Row-level security

- Every tenant-owned table has `organizationId` and RLS **enabled and forced**.
- Runtime connects as `app_runtime` (no `BYPASSRLS`); migrations run as `owner` via `DATABASE_URL_UNPOOLED`.
- `withTenantTransaction(ctx, fn)` / `withAuthenticatedRead(ctx, fn)` open an interactive transaction and run
  `select set_config('app.current_organization_id', $1, true)` before `fn`.
- Policy template (per table, in `prisma/rls/<owner>.sql`):

```sql
alter table "Contact" enable row level security;
alter table "Contact" force row level security;
create policy contact_tenant_isolation on "Contact"
  using ("organizationId" = current_setting('app.current_organization_id', true))
  with check ("organizationId" = current_setting('app.current_organization_id', true));
```

- Missing context → `current_setting(..., true)` is null → zero rows (fail closed).
- **Required test** (`pnpm test:rls`): two orgs, seeded rows, assert org A cannot read/update/delete org B rows through `app_runtime`, with and without application predicates.
- Omitting RLS from a tenant table requires a decision record.

## 7. Webhooks

Route handler lifecycle: raw body → provider signature verification → parse supported envelope → idempotency (`WebhookEvent` unique on `provider + eventId`) → for consequential events retrieve current provider state → persist via transaction helper/workflow → mark processed → `2xx`. Duplicates and out-of-order delivery are expected. Integrations verify and fetch; they never persist (CC-INT-001).

## 8. Errors and results

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: ErrorCode;
        message: string;
        fieldErrors?: Record<string, string[]>;
        ref?: string;
      };
    };

type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL";
```

- One mapper, `toActionResult` in `lib/utils/actionResult.ts`, builds every failure. Coded errors get a fixed client message per code; a thrown error's own message never reaches the client. Anything uncoded is `INTERNAL`, reported with `reportError` (`lib/observability/report.ts`), and carries that report's correlation `ref`.
- Fetchers return `null` for not-found and throw only on unexpected failure.
- Cross-tenant access returns `NOT_FOUND`, never `FORBIDDEN` (no existence leaks).
- `RATE_LIMITED` is backed by the optional Upstash configuration. AI generation skips limiting when both Upstash variables are unset. With either variable set, both are required and the limiter must respond before generation can start.

## 9. Secrets and configuration

- `lib/utils/env.ts` and provider-local `lib/integrations/<provider>/env.ts` validate lazily using `schemas/envSchemas.ts`; environment access is `server-only`.
- `.env.example` lists names and descriptions only; rebuilt by the CLI from base + module manifest entries.
- Public env vars must start with `NEXT_PUBLIC_` and be declared `scope: public` in the manifest.
- Never log tokens, secrets, raw webhook payloads, or full PII.

## 10. Audit

`AuditLog` (base) records privileged operations: membership role/status changes, organization deletion, bulk admin operations, billing state changes. Written inside the same transaction as the change.

## 11. Threat checklist (reviewer agent)

- [ ] Every action authenticates, authorizes, validates.
- [ ] Every tenant query includes `organizationId` in its predicate.
- [ ] No client file imports server modules; no secret in `NEXT_PUBLIC_*`.
- [ ] Webhooks verify the raw body and are idempotent.
- [ ] No provider calls inside transactions.
- [ ] Cross-tenant IDs yield `NOT_FOUND`.
- [ ] RLS policies exist for every new tenant table; `test:rls` covers it.

## Administrator and onboarding boundaries

The four route groups are (auth), (public), (tenant), and (admin). app/layout.tsx owns the document, metadata, fonts and ClerkProvider; app/page.tsx owns the public landing page. Group layouts compose their flat shells. Onboarding is inside (auth): a profile/review stepper saves only the display name, then shows the approval waiting area. An ACTIVE membership with an administrator-assigned role is required before any tenant read or write. Users never choose roles, permissions, organizations or teams during onboarding.

Admin pages live directly beneath (admin); rewrites preserve /admin URLs. The layout is a UX gate, with independently authorized fetchers/actions as the security boundary. Administrator reads require both authentication factors within ten minutes; sensitive writes and role-granting invitations require both within five minutes. Missing MFA never falls back to password-only authorization. Expired reads return to the verification route; Clerk reverification handles action challenges. Enabling MFA methods in Clerk remains an owner configuration step.

Membership administration uses soft suspension/restoration and atomic audit events with the affected identity and previous/next values. Clerk deletion anonymizes the retained user and suspends memberships. WebhookEvent remains a separate delivery ledger. Admin list reads apply validated search and bounded pagination in SQL, and detail reads retrieve only the requested identity. Tenant identity/RLS context remains on the protected transaction connection; no additional admin database URL is required by the supplied reference.

User IDs and their relationships use Clerk string identifiers. Organizations and memberships retain UUID identifiers. Source migration 20261104010000_clerk_identity_primary_key converts existing UUID relationships without discarding rows; it must be reviewed and applied by the owner before running this source against an older database.
