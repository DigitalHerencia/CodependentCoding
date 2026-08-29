import "server-only";

import {
  contactIdSchema,
  contactListCriteriaSchema,
} from "../../schemas/crmSchemas";
import { assertPermission } from "../authz/permissions";
import {
  toCrmAccountDTO,
  toCrmContactDTO,
  toCrmDealDTO,
  toCrmDealSummaryDTO,
} from "../db/dto/crmDto";
import {
  crmAccountSelect,
  crmContactSelect,
  crmDealDetailSelect,
  crmDealSummarySelect,
} from "../db/selects/crmSelects";
import { withTemplateReadTransaction } from "../db/tenant";

export async function getCrmDeals(limit = 50) {
  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "crm:read");

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

export async function getCrmDeal(dealId: string) {
  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "crm:read");

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

export async function getContacts(rawCriteria: unknown = {}) {
  const criteria = contactListCriteriaSchema.parse(rawCriteria);

  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "crm:read");

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
  const contactId = contactIdSchema.parse(rawContactId);

  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "crm:read");
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

export async function getCrmAccount(accountId: string) {
  return withTemplateReadTransaction(async (tx, access) => {
    assertPermission(access, "crm:read");
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
