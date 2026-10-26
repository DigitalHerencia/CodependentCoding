import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import { toOrganizationDTO } from "@/lib/db/dto/organization.dto";
import { organizationOverviewSelect } from "@/lib/db/selects/organization.selects";

export async function getCurrentOrganization() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "base.organization:read");

    const record = await tx.organization.findFirstOrThrow({
      where: {
        id: access.organizationId,
      },
      select: organizationOverviewSelect,
    });

    return toOrganizationDTO(record);
  });
}

export async function getOrganizationMembers() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "base.membership:read");
    const rows = await tx.membership.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        status: true,
        user: { select: { displayName: true } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      role: row.role,
      status: row.status,
      name: row.user.displayName ?? "Member",
    }));
  });
}
