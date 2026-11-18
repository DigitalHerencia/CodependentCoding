/** Admin Fetchers contracts and composition for the owning application slice. */
import "server-only";

import {
  adminListCriteriaSchema,
  adminUserIdSchema,
} from "@/schemas/adminSchemas";
import { assertPermission } from "@/lib/authz/permissions";
import { isPrivilegedRole } from "@/lib/authz/roles";
import { toAdminMembershipDTO, toAuditEventDTO } from "@/lib/db/dtos/adminDtos";
import {
  adminMembershipSelect,
  auditEventSelect,
} from "@/lib/db/selects/adminSelects";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { installedModules } from "@/lib/modules/registry";

import type { AdminTenantCounter } from "@/types/adminTypes";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/adminConstants";

/** Resolve the active organization and reject nonprivileged memberships. */
export async function canAccessAdmin() {
  return withAuthenticatedRead(async (_tx, access) =>
    isPrivilegedRole(access.role),
  );
}

/** Read one authorized audit page under tenant RLS. */
export async function getAuditEvents(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.audit-event:read");

    const { page, query } = adminListCriteriaSchema.parse(rawCriteria);
    const rows = await tx.auditEvent.findMany({
      where: {
        organizationId: access.organizationId,
        ...(query
          ? {
              OR: [
                { action: { contains: query, mode: "insensitive" as const } },
                {
                  resourceType: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  actor: {
                    displayName: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE + 1,
      select: auditEventSelect,
    });

    return {
      items: rows.slice(0, ADMIN_PAGE_SIZE).map(toAuditEventDTO),
      page,
      query,
      hasMore: rows.length > ADMIN_PAGE_SIZE,
    };
  });
}

/** Read one authorized membership page under tenant RLS. */
export async function getAdminMemberships(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.membership:read");
    const { page, query } = adminListCriteriaSchema.parse(rawCriteria);
    const rows = await tx.membership.findMany({
      where: {
        organizationId: access.organizationId,
        ...(query
          ? {
              user: {
                OR: [
                  {
                    displayName: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                  { email: { contains: query, mode: "insensitive" as const } },
                ],
              },
            }
          : {}),
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE + 1,
      select: adminMembershipSelect,
    });
    return {
      items: rows
        .slice(0, ADMIN_PAGE_SIZE)
        .map((row) => toAdminMembershipDTO(row, access.userId)),
      page,
      query,
      hasMore: rows.length > ADMIN_PAGE_SIZE,
    };
  });
}

/** Counts the tables installed modules list in `records` (registry order). */
export async function getAdminRecordSummary() {
  const records = [
    ...new Map(
      installedModules
        .flatMap(({ records }) => records ?? [])
        .map((entry) => [entry.model, entry]),
    ).values(),
  ];
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.record:read");
    const where = { organizationId: access.organizationId };
    const counts = await Promise.all(
      records.map(({ model }) =>
        (tx[model] as unknown as AdminTenantCounter).count({ where }),
      ),
    );
    return records.map(({ label, model }, index) => {
      const count = counts[index];
      if (count === undefined)
        throw new Error("Missing registered resource count.");
      return { id: model, resource: label, count };
    });
  });
}

/** Find a member only in the server-selected active organization. */
export async function getAdminMembership(rawUserId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.membership:read");
    const userId = adminUserIdSchema.parse(rawUserId);
    const row = await tx.membership.findFirst({
      where: { organizationId: access.organizationId, userId },
      select: adminMembershipSelect,
    });
    return row ? toAdminMembershipDTO(row, access.userId) : null;
  });
}
