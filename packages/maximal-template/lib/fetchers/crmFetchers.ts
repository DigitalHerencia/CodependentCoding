import {
  persistedReadLimitSchema,
  persistedDateRangeSchema,
  persistedRecordIdSchema,
} from "@/schema/commonSchemas";
import "server-only";

import {
  contactIdSchema,
  dealIdSchema,
  contactListCriteriaSchema,
} from "@/schema/crmSchemas";
import { assertPermission } from "@/lib/authz/permissions";
import {
  toCrmAccountDTO,
  toCrmContactDTO,
  toCrmDealDTO,
  toCrmDealSummaryDTO,
} from "@/lib/db/dtos/crmDtos";
import {
  crmAccountSelect,
  crmContactSelect,
  crmDealDetailSelect,
  crmDealSummarySelect,
} from "@/lib/db/selects/crmSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getCrmDeals(rawLimit: unknown = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

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

export async function getClosedWonCrmValue(
  rawPeriodStart: unknown,
  rawPeriodEnd: unknown,
) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.deal:read");
    const { periodStart, periodEnd } = persistedDateRangeSchema.parse({
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

export async function getCrmAccount(rawAccountId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.account:read");
    const accountId = persistedRecordIdSchema.parse(rawAccountId);
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

export async function getCrmAccounts(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "crm.account:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.crmAccount.findMany({
      where: { organizationId: access.organizationId, archivedAt: null },
      orderBy: { name: "asc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: crmAccountSelect,
    });
    return rows.map(toCrmAccountDTO);
  });
}
