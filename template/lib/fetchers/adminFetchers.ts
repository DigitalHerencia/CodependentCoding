import "server-only";

import { redirect } from "next/navigation";
import {
  adminListCriteriaSchema,
  adminUserIdSchema,
} from "@/schema/adminSchemas";
import {
  requireFreshAdminSession,
  AdminReverificationRequiredError,
} from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { isPrivilegedRole } from "@/lib/authz/roles";
import { toAdminMembershipDTO, toAuditEventDTO } from "@/lib/db/dtos/adminDtos";
import {
  adminMembershipSelect,
  auditEventSelect,
} from "@/lib/db/selects/adminSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import { installedModules } from "@/lib/modules/registry";

/** Every `records` model is a tenant table, so each delegate takes this count. */
type TenantCounter = {
  count(args: { where: { organizationId: string } }): Promise<number>;
};

export async function canAccessAdmin() {
  return withAuthenticatedRead(async (_tx, access) =>
    isPrivilegedRole(access.role),
  );
}

export async function getAuditEvents(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.audit-event:read");
    await requireAdminReadSession();

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
      skip: (page - 1) * 50,
      take: 51,
      select: auditEventSelect,
    });

    return {
      items: rows.slice(0, 50).map(toAuditEventDTO),
      page,
      query,
      hasMore: rows.length > 50,
    };
  });
}

export async function getAdminMemberships(rawCriteria: unknown = {}) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.membership:read");
    await requireAdminReadSession();
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
      skip: (page - 1) * 50,
      take: 51,
      select: adminMembershipSelect,
    });
    return {
      items: rows.slice(0, 50).map(toAdminMembershipDTO),
      page,
      query,
      hasMore: rows.length > 50,
    };
  });
}

/** Counts the tables installed modules list in `records` (registry order). */
export async function getAdminRecordSummary() {
  const records = installedModules.flatMap(({ records }) => records ?? []);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.record:read");
    await requireAdminReadSession();
    const where = { organizationId: access.organizationId };
    const counts = await Promise.all(
      records.map(({ model }) =>
        (tx[model] as unknown as TenantCounter).count({ where }),
      ),
    );
    return records.map(({ label }, index) => ({
      resource: label,
      count: counts[index] ?? 0,
    }));
  });
}

async function requireAdminReadSession() {
  try {
    await requireFreshAdminSession();
  } catch (cause) {
    if (cause instanceof AdminReverificationRequiredError)
      redirect("/admin/verification");
    throw cause;
  }
}
export async function getAdminMembership(rawUserId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.membership:read");
    await requireAdminReadSession();
    const userId = adminUserIdSchema.parse(rawUserId);
    const row = await tx.membership.findFirst({
      where: { organizationId: access.organizationId, userId },
      select: adminMembershipSelect,
    });
    return row ? toAdminMembershipDTO(row) : null;
  });
}
