import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

import { withProviderTransaction } from "@/lib/db/provider";
import {
  anonymizeClerkUserTx,
  syncClerkUserTx,
} from "@/lib/db/transactions/sync-clerk-user.tx";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "@/lib/db/transactions/webhook-event.tx";
import { projectClerkUser } from "@/lib/integrations/clerk/webhook";

export async function POST(request: NextRequest) {
  let webhookEventId: string | null = null;

  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!signingSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is required.");
    }

    const payload = await request.clone().text();
    const event = await verifyWebhook(request, { signingSecret });
    const eventId = request.headers.get("svix-id");

    if (!eventId) throw new Error("The svix-id header is required.");

    webhookEventId = await withProviderTransaction((tx) =>
      claimWebhookEventTx(tx, {
        provider: "clerk",
        eventId,
        type: event.type,
        payload,
      }),
    );

    if (!webhookEventId) {
      return Response.json({ received: true, duplicate: true });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      await withProviderTransaction((tx) =>
        syncClerkUserTx(tx, projectClerkUser(event.data)),
      );
    } else if (event.type === "user.deleted" && event.data.id) {
      await withProviderTransaction((tx) =>
        anonymizeClerkUserTx(tx, event.data.id!),
      );
    }

    await withProviderTransaction((tx) =>
      completeWebhookEventTx(tx, webhookEventId!),
    );

    return Response.json({ received: true });
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Clerk webhook failed.";

    if (webhookEventId) {
      await withProviderTransaction((tx) =>
        failWebhookEventTx(tx, webhookEventId!, message),
      );
    }

    return Response.json(
      { error: message },
      { status: webhookEventId ? 500 : 400 },
    );
  }
}
