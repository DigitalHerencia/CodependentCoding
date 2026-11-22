"use server";

import {
  acceptInvitationSchema,
  createInvitationSchema,
  editInvitationSchema,
  invitationIdSchema,
} from "@/schemas/invitationSchemas";
import type {
  InvitationIdentifier,
  InvitationOrganization,
} from "@/types/invitationTypes";
import type { ActionResult } from "@/types/actionTypes";
import {
  getVerifiedPrimaryEmail,
  requireIdentity,
} from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidatePaths } from "@/lib/cache/invalidate";
import { toInvitationDTO } from "@/lib/db/dtos/invitationDtos";
import { invitationAcceptanceSelect } from "@/lib/db/selects/invitationSelects";
import { withIdentityTransaction } from "@/lib/db/rls";
import { withTenantTransaction } from "@/lib/db/tenancy";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import {
  acceptInvitationTx,
  createInvitationTx,
  editInvitationTx,
  revokeInvitationTx,
  hashInvitationToken,
} from "@/lib/db/selects/invitationTx";
import { toActionResult } from "@/lib/utils/actionResult";

/** Authorize an invitation and return its one-time share link; delivery is manual. */
export async function createInvitation(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const created = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:create");
        const input = createInvitationSchema.parse(rawInput);
        const { record, path } = await createInvitationTx(
          tx,
          { organizationId: access.organizationId, actorUserId: access.userId },
          input,
        );
        return { invitation: toInvitationDTO(record), path };
      },
    );
    invalidatePaths(["/settings/members", "/admin", "/admin/users"]);
    return created;
  });
}

/** Authorize edits to the recipient and role of a pending invitation in this tenant. */
export async function editInvitation(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const updated = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:update");
        const input = editInvitationSchema.parse(rawInput);
        return toInvitationDTO(
          await editInvitationTx(
            tx,
            {
              organizationId: access.organizationId,
              actorUserId: access.userId,
            },
            input,
          ),
        );
      },
    );
    invalidatePaths(["/settings/members", "/admin", "/admin/users"]);
    return updated;
  });
}

/** Cancel a pending invitation after rechecking permission and tenant membership. */
export async function revokeInvitation(
  rawInput: unknown,
): Promise<ActionResult<InvitationIdentifier>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const revoked = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:delete");
        const { invitationId } = invitationIdSchema.parse(rawInput);
        return revokeInvitationTx(
          tx,
          { organizationId: access.organizationId, actorUserId: access.userId },
          invitationId,
        );
      },
    );
    invalidatePaths(["/settings/members", "/admin", "/admin/users"]);
    return revoked;
  });
}

/**
 * Joins the organization behind an invitation link. RLS shows the invitation
 * only to the user whose email it was sent to.
 */
export async function acceptInvitation(
  rawInput: unknown,
): Promise<ActionResult<InvitationOrganization>> {
  return toActionResult(async () => {
    await requireIdentity();
    const { token } = acceptInvitationSchema.parse(rawInput);
    const email = await getVerifiedPrimaryEmail();
    const joined = await withIdentityTransaction(async (tx, user) => {
      if (!email || email !== user.email?.toLowerCase())
        throw new ResourceNotFoundError("Invitation");
      const invitation = await tx.invitation.findUnique({
        where: {
          tokenHash: hashInvitationToken(token),
          email,
          requiresToken: true,
        },
        select: invitationAcceptanceSelect,
      });
      if (
        !invitation ||
        invitation.status === "REVOKED" ||
        invitation.expiresAt <= new Date()
      )
        throw new ResourceNotFoundError("Invitation");
      const { organizationId } = await acceptInvitationTx(
        tx,
        invitation,
        user.id,
      );
      return { organizationId };
    });
    invalidatePaths([
      "/dashboard",
      "/settings/members",
      "/admin",
      "/admin/users",
    ]);
    return joined;
  });
}
