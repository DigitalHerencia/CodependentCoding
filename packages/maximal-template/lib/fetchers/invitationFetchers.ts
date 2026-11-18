/** Invitation Fetchers contracts and composition for the owning application slice. */
import "server-only";
import type { InvitationListDTO } from "@/types/invitationTypes";
import { tenancy } from "@/lib/authz/mode";
import { isPrivilegedRole } from "@/lib/authz/roles";
import { hasPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { toInvitationDTO } from "@/lib/db/dtos/invitationDtos";
import { invitationSelect } from "@/lib/db/selects/invitationSelects";

/** Pending invitations, for members who may invite; others get an empty list. */
export async function getPendingInvitations(): Promise<InvitationListDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    if (
      tenancy === "single" ||
      !isPrivilegedRole(access.role) ||
      !hasPermission(access, "base.membership:create")
    )
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
