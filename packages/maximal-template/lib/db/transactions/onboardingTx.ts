import "server-only";

import { randomUUID } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import type { AppRole } from "@/types/accessTypes";
import {
  SINGLE_ORGANIZATION_ID,
  SINGLE_ORGANIZATION_SLUG,
  tenancy,
} from "@/lib/authz/mode";
import { selfSignupRole } from "@/lib/authz/roles";
import { setRlsContext } from "@/lib/db/rls";
import { acceptInvitationTx } from "@/lib/db/transactions/invitationTx";

export async function completeOnboardingTx(
  tx: Prisma.TransactionClient,
  userId: string,
  name: string,
) {
  return tx.user.updateMany({
    where: { id: userId, profileCompletedAt: null },
    data: { displayName: name, profileCompletedAt: new Date() },
  });
}

type ProvisionedUser = { id: string; displayName: string | null };

function workspaceSlug(name: string | null, userId: string): string {
  const base =
    (name ?? "workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "workspace";
  return `${base}-${userId.slice(-8).toLowerCase()}`;
}

async function createMembershipTx(
  tx: Prisma.TransactionClient,
  organizationId: string,
  userId: string,
  role: AppRole,
) {
  const membership = await tx.membership.create({
    data: { organizationId, userId, role, status: "ACTIVE" },
    select: { id: true },
  });
  await tx.auditEvent.create({
    data: {
      organizationId,
      actorUserId: userId,
      action: "membership.provisioned",
      resourceType: "Membership",
      resourceId: membership.id,
      metadata: { role },
    },
  });
}

/** Multi tenancy: a new organization owned by `user`. */
async function createOwnedOrganizationTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
) {
  const organizationId = randomUUID();
  await setRlsContext(tx, { organizationId });
  await tx.organization.create({
    data: {
      id: organizationId,
      slug: workspaceSlug(user.displayName, user.id),
      name: user.displayName
        ? `${user.displayName}'s Workspace`
        : "My Workspace",
    },
    select: { id: true },
  });
  await tx.organizationSettings.create({ data: { organizationId } });
  await createMembershipTx(tx, organizationId, user.id, "OWNER");
}

/** Single tenancy: creates the shared organization the first time anyone joins. */
async function ensureSingleOrganizationTx(tx: Prisma.TransactionClient) {
  await setRlsContext(tx, { organizationId: SINGLE_ORGANIZATION_ID });
  const created = await tx.$queryRaw<{ id: string }[]>`
    INSERT INTO "Organization" ("id", "slug", "name", "updatedAt")
    VALUES (${SINGLE_ORGANIZATION_ID}::uuid, ${SINGLE_ORGANIZATION_SLUG}, 'Workspace', now())
    ON CONFLICT DO NOTHING
    RETURNING "id"
  `;
  if (created.length > 0) {
    await tx.organizationSettings.create({
      data: { organizationId: SINGLE_ORGANIZATION_ID },
    });
    return;
  }
  const existing = await tx.organization.findUnique({
    where: { id: SINGLE_ORGANIZATION_ID },
    select: { id: true },
  });
  if (!existing)
    throw new Error(
      `Organization slug "${SINGLE_ORGANIZATION_SLUG}" belongs to another organization.`,
    );
}

/** The newest pending invitation for the verified email: an approval (no link) or a link. */
function findPendingInvitationTx(
  tx: Prisma.TransactionClient,
  email: string | null,
  requiresToken: boolean,
) {
  if (!email) return null;
  return tx.invitation.findFirst({
    where: {
      email,
      requiresToken,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: { id: true, organizationId: true, role: true },
  });
}

async function joinSingleOrganizationTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
  email: string | null,
  isBootstrapOwner: boolean,
): Promise<boolean> {
  await ensureSingleOrganizationTx(tx);
  const existing = await tx.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: SINGLE_ORGANIZATION_ID,
        userId: user.id,
      },
    },
    select: { id: true, role: true, status: true },
  });

  if (isBootstrapOwner) {
    if (!existing) {
      await createMembershipTx(tx, SINGLE_ORGANIZATION_ID, user.id, "OWNER");
      return true;
    }
    if (existing.role !== "OWNER" || existing.status !== "ACTIVE") {
      await tx.membership.update({
        where: { id: existing.id },
        data: { role: "OWNER", status: "ACTIVE" },
      });
      await tx.auditEvent.create({
        data: {
          organizationId: SINGLE_ORGANIZATION_ID,
          actorUserId: user.id,
          action: "membership.bootstrap_owner",
          resourceType: "Membership",
          resourceId: existing.id,
          metadata: {
            previousRole: existing.role,
            previousStatus: existing.status,
          },
        },
      });
    }
    return true;
  }

  // Suspended and revoked members stay that way until an administrator acts.
  if (existing) return existing.status === "ACTIVE";

  const approval = await findPendingInvitationTx(tx, email, false);
  if (approval) {
    await acceptInvitationTx(tx, approval, user.id);
    return true;
  }
  await createMembershipTx(tx, SINGLE_ORGANIZATION_ID, user.id, selfSignupRole);
  return true;
}

async function joinOrCreateOrganizationTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
  email: string | null,
): Promise<boolean> {
  const active = await tx.membership.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (active) return true;

  const approval = await findPendingInvitationTx(tx, email, false);
  if (approval) {
    await acceptInvitationTx(tx, approval, user.id);
    return true;
  }
  // An invitation link is waiting: join through it instead of a new organization.
  if (await findPendingInvitationTx(tx, email, true)) return false;

  await createOwnedOrganizationTx(tx, user);
  return true;
}

/**
 * Gives a user who finished onboarding access without an administrator
 * (AUTH.md §4.3). Single tenancy joins the shared organization (the bootstrap
 * owner as OWNER, everyone else with `selfSignupRole` or their pending
 * approval's role). Multi tenancy accepts a pending approval or creates the
 * user's own organization. Idempotent; false when the user must wait.
 */
export async function provisionWorkspaceAccessTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
  email: string | null,
  isBootstrapOwner: boolean,
): Promise<boolean> {
  return tenancy === "single"
    ? joinSingleOrganizationTx(tx, user, email, isBootstrapOwner)
    : joinOrCreateOrganizationTx(tx, user, email);
}
