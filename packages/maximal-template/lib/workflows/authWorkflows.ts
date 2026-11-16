import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { getIdentity } from "@/lib/auth/auth";
import { projectClerkUser, verifyClerkWebhook } from "@/lib/auth/clerkWebhooks";
import { redirectAfterAuth } from "@/lib/auth/redirects";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
  WebhookIdentityConflictError,
} from "@/lib/db/transactions/webhookEventTx";
import type { ClerkUserProjection } from "@/types/integrationTypes";
import type { NextRequest } from "next/server";

export async function guardAuthEntryWorkflow() {
  if (await getIdentity()) redirectAfterAuth();
}

/** Verify the provider signature before any persistence; never expose a Server Action. */
export async function handleClerkWebhookWorkflow(request: NextRequest) {
  const payload = await request.clone().text();
  let event: Awaited<ReturnType<typeof verifyClerkWebhook>>;

  try {
    event = await verifyClerkWebhook(request);
  } catch {
    return Response.json(
      { error: "Invalid Clerk webhook signature." },
      { status: 400 },
    );
  }

  const eventId = request.headers.get("svix-id");
  if (!eventId) {
    return Response.json(
      { error: "The svix-id header is required." },
      { status: 400 },
    );
  }

  try {
    const processed = await processClerkWebhook(event, eventId, payload);

    return Response.json({ received: true, duplicate: !processed });
  } catch (error) {
    if (error instanceof WebhookIdentityConflictError) {
      return Response.json(
        { error: "Clerk webhook event identity conflict." },
        { status: 409 },
      );
    }
    // Log only a bounded diagnostic code, never payloads, credentials, or PII.
    const code =
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "string" &&
      /^P\d{4}$/.test(error.code)
        ? error.code
        : "processing_failed";
    console.error("Clerk webhook processing failed", { code });
    return Response.json(
      { error: "Clerk webhook processing failed." },
      { status: 500 },
    );
  }
}

/** Retain the durable claim/retry ledger and atomic identity plus completion writes. */
async function processClerkWebhook(
  event: Awaited<ReturnType<typeof verifyClerkWebhook>>,
  eventId: string,
  payload: string,
) {
  // Keep sign-in entry imports independent of database configuration. Load trusted
  // persistence only after the HTTP workflow has verified the provider signature.
  const { withProviderTransaction } = await import("@/lib/db/rls");
  const webhookEventId = await withProviderTransaction((tx) =>
    claimWebhookEventTx(tx, {
      provider: "clerk",
      eventId,
      type: event.type,
      payload,
    }),
  );
  if (!webhookEventId) return false;

  try {
    await withProviderTransaction(async (tx) => {
      if (event.type === "user.created" || event.type === "user.updated") {
        await syncClerkUserTx(tx, projectClerkUser(event.data));
      } else if (event.type === "user.deleted" && event.data.id) {
        await anonymizeClerkUserTx(tx, event.data.id);
      }

      await completeWebhookEventTx(tx, webhookEventId);
    });
    return true;
  } catch (error) {
    try {
      await withProviderTransaction((tx) =>
        failWebhookEventTx(tx, webhookEventId, "processing_failed"),
      );
    } catch (recordingError) {
      throw new AggregateError(
        [error, recordingError],
        "Clerk webhook processing and failure recording both failed.",
      );
    }
    throw error;
  }
}

/** Synchronize the provider identity using the accepted verified-email provisioning gate. */
export async function syncClerkUserTx(
  tx: Prisma.TransactionClient,
  user: ClerkUserProjection,
) {
  const { setRlsContext } = await import("@/lib/db/rls");
  const { provisionWorkspaceAccessTx } =
    await import("@/lib/db/transactions/onboardingTx");
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
  await setRlsContext(tx, { userId: record.id });
  await provisionWorkspaceAccessTx(
    tx,
    { id: record.id, displayName: user.displayName },
    user.verifiedEmail,
  );
}

export async function anonymizeClerkUserTx(
  tx: Prisma.TransactionClient,
  clerkUserId: string,
) {
  const { setRlsContext } = await import("@/lib/db/rls");
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
