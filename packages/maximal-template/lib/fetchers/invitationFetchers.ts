/** Invitation Fetchers contracts and composition for the owning application slice. */
import "server-only";
import type { InvitationListDTO } from "@/types/invitationTypes";
import { assertInvitationsAllowed } from "@/lib/authz/tenancy";
import { isPrivilegedRole } from "@/lib/authz/roles";
import { hasPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { toInvitationDTO } from "@/lib/db/dtos/invitationDtos";
import { invitationSelect } from "@/lib/db/selects/invitationSelects";

/** Project only current tenant invitations and the independently granted administration options. */
export async function getPendingInvitations(): Promise<InvitationListDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    assertInvitationsAllowed(access.organizationId);
    const privileged = isPrivilegedRole(access.role);
    const canInvite =
      privileged && hasPermission(access, "base.membership:create");
    const canEdit =
      canInvite && hasPermission(access, "base.membership:update");
    const canRevoke =
      canInvite && hasPermission(access, "base.membership:delete");
    const capabilities = { canInvite, canEdit, canRevoke };
    if (!canInvite)
      return { ...capabilities, organizationId: null, invitations: [] };
    const rows = await tx.invitation.findMany({
      where: {
        organizationId: access.organizationId,
        status: "PENDING",
        requiresToken: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
      select: invitationSelect,
    });
    return {
      ...capabilities,
      organizationId: access.organizationId,
      invitations: rows.map(toInvitationDTO),
    };
  });
}
