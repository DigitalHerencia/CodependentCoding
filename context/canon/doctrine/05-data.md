---
title: Data
slug: data
order: 5
summary: Neon and Prisma 7, database roles, row-level security done correctly, selects, DTOs, transactions and migrations.
rules:
  [
    CC-DB-001,
    CC-DB-002,
    CC-DB-003,
    CC-DB-004,
    CC-DB-005,
    CC-DTO-001,
    CC-MIG-001,
    CC-MIG-002,
    CC-RLS-001,
    CC-RLS-002,
    CC-RLS-003,
    CC-RLS-004,
    CC-RLS-005,
    CC-TX-001,
    CC-TX-002,
    CC-TX-003,
  ]
---

# Data

## Stack

Neon serverless Postgres, Prisma 7 with the mandatory driver adapter (`@prisma/adapter-neon`), client generated into `generated/prisma` and imported only from there. Multi-file schema in `prisma/schema/<owner>.prisma`.

## Database roles

Three roles. This is the foundation every other data rule stands on.

| Role                   | Used by                         | Attributes                                                                                  | Connection                       |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| owner (`neondb_owner`) | migrations, seed                | owns every table                                                                            | `DATABASE_URL_UNPOOLED` (direct) |
| `app_runtime`          | the application                 | `LOGIN NOBYPASSRLS`, not an owner, not a member of `neon_superuser`                         | `DATABASE_URL` (pooled)          |
| `app_system`           | webhook and cron route handlers | `LOGIN NOBYPASSRLS`, grants on system tables only (+ the tenant tables a reconciler writes) | `DATABASE_URL_SYSTEM` (pooled)   |

> **CC-DB-004** · `now` · `doctor`, `tests/integration/rls`
> The runtime role is created with SQL, never in the Neon Console, and `doctor` asserts `rolbypassrls = false`, `rolsuper = false`, no membership in `neon_superuser`, and that it owns no table.
> Roles created in the Neon Console, CLI or API are granted `neon_superuser`, which carries `BYPASSRLS`. A member can `SET ROLE` into it. A table owner can `ALTER TABLE … DISABLE ROW LEVEL SECURITY`. `FORCE ROW LEVEL SECURITY` stops neither.

```sql
-- prisma/migrations/<ts>_runtime_roles/migration.sql   (password set out of band)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_runtime') THEN
    CREATE ROLE app_runtime LOGIN NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END $$;
GRANT USAGE ON SCHEMA public TO app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_runtime;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
REVOKE UPDATE, DELETE ON "AuditEvent" FROM app_runtime;
```

The Neon–Vercel integration injects **owner** credentials as both `DATABASE_URL` and `DATABASE_URL_UNPOOLED`. Overwrite `DATABASE_URL` in each Vercel environment with the `app_runtime` pooled string.

## The client

```ts
// lib/db/client.ts
import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import { baseEnv } from "@/lib/env/base";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** The only PrismaClient. Never exported past lib/db (CC-DB-003). */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString: baseEnv().DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> **CC-DB-003** · `now` · `codependent/prisma-client-boundary`
> `prisma` from `lib/db/client` is imported only inside `lib/db`. Everything else receives a `Prisma.TransactionClient` from a wrapper.

> **CC-DB-002** · `now` · `codependent/no-raw-sql`
> Raw SQL appears only as tagged `$queryRaw`/`$executeRaw` inside `lib/db`. `$queryRawUnsafe` and `$executeRawUnsafe` are forbidden everywhere.

> **CC-DB-001** · `now` · `codependent/layer-boundaries`
> `lib/db` never imports from features, actions, workflows, fetchers or integrations. The data layer is a leaf.

## The wrappers

Two wrappers make the database unreachable without context. They nest: tenancy runs inside authentication.

```ts
// lib/db/rls.ts
import "server-only";
import type { Prisma } from "@/generated/prisma/client";

/** Sets transaction-local RLS context in one round trip; unset keys are empty strings (deny). */
export async function setRlsContext(
  tx: Prisma.TransactionClient,
  context: { clerkUserId: string; userId?: string; organizationId?: string },
) {
  await tx.$executeRaw`
    SELECT set_config('app.clerk_user_id', ${context.clerkUserId}, true),
           set_config('app.user_id', ${context.userId ?? ""}, true),
           set_config('app.organization_id', ${context.organizationId ?? ""}, true)`;
}
```

```ts
// lib/db/tenant.ts  (multi-tenant only)
import "server-only";
import { prisma } from "./client";
import { setRlsContext } from "./rls";
import { requireIdentity } from "@/lib/auth/auth";
import { readActiveOrganizationId } from "@/lib/auth/active-organization";
import { TenantContextError } from "@/lib/db/transactions/errors";
import type { AccessContext } from "@/types/accessTypes";
import type { Prisma } from "@/generated/prisma/client";

type TenantWork<T> = (
  tx: Prisma.TransactionClient,
  access: AccessContext,
) => Promise<T>;

/**
 * Resolves the caller's user and active membership inside the transaction, rejects
 * pending/suspended/org-less users, locks RLS to the organization, then runs `work`.
 */
export async function withTenantTransaction<T>(
  work: TenantWork<T>,
): Promise<T> {
  const identity = await requireIdentity();
  const preferredOrganizationId = await readActiveOrganizationId();

  return prisma.$transaction(
    async (tx) => {
      // 1. Only the caller's own User row is visible (policy on "clerkUserId").
      await setRlsContext(tx, { clerkUserId: identity.clerkUserId });
      const user = await tx.user.findUnique({
        where: { clerkUserId: identity.clerkUserId },
        select: { id: true, status: true },
      });
      if (!user || user.status !== "ACTIVE") throw new TenantContextError();

      // 2. Only the caller's own memberships are visible (policy on "userId").
      await setRlsContext(tx, {
        clerkUserId: identity.clerkUserId,
        userId: user.id,
      });
      const membership = await tx.membership.findFirst({
        where: {
          userId: user.id,
          status: "ACTIVE",
          ...(preferredOrganizationId
            ? { organizationId: preferredOrganizationId }
            : {}),
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, organizationId: true, role: true },
      });
      if (!membership) throw new TenantContextError();

      // 3. Lock every tenant table to this organization for the rest of the transaction.
      await setRlsContext(tx, {
        clerkUserId: identity.clerkUserId,
        userId: user.id,
        organizationId: membership.organizationId,
      });
      return work(tx, {
        userId: user.id,
        organizationId: membership.organizationId,
        membershipId: membership.id,
        role: membership.role,
      });
    },
    { maxWait: 5_000, timeout: 15_000 },
  );
}

/** Reads use the same boundary; fetchers never call write methods (CC-READ-002). */
export const withTenantRead = withTenantTransaction;
```

The application `User.id` is its own UUID; `clerkUserId` is a unique column (ledger I-7). Context is widened in three steps so each lookup can see only what it needs. When the `active-org` cookie names an organization the user no longer belongs to, the lookup falls back to their oldest active membership; when there is none, the wrapper throws and the layout redirects to onboarding or the pending page.

Why wrappers and not a Prisma client extension: the extension pattern wraps every query in its own batch transaction, which breaks interactive transactions and doubles round trips. A wrapper sets context once per request-scoped transaction, and lint guarantees the raw client cannot be reached around it.

## Row-level security

> **CC-RLS-001** · `now` · `tests/integration/rls`, `doctor`
> Every table has RLS **enabled and forced**. A table without policies denies everything (default-deny).

> **CC-RLS-002** · `now` · `scripts/check-rls-sql.mjs`
> Policies compare the **column** to a **cast setting** wrapped in a scalar sub-select. Never cast the column.

```sql
-- prisma/rls/crm.sql
ALTER TABLE "CrmContact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CrmContact" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "CrmContact";
CREATE POLICY tenant_isolation ON "CrmContact"
  FOR ALL TO app_runtime
  USING      ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid))
  WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
```

Why each piece:

- `NULLIF(…, '')` turns "not set" into `NULL`, and `x = NULL` is never true: missing context returns zero rows (fail closed).
- `::uuid` on the **setting** keeps the predicate sargable. `"organizationId"::text = …` casts every row's column and makes the `(organizationId, …)` index useless — a sequential scan on every tenant query.
- `(SELECT …)` makes Postgres evaluate the setting once per statement (an InitPlan) instead of once per row.
- `TO app_runtime` scopes the policy to the role that needs it; any other role is denied by default.

> **CC-RLS-003** · `now` · `scripts/check-rls-sql.mjs`
> Every column referenced in a policy is the leading column of an index.

> **CC-RLS-004** · `now` · review + `tests/integration/rls`
> RLS is containment, not policy. Application code still puts `organizationId` in every predicate; RLS catches the query that forgot.

> **CC-RLS-005** · `now` · `tests/integration/rls`
> The cross-tenant suite runs against real Postgres as `app_runtime`: two organizations, seeded rows, and for every tenant table, organization A cannot select, update or delete organization B's rows — with and without the application predicate — and a transaction with no context sees zero rows.

### Insert-only audit

```sql
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_insert ON "AuditEvent" FOR INSERT TO app_runtime
  WITH CHECK ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
CREATE POLICY audit_read ON "AuditEvent" FOR SELECT TO app_runtime
  USING ("organizationId" = (SELECT NULLIF(current_setting('app.organization_id', true), '')::uuid));
-- no UPDATE or DELETE policy; grants revoked in the roles migration
```

The `Organization` relation is `onDelete: Restrict`. Organizations are soft-deleted; their audit trail is never cascaded away.

## Selects and DTOs

```ts
// lib/db/selects/crm.selects.ts
import type { Prisma } from "@/generated/prisma/client";
export const crmContactDetailSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  status: true,
  version: true,
  updatedAt: true,
  account: { select: { id: true, name: true } },
} satisfies Prisma.CrmContactSelect;

// lib/db/dto/crm.dto.ts
import type { Prisma } from "@/generated/prisma/client";
import type { CrmContactDTO } from "@/types/crmTypes";
import type { crmContactDetailSelect } from "../selects/crm.selects";

type Row = Prisma.CrmContactGetPayload<{
  select: typeof crmContactDetailSelect;
}>;

/** The allowlist of contact fields that may leave the server. */
export function toCrmContactDTO(row: Row): CrmContactDTO {
  return {
    id: row.id,
    name: `${row.firstName} ${row.lastName}`.trim(),
    email: row.email,
    status: row.status,
    version: row.version,
    updatedAt: row.updatedAt.toISOString(),
    account: row.account
      ? { id: row.account.id, name: row.account.name }
      : null,
  };
}
```

> **CC-DB-005** · `now` · `codependent/require-select`
> Every Prisma read in a fetcher or action passes a `select` from `lib/db/selects`. No `include`, no bare `findMany()`.
> A select is a column allowlist; an include returns whatever the schema grows into.

> **CC-DTO-001** · `now` · review
> DTOs are plain JSON (strings for dates and decimals). Types are derived from the select (`GetPayload`), never hand-copied.

## Transactions

> **CC-TX-001** · `now` · `codependent/layer-boundaries`
> Transaction helpers receive a `Prisma.TransactionClient` and trusted, already-authorized input. They import no auth, no integration, no SDK.

> **CC-TX-002** · `now` · `codependent/no-transaction-network`
> No network I/O inside a transaction.

> **CC-TX-003** · `now` · review
> Any write that can be retried carries an idempotency key or a natural unique constraint; any update to a user-editable row checks a `version` column (optimistic concurrency).

```ts
// lib/db/transactions/crm-update-deal-stage.tx.ts
import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { ConflictError, NotFoundError } from "./errors";
import { crmDealSelect } from "../selects/crm.selects";

/** Moves a deal to a new stage if the caller saw the current version; writes the audit row in the same commit. */
export async function updateCrmDealStageTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    dealId: string;
    stage: "QUALIFIED" | "WON" | "LOST";
    expectedVersion: number;
  },
) {
  const { count } = await tx.crmDeal.updateMany({
    where: {
      id: input.dealId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
    },
    data: {
      stage: input.stage,
      version: { increment: 1 },
      closedAt: input.stage === "QUALIFIED" ? null : new Date(),
    },
  });
  if (count !== 1) {
    const exists = await tx.crmDeal.count({
      where: { id: input.dealId, organizationId: input.organizationId },
    });
    throw exists ? new ConflictError("Deal") : new NotFoundError("Deal");
  }
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "crm.deal.stage_changed",
      resourceType: "CrmDeal",
      resourceId: input.dealId,
      metadata: { stage: input.stage },
    },
  });
  return tx.crmDeal.findUniqueOrThrow({
    where: { id: input.dealId },
    select: crmDealSelect,
  });
}
```

## Migrations

> **CC-MIG-001** · `now` · CI
> Schema and policy changes ship as migration files. `prisma/rls/<owner>.sql` is the readable source; `pnpm db:rls` writes it into a new migration. CI compares `pg_policies` on the test branch with the source and fails on drift. No SQL is applied outside migration history.

> **CC-MIG-002** · `now` · Vercel build script
> `prisma generate` runs in `build`. `prisma migrate deploy` is a deliberate production step (a release job or a manual command), never an automatic side effect of a preview build. Preview branches are migrated by the Neon branch workflow.

## Soft delete

User and organization rows are never hard-deleted. `status` columns (`PENDING | ACTIVE | INACTIVE | SUSPENDED | DELETED`) gate access in the tenancy wrapper. Erasure requests anonymize personal fields in place; audit rows keep their foreign keys.
