import type { Prisma } from "@/generated/prisma/client";
import "server-only";

import {
  contactIdSchema,
  dealIdSchema,
  contactListCriteriaSchema,
  crmAccountQuerySchema,
  crmContactQuerySchema,
  crmDealQuerySchema,
  crmPeriodSchema,
  crmReadLimitSchema,
  crmRecordIdSchema,
} from "@/schemas/crmSchemas";
import { assertPermission } from "@/lib/authz/permissions";
import {
  toCrmAccountDTO,
  toCrmContactDTO,
  toCrmDealDTO,
  toCrmDealSummaryDTO,
} from "@/lib/db/dtos/crmDtos";
import {
  crmAccountSelect,
  selectCrmDealAnalyticsTotals,
  crmContactSelect,
  crmDealDetailSelect,
  crmDealSummarySelect,
} from "@/lib/db/selects/crmSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

// -----------------------------------------------------------------------------
// CRM opportunity reads
// -----------------------------------------------------------------------------

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getCrmDeals(rawLimit: unknown = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const limit = crmReadLimitSchema.parse(rawLimit);

    const rows = await tx.crmDeal.findMany({
      where: {
        organizationId: access.organizationId,
        archivedAt: null,
      },
      orderBy: [
        {
          stage: "asc",
        },
        {
          expectedCloseDate: "asc",
        },
      ],
      take: Math.min(Math.max(limit, 1), 100),
      select: crmDealSummarySelect,
    });

    return rows.map(toCrmDealSummaryDTO);
  });
}

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getCrmDeal(rawDealId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const dealId = dealIdSchema.parse(rawDealId);

    const record = await tx.crmDeal.findFirst({
      where: {
        id: dealId,
        organizationId: access.organizationId,
        archivedAt: null,
      },
      select: crmDealDetailSelect,
    });

    return record ? toCrmDealDTO(record) : null;
  });
}

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getClosedWonCrmValue(
  rawPeriodStart: unknown,
  rawPeriodEnd: unknown,
) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const { periodStart, periodEnd } = crmPeriodSchema.parse({
      periodStart: rawPeriodStart,
      periodEnd: rawPeriodEnd,
    });

    const result = await tx.crmDeal.aggregate({
      where: {
        organizationId: access.organizationId,
        archivedAt: null,
        stage: "WON",
        closedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _sum: { value: true },
    });

    return result._sum.value?.toString() ?? "0";
  });
}

// -----------------------------------------------------------------------------
// CRM contact reads
// -----------------------------------------------------------------------------

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getContacts(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.contact:read");
    const criteria = contactListCriteriaSchema.parse(rawCriteria);

    const orderBy =
      criteria.sort === "updated-desc"
        ? [{ updatedAt: "desc" as const }, { id: "asc" as const }]
        : criteria.sort === "name-desc"
          ? [
              { lastName: "desc" as const },
              { firstName: "desc" as const },
              { id: "asc" as const },
            ]
          : [
              { lastName: "asc" as const },
              { firstName: "asc" as const },
              { id: "asc" as const },
            ];

    const rows = await tx.crmContact.findMany({
      where: {
        organizationId: access.organizationId,
        archivedAt: null,
        ...(criteria.status ? { status: criteria.status } : {}),
        ...(criteria.query
          ? {
              OR: [
                {
                  firstName: {
                    contains: criteria.query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  lastName: {
                    contains: criteria.query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  email: {
                    contains: criteria.query,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      },
      orderBy,
      take: criteria.limit,
      select: crmContactSelect,
    });
    return rows.map(toCrmContactDTO);
  });
}

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getContactById(rawContactId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.contact:read");
    const contactId = contactIdSchema.parse(rawContactId);
    const row = await tx.crmContact.findFirst({
      where: {
        id: contactId,
        organizationId: access.organizationId,
        archivedAt: null,
      },
      select: crmContactSelect,
    });
    return row ? toCrmContactDTO(row) : null;
  });
}

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getCrmAccount(rawAccountId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.account:read");
    const accountId = crmRecordIdSchema.parse(rawAccountId);
    const row = await tx.crmAccount.findFirst({
      where: {
        id: accountId,
        organizationId: access.organizationId,
        archivedAt: null,
      },
      select: crmAccountSelect,
    });
    return row ? toCrmAccountDTO(row) : null;
  });
}

/** Read CRM records through authenticated, authorized, tenant-scoped persistence. */
export async function getCrmAccounts(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.account:read");
    const limit = crmReadLimitSchema.parse(rawLimit);
    const rows = await tx.crmAccount.findMany({
      where: { organizationId: access.organizationId, archivedAt: null },
      orderBy: { name: "asc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: crmAccountSelect,
    });
    return rows.map(toCrmAccountDTO);
  });
}

// -----------------------------------------------------------------------------
// CRM tenant-scoped server pagination and complete analytics.
// -----------------------------------------------------------------------------
/** Build stable page metadata without exposing raw database cursors. */
function crmPageInfo(page: number, pageSize: number, total: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    hasNext: page * pageSize < total,
    hasPrevious: page > 1,
  };
}

// -----------------------------------------------------------------------------
// CRM paginated account reads
// -----------------------------------------------------------------------------

/** Database-filtered accounts, with deterministic paging before limiting rows. */
export async function getCrmAccountsPage(rawCriteria: unknown = {}) {
  const criteria = crmAccountQuerySchema.parse(rawCriteria);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.account:read");
    const where: Prisma.CrmAccountWhereInput = {
      organizationId: access.organizationId,
      archivedAt: null,
      ...(criteria.status ? { status: criteria.status } : {}),
      ...(criteria.q ? {
        OR: [
          { name: { contains: criteria.q, mode: "insensitive" } },
          { industry: { contains: criteria.q, mode: "insensitive" } },
          { website: { contains: criteria.q, mode: "insensitive" } },
        ],
      } : {}),
    };
    const orderBy: Prisma.CrmAccountOrderByWithRelationInput[] =
      criteria.sort === "updated-desc"
        ? [{ updatedAt: "desc" }, { id: "asc" }]
        : criteria.sort === "name-desc"
          ? [{ name: "desc" }, { id: "asc" }]
          : [{ name: "asc" }, { id: "asc" }];
    const [total, rows] = await Promise.all([
      tx.crmAccount.count({ where }),
      tx.crmAccount.findMany({
        where, orderBy,
        skip: (criteria.page - 1) * criteria.pageSize,
        take: criteria.pageSize,
        select: crmAccountSelect,
      }),
    ]);
    return {
      items: rows.map(toCrmAccountDTO),
      pageInfo: crmPageInfo(criteria.page, criteria.pageSize, total),
      criteria,
    };
  });
}

// -----------------------------------------------------------------------------
// CRM paginated contact reads
// -----------------------------------------------------------------------------

/** Database-filtered contacts including linked account names, RLS scoped. */
export async function getCrmContactsPage(rawCriteria: unknown = {}) {
  const criteria = crmContactQuerySchema.parse(rawCriteria);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.contact:read");
    const where: Prisma.CrmContactWhereInput = {
      organizationId: access.organizationId,
      archivedAt: null,
      ...(criteria.status ? { status: criteria.status } : {}),
      ...(criteria.q ? {
        OR: [
          { firstName: { contains: criteria.q, mode: "insensitive" } },
          { lastName: { contains: criteria.q, mode: "insensitive" } },
          { email: { contains: criteria.q, mode: "insensitive" } },
          { account: { name: { contains: criteria.q, mode: "insensitive" } } },
        ],
      } : {}),
    };
    const orderBy: Prisma.CrmContactOrderByWithRelationInput[] =
      criteria.sort === "updated-desc"
        ? [{ updatedAt: "desc" }, { id: "asc" }]
        : criteria.sort === "name-desc"
          ? [{ lastName: "desc" }, { firstName: "desc" }, { id: "asc" }]
          : [{ lastName: "asc" }, { firstName: "asc" }, { id: "asc" }];
    const [total, rows] = await Promise.all([
      tx.crmContact.count({ where }),
      tx.crmContact.findMany({
        where, orderBy,
        skip: (criteria.page - 1) * criteria.pageSize,
        take: criteria.pageSize,
        select: crmContactSelect,
      }),
    ]);
    return {
      items: rows.map(toCrmContactDTO),
      pageInfo: crmPageInfo(criteria.page, criteria.pageSize, total),
      criteria,
    };
  });
}

// -----------------------------------------------------------------------------
// CRM paginated opportunity reads
// -----------------------------------------------------------------------------

/** Database-filtered pipeline deals with stable ordering and paginated DTOs. */
export async function getCrmDealsPage(rawCriteria: unknown = {}) {
  const criteria = crmDealQuerySchema.parse(rawCriteria);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const where: Prisma.CrmDealWhereInput = {
      organizationId: access.organizationId,
      archivedAt: null,
      ...(criteria.stage ? { stage: criteria.stage } : {}),
      ...(criteria.q ? {
        OR: [
          { name: { contains: criteria.q, mode: "insensitive" } },
          { account: { name: { contains: criteria.q, mode: "insensitive" } } },
          { owner: { user: { displayName: { contains: criteria.q, mode: "insensitive" } } } },
        ],
      } : {}),
    };
    const orderBy: Prisma.CrmDealOrderByWithRelationInput[] =
      criteria.sort === "updated-desc"
        ? [{ updatedAt: "desc" }, { id: "asc" }]
        : criteria.sort === "value-desc"
          ? [{ value: "desc" }, { id: "asc" }]
          : [{ stage: "asc" }, { expectedCloseDate: "asc" }, { id: "asc" }];
    const [total, rows] = await Promise.all([
      tx.crmDeal.count({ where }),
      tx.crmDeal.findMany({
        where, orderBy,
        skip: (criteria.page - 1) * criteria.pageSize,
        take: criteria.pageSize,
        select: crmDealSummarySelect,
      }),
    ]);
    return {
      items: rows.map(toCrmDealSummaryDTO),
      pageInfo: crmPageInfo(criteria.page, criteria.pageSize, total),
      criteria,
    };
  });
}

/**
 * Aggregate every active CRM deal by currency and stage inside the
 * authenticated RLS transaction. A parameterized SQL aggregate avoids
 * loading the full tenant pipeline into server memory.
 */
export async function getCrmDealAnalytics() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const rows = await selectCrmDealAnalyticsTotals(tx, access.organizationId);
    return rows;
  });
}
