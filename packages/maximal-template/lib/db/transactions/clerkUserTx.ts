import "server-only";

import { randomUUID } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import type { ClerkUserProjection } from "@/types/integrationTypes";
import { SINGLE_ORGANIZATION_SLUG, tenancy } from "@/lib/authz/mode";
import { setRlsContext } from "@/lib/db/rls";

import { baseEnv } from "@/lib/utils/env";

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
    where: { id: user.clerkUserId },
    create: {
      id: user.clerkUserId,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
    },
    update: {
      email: user.email,
      imageUrl: user.imageUrl,
    },
    select: { id: true },
  });
  if (baseEnv.value("BOOTSTRAP_OWNER_CLERK_USER_ID") !== user.clerkUserId)
    return;

  await setRlsContext(tx, { userId: record.id });

  // Any previous membership includes suspended and revoked memberships.
  const membership = await tx.membership.findFirst({
    where: { userId: record.id },
    select: { id: true },
  });
  if (membership) return;

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
 * Single tenancy: the configured bootstrap identity provisions the shared
 * workspace only if it does not already exist.
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
  await setRlsContext(tx, { userId: clerkUserId });
  const memberships = await tx.membership.findMany({
    where: { userId: clerkUserId },
    select: { id: true, organizationId: true, status: true },
  });
  for (const membership of memberships) {
    if (membership.status === "SUSPENDED" || membership.status === "REVOKED")
      continue;
    await setRlsContext(tx, { organizationId: membership.organizationId });
    await tx.membership.updateMany({
      where: {
        id: membership.id,
        userId: clerkUserId,
        organizationId: membership.organizationId,
      },
      data: { status: "SUSPENDED" },
    });
    await tx.auditEvent.create({
      data: {
        organizationId: membership.organizationId,
        actorUserId: clerkUserId,
        action: "identity.deactivated",
        resourceType: "Membership",
        resourceId: membership.id,
        metadata: {
          source: "clerk-webhook",
          previousStatus: membership.status,
          status: "SUSPENDED",
        },
      },
    });
  }
  await tx.user.updateMany({
    where: { id: clerkUserId },
    data: { email: null, displayName: "Deleted user", imageUrl: null },
  });
}
