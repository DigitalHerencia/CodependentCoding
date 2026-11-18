/** Admin Fetchers contracts and composition for the owning application slice. */
import "server-only";

import {
  adminListCriteriaSchema,
  adminUserIdSchema,
} from "@/schemas/adminSchemas";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { isPrivilegedRole } from "@/lib/authz/roles";
import { toAdminMembershipDTO, toAuditEventDTO } from "@/lib/db/dtos/adminDtos";
import {
  adminMembershipSelect,
  auditEventSelect,
} from "@/lib/db/selects/adminSelects";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { installedModules } from "@/lib/modules/registry";

import type {
  AdminTenantCounter,
  AdminDashboardView,
  AdminActivityRecord,
} from "@/types/adminTypes";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/adminConstants";

/** Resolve the active organization and reject nonprivileged memberships. */
export async function canAccessAdmin() {
  return withAuthenticatedRead(
    async (_tx, access) =>
      isPrivilegedRole(access.role) &&
      hasPermission(access, "admin.membership:read") &&
      hasPermission(access, "admin.record:read") &&
      hasPermission(access, "admin.audit-event:read"),
  );
}

/** Aggregate fourteen UTC days in SQL; no unbounded audit rows cross the database boundary. */
export async function getAdminDashboardSummary(): Promise<AdminDashboardView> {
  return withAuthenticatedRead(async (tx, access) => {
    for (const permission of [
      "admin.membership:read",
      "admin.audit-event:read",
      "base.membership:read",
    ] as const)
      assertPermission(access, permission);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(today.getTime() - 13 * 86_400_000);
    const end = new Date(today.getTime() + 86_400_000);
    const where = { organizationId: access.organizationId };
    const [members, activeMembers, invitations, daily] = await Promise.all([
      tx.membership.count({ where }),
      tx.membership.count({ where: { ...where, status: "ACTIVE" } }),
      tx.invitation.count({
        where: { ...where, status: "PENDING", expiresAt: { gt: new Date() } },
      }),
      tx.$queryRaw<AdminActivityRecord[]>`
        SELECT to_char("createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS "date", COUNT(*)::int AS "count"
        FROM "AuditEvent"
        WHERE "organizationId" = ${access.organizationId}::uuid AND "createdAt" >= ${start} AND "createdAt" < ${end}
        GROUP BY 1 ORDER BY 1
      `,
    ]);
    const counts = new Map(daily.map((row) => [row.date, row.count]));
    const activity = Array.from({ length: 14 }, (_, day) => {
      const date = new Date(start.getTime() + day * 86_400_000)
        .toISOString()
        .slice(0, 10);
      return { date, count: counts.get(date) ?? 0 };
    });
    return {
      members,
      activeMembers,
      invitations,
      events: activity.reduce((total, row) => total + row.count, 0),
      activity,
    };
  });
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
