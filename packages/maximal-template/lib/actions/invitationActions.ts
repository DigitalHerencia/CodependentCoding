"use server";

/** Invitation Actions contracts and composition for the owning application slice. */
import { randomBytes } from "node:crypto";
import {
  acceptInvitationSchema,
  createInvitationSchema,
  invitationIdSchema,
} from "@/schemas/invitationSchemas";
import type { ActionResult } from "@/types/actionTypes";
import { assertInvitationsAllowed } from "@/lib/authz/tenancy";
import {
  getVerifiedPrimaryEmail,
  requireIdentity,
} from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidatePaths } from "@/lib/cache/invalidate";
import { INVITATION_TTL_DAYS } from "@/lib/constants/invitations";
import { toInvitationDTO } from "@/lib/db/dtos/invitationDtos";
import { invitationSelect } from "@/lib/db/selects/invitationSelects";
import { withIdentityTransaction } from "@/lib/db/rls";
import { withTenantTransaction } from "@/lib/db/tenancy";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import {
  acceptInvitationTx,
  hashInvitationToken,
} from "@/lib/db/transactions/invitationTx";
import { assertMembershipAdministratorTx } from "@/lib/db/selects/adminTx";
import { toActionResult } from "@/lib/utils/actionResult";

/** Invites an email with a role; returns the one-time link path to share. */
export async function createInvitation(rawInput: unknown) {
  return toActionResult(async () => {
    assertInvitationsAllowed();
    const identity = await requireIdentity();
    const created = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:create");
        await assertMembershipAdministratorTx(tx, {
          organizationId: access.organizationId,
          actorUserId: access.userId,
        });
        const input = createInvitationSchema.parse(rawInput);
        const token = randomBytes(32).toString("base64url");
        const record = await tx.invitation.create({
          data: {
            organizationId: access.organizationId,
            email: input.email,
            role: input.role,
            tokenHash: hashInvitationToken(token),
            invitedByUserId: access.userId,
            expiresAt: new Date(Date.now() + INVITATION_TTL_DAYS * 86_400_000),
          },
          select: invitationSelect,
        });
        await tx.auditEvent.create({
          data: {
            organizationId: access.organizationId,
            actorUserId: access.userId,
            action: "membership.invitation.created",
            resourceType: "Invitation",
            resourceId: record.id,
            metadata: { role: input.role },
          },
        });
        return {
          invitation: toInvitationDTO(record),
          path: `/invitations/${token}`,
        };
      },
    );
    invalidatePaths(["/settings/members"]);
    return created;
  });
}

export async function revokeInvitation(
  rawInput: unknown,
): Promise<ActionResult<{ id: string }>> {
  return toActionResult(async () => {
    assertInvitationsAllowed();
    const identity = await requireIdentity();
    const revoked = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:delete");
        await assertMembershipAdministratorTx(tx, {
          organizationId: access.organizationId,
          actorUserId: access.userId,
        });
        const { invitationId } = invitationIdSchema.parse(rawInput);
        const result = await tx.invitation.updateMany({
          where: {
            id: invitationId,
            organizationId: access.organizationId,
            status: "PENDING",
          },
          data: { status: "REVOKED" },
        });
        if (result.count === 0) throw new ResourceNotFoundError("Invitation");
        await tx.auditEvent.create({
          data: {
            organizationId: access.organizationId,
            actorUserId: access.userId,
            action: "membership.invitation.revoked",
            resourceType: "Invitation",
            resourceId: invitationId,
          },
        });
        return { id: invitationId };
      },
    );
    invalidatePaths(["/settings/members"]);
    return revoked;
  });
}

/**
 * Joins the organization behind an invitation link. RLS shows the invitation
 * only to the user whose email it was sent to.
 */
export async function acceptInvitation(
  rawInput: unknown,
): Promise<ActionResult<{ organizationId: string }>> {
  return toActionResult(async () => {
    assertInvitationsAllowed();
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
        select: {
          id: true,
          organizationId: true,
          role: true,
          status: true,
          expiresAt: true,
        },
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
    invalidatePaths(["/dashboard"]);
    return joined;
  });
}
