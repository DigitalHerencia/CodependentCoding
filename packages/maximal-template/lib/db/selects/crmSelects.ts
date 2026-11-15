import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Define the minimum Prisma selection contract for CRM persistence. */
export const crmDealSummarySelect = {
  id: true,
  name: true,
  stage: true,
  value: true,
  currency: true,
  probability: true,
  expectedCloseDate: true,
  version: true,
  account: {
    select: {
      id: true,
      name: true,
    },
  },
  owner: {
    select: {
      id: true,
      user: {
        select: {
          displayName: true,
        },
      },
    },
  },
} satisfies Prisma.CrmDealSelect;

/** Define the minimum Prisma selection contract for CRM persistence. */
export const crmDealDetailSelect = {
  ...crmDealSummarySelect,
  closedAt: true,
  createdAt: true,
  updatedAt: true,
  primaryContact: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.CrmDealSelect;

/** Define the minimum Prisma selection contract for CRM persistence. */
export type CrmDealSummaryRecord = Prisma.CrmDealGetPayload<{
  select: typeof crmDealSummarySelect;
}>;

/** Define the minimum Prisma selection contract for CRM persistence. */
export type CrmDealDetailRecord = Prisma.CrmDealGetPayload<{
  select: typeof crmDealDetailSelect;
}>;

/** Define the minimum Prisma selection contract for CRM persistence. */
export const crmContactSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  title: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  account: { select: { id: true, name: true } },
  owner: {
    select: {
      id: true,
      user: { select: { displayName: true } },
    },
  },
} satisfies Prisma.CrmContactSelect;

/** Define the minimum Prisma selection contract for CRM persistence. */
export const crmContactAccessSelect = {
  id: true,
  organizationId: true,
  ownerMembershipId: true,
  updatedAt: true,
  status: true,
} satisfies Prisma.CrmContactSelect;

/** Define the minimum Prisma selection contract for CRM persistence. */
export const crmAccountSelect = {
  id: true,
  name: true,
  website: true,
  industry: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      contacts: { where: { archivedAt: null } },
      deals: { where: { archivedAt: null } },
    },
  },
} satisfies Prisma.CrmAccountSelect;

/** Define the minimum Prisma selection contract for CRM persistence. */
export type CrmContactRecord = Prisma.CrmContactGetPayload<{
  select: typeof crmContactSelect;
}>;

/** Define the minimum Prisma selection contract for CRM persistence. */
export type CrmAccountRecord = Prisma.CrmAccountGetPayload<{
  select: typeof crmAccountSelect;
}>;

// -----------------------------------------------------------------------------
// CRM tenant-scoped analytical select
// -----------------------------------------------------------------------------
/**
 * Calculate all current tenant CRM opportunity totals in the RLS transaction.
 *
 * @param tx Existing authorized, tenant-scoped Prisma transaction.
 * @param organizationId Active organization resolved from authenticated context.
 * @returns Aggregated decimal values by stage and currency.
 */
export async function selectCrmDealAnalyticsTotals(
  tx: Prisma.TransactionClient,
  organizationId: string,
): Promise<Array<{
  currency: string;
  stage: string;
  count: number;
  value: string;
  weighted: string;
}>> {
    const rows = await tx.$queryRaw<Array<{
      currency: string;
      stage: string;
      count: number;
      value: string;
      weighted: string;
    }>>`
      SELECT "currency"::text AS currency,
             "stage"::text AS stage,
             COUNT(*)::integer AS count,
             COALESCE(SUM("value"), 0)::text AS value,
             COALESCE(SUM("value" * "probability" / 100), 0)::text AS weighted
      FROM "CrmDeal"
      WHERE "organizationId" = ${organizationId}::uuid
        AND "archivedAt" IS NULL
      GROUP BY "currency", "stage"
      ORDER BY "currency" ASC, "stage" ASC
    `;
    return rows;
}
