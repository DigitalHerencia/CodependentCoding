import "server-only";

import type { InvitationListDTO } from "@/types/commonTypes";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import {
  toInvitationDTO,
  toOrganizationDTO,
} from "@/lib/db/dto/organization.dto";
import {
  invitationSelect,
  organizationOverviewSelect,
} from "@/lib/db/selects/organization.selects";

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

/** Pending invitations, for members who may invite; others get an empty list. */
export async function getPendingInvitations(): Promise<InvitationListDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    if (!hasPermission(access, "base.membership:create"))
      return { canInvite: false, invitations: [] };
    const rows = await tx.invitation.findMany({
      where: {
        organizationId: access.organizationId,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: invitationSelect,
    });
    return { canInvite: true, invitations: rows.map(toInvitationDTO) };
  });
}
