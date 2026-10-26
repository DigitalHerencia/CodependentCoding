import "server-only";

import { randomUUID } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import type { ClerkUserProjection } from "@/types/integrationTypes";
import { SINGLE_ORGANIZATION_SLUG, tenancy } from "@/lib/constants/access";
import { setRlsContext } from "@/lib/db/rls";

import { acceptInvitationTx } from "./invitation.tx";

function workspaceSlug(username: string | null, clerkUserId: string): string {
  const base =
    (username ?? "workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "workspace";
  return `${base}-${clerkUserId.slice(-8).toLowerCase()}`;
}

export async function syncClerkUserTx(
  tx: Prisma.TransactionClient,
  user: ClerkUserProjection,
) {
  await setRlsContext(tx, { clerkUserId: user.clerkUserId });
  const record = await tx.user.upsert({
    where: { clerkUserId: user.clerkUserId },
    create: {
      clerkUserId: user.clerkUserId,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
    },
    update: {
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
    },
    select: { id: true },
  });
  const membership = await tx.membership.findFirst({
    where: { userId: record.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (membership) return;

  // An invitation to this email wins over a new organization (RLS shows the
  // user only invitations sent to their own email).
  const invitation = user.email
    ? await tx.invitation.findFirst({
        where: {
          email: user.email.toLowerCase(),
          status: "PENDING",
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, organizationId: true, role: true },
      })
    : null;
  if (invitation) {
    await acceptInvitationTx(tx, invitation, record.id);
    return;
  }

  if (tenancy === "single") {
    await claimSingleOrganizationTx(tx, record.id);
    return;
  }

  const organizationId = randomUUID();
  await setRlsContext(tx, { organizationId });
  await tx.organization.create({
    data: {
      id: organizationId,
      slug: workspaceSlug(user.username, user.clerkUserId),
      name: user.username ? `${user.username}'s Workspace` : "My Workspace",
    },
    select: { id: true },
  });
  await ownOrganizationTx(tx, organizationId, record.id);
}

async function ownOrganizationTx(
  tx: Prisma.TransactionClient,
  organizationId: string,
  userId: string,
) {
  await tx.membership.create({
    data: { organizationId, userId, role: "OWNER", status: "ACTIVE" },
  });
  await tx.organizationSettings.create({ data: { organizationId } });
}

/**
 * Single tenancy: the first user without an invitation creates the one
 * organization and owns it. Later users without an invitation get no
 * membership until an admin invites them.
 */
async function claimSingleOrganizationTx(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const organizationId = randomUUID();
  await setRlsContext(tx, { organizationId });
  const created = await tx.$queryRaw<{ id: string }[]>`
    INSERT INTO "Organization" ("id", "slug", "name", "updatedAt")
    VALUES (${organizationId}::uuid, ${SINGLE_ORGANIZATION_SLUG}, 'Workspace', now())
    ON CONFLICT ("slug") DO NOTHING
    RETURNING "id"
  `;
  if (created.length === 0) return;
  await ownOrganizationTx(tx, organizationId, userId);
}

export async function anonymizeClerkUserTx(
  tx: Prisma.TransactionClient,
  clerkUserId: string,
) {
  await tx.$executeRaw`SELECT set_config('app.clerk_user_id', ${clerkUserId}, true)`;
  await tx.user.updateMany({
    where: { clerkUserId },
    data: { email: null, displayName: "Deleted user", imageUrl: null },
  });
}
