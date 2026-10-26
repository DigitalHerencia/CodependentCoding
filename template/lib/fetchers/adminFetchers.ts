import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO, toAuditEventDTO } from "@/lib/db/dto/admin.dto";
import {
  adminMembershipSelect,
  auditEventSelect,
} from "@/lib/db/selects/admin.selects";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import { installedModules } from "@/lib/modules/registry";

/** Every `records` model is a tenant table, so each delegate takes this count. */
interface TenantCounter {
  count(args: { where: { organizationId: string } }): Promise<number>;
}

export async function getAuditEvents(limit = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.audit-event:read");

    const rows = await tx.auditEvent.findMany({
      where: {
        organizationId: access.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(Math.max(limit, 1), 250),
      select: auditEventSelect,
    });

    return rows.map(toAuditEventDTO);
  });
}

export async function getAdminMemberships() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.membership:read");
    const rows = await tx.membership.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { createdAt: "asc" },
      select: adminMembershipSelect,
    });
    return rows.map(toAdminMembershipDTO);
  });
}

/** Counts the tables installed modules list in `records` (registry order). */
export async function getAdminRecordSummary() {
  const records = installedModules.flatMap(({ records }) => records ?? []);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin.record:read");
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
