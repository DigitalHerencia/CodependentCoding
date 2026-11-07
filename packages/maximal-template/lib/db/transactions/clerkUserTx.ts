import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { ClerkUserProjection } from "@/types/integrationTypes";
import { setRlsContext } from "@/lib/db/rls";
import { provisionWorkspaceAccessTx } from "@/lib/db/transactions/onboardingTx";

import { baseEnv } from "@/lib/utils/env";

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
  await provisionWorkspaceAccessTx(
    tx,
    { id: record.id, displayName: user.username },
    null,
    true,
  );
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
