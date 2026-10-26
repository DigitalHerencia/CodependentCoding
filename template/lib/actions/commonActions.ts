"use server";

import { randomBytes } from "node:crypto";

import {
  acceptInvitationSchema,
  createInvitationSchema,
  invitationIdSchema,
  organizationSettingsSchema,
} from "@/schemas/commonSchemas";
import type { ActionResult } from "@/types/actionTypes";
import type { CreatedInvitationDTO } from "@/types/commonTypes";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidatePaths } from "@/lib/cache/invalidate";
import { INVITATION_TTL_DAYS } from "@/lib/constants/tenancy";
import {
  toInvitationDTO,
  toOrganizationDTO,
} from "@/lib/db/dto/organization.dto";
import {
  invitationSelect,
  organizationOverviewSelect,
} from "@/lib/db/selects/organization.selects";
import {
  withIdentityTransaction,
  withTenantTransaction,
} from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import {
  acceptInvitationTx,
  hashInvitationToken,
} from "@/lib/db/transactions/invitation.tx";
import { toActionResult } from "@/lib/utils/actionResult";

export async function updateOrganizationSettings(rawInput: unknown) {
  const input = organizationSettingsSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "base.settings:update");
    await tx.organizationSettings.upsert({
      where: { organizationId: access.organizationId },
      update: {
        timezone: input.timezone,
        locale: input.locale,
        defaultCurrency: input.defaultCurrency,
      },
      create: {
        organizationId: access.organizationId,
        timezone: input.timezone,
        locale: input.locale,
        defaultCurrency: input.defaultCurrency,
      },
    });
    await tx.auditEvent.create({
      data: {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        action: "organization.settings.updated",
        resourceType: "Organization",
        resourceId: access.organizationId,
      },
    });
    const record = await tx.organization.findFirstOrThrow({
      where: { id: access.organizationId },
      select: organizationOverviewSelect,
    });
    return toOrganizationDTO(record);
  });
}

/** Invites an email with a role; returns the one-time link path to share. */
export async function createInvitation(
  rawInput: unknown,
): Promise<ActionResult<CreatedInvitationDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const created = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:create");
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
          path: `/invite/${token}`,
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
    const identity = await requireIdentity();
    const revoked = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "base.membership:delete");
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
    const { token } = acceptInvitationSchema.parse(rawInput);
    const joined = await withIdentityTransaction(async (tx, user) => {
      const invitation = await tx.invitation.findUnique({
        where: { tokenHash: hashInvitationToken(token) },
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
