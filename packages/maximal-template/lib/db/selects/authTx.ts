/** Atomic identity synchronization and local profile writes under caller-supplied RLS. */
import "server-only";
import { authUserIdSelect } from "@/lib/db/selects/authSelects";
import type { Prisma } from "@/generated/prisma/client";
import type {
  AuthProfileInput,
  ClerkUserProjection,
  ClerkWebhookEvent,
} from "@/types/authTypes";
import { withProviderTransaction } from "@/lib/db/rls";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "@/lib/db/transactions/webhookEventTx";

/** Idempotent completion never overwrites an already completed profile. */
export function completeOnboardingTx(
  tx: Prisma.TransactionClient,
  userId: string,
  input: AuthProfileInput,
) {
  return tx.user.updateMany({
    where: { id: userId, profileCompletedAt: null },
    data: { ...input, profileCompletedAt: new Date() },
  });
}
/** Profile editing cannot create a second profile or alter completion. */
export function updateOwnOnboardingProfileTx(
  tx: Prisma.TransactionClient,
  userId: string,
  input: AuthProfileInput,
) {
  return tx.user.updateMany({
    where: { id: userId, profileCompletedAt: { not: null } },
    data: input,
  });
}
/** Claim only a verified envelope before applying provider changes. */
export function claimClerkWebhook(
  eventId: string,
  type: string,
  payload: string,
) {
  return withProviderTransaction((tx) =>
    claimWebhookEventTx(tx, { provider: "clerk", eventId, type, payload }),
  );
}
/** Commit identity synchronization and the processed marker atomically. */
export function commitClerkWebhook(
  event: ClerkWebhookEvent,
  projection: ClerkUserProjection | null | undefined,
  webhookEventId: string,
) {
  return withProviderTransaction(async (tx) => {
    if (projection) await syncClerkUserTx(tx, projection);
    else if (
      projection === null &&
      "id" in event.data &&
      typeof event.data.id === "string"
    )
      await anonymizeClerkUserTx(tx, event.data.id);
    await completeWebhookEventTx(tx, webhookEventId);
  });
}
/** A failed verified event remains retryable without storing raw payloads. */
export function failClerkWebhook(webhookEventId: string) {
  return withProviderTransaction((tx) =>
    failWebhookEventTx(tx, webhookEventId, "processing_failed"),
  );
}
/** Synchronize the provider identity using the accepted verified-email provisioning gate. */
export async function syncClerkUserTx(
  tx: Prisma.TransactionClient,
  user: ClerkUserProjection,
) {
  const { setRlsContext } = await import("@/lib/db/rls");
  const { provisionWorkspaceAccessTx } =
    await import("@/lib/db/selects/authzTx");
  await setRlsContext(tx, { clerkUserId: user.clerkUserId });
  const record = await persistClerkIdentityTx(tx, user);
  await setRlsContext(tx, { userId: record.id });
  await provisionWorkspaceAccessTx(
    tx,
    { id: record.id, displayName: user.displayName },
    user.verifiedEmail,
  );
}

/** Deactivate memberships atomically before clearing provider and local profile data. */
export async function anonymizeClerkUserTx(
  tx: Prisma.TransactionClient,
  clerkUserId: string,
) {
  const { setRlsContext } = await import("@/lib/db/rls");
  await tx.$executeRaw`SELECT set_config('app.clerk_user_id', ${clerkUserId}, true)`;
  await setRlsContext(tx, { userId: clerkUserId });
  const { suspendAuthzMembershipsTx } =
    await import("@/lib/db/selects/authzTx");
  await suspendAuthzMembershipsTx(tx, clerkUserId);
  await tx.user.updateMany({
    where: { id: clerkUserId },
    data: {
      email: null,
      displayName: "Deleted user",
      imageUrl: null,
      username: null,
      firstName: null,
      lastName: null,
      bio: null,
      phoneNumber: null,
      profileCompletedAt: null,
    },
  });
}

/** Identity synchronization cannot overwrite local profile fields or completion. */
export async function persistClerkIdentityTx(
  tx: Prisma.TransactionClient,
  user: ClerkUserProjection,
) {
  const { setRlsContext } = await import("@/lib/db/rls");
  await setRlsContext(tx, { clerkUserId: user.clerkUserId });
  const record = await tx.user.upsert({
    where: { id: user.clerkUserId },
    create: {
      id: user.clerkUserId,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      username: user.username,
    },
    update: {
      displayName: user.displayName,
      email: user.email,
      imageUrl: user.imageUrl,
      username: user.username,
    },
    select: authUserIdSelect,
  });

  return record;
}
