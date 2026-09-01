import type { NextRequest } from "next/server";

import {
  projectClerkUser,
  verifyClerkWebhook,
} from "@/lib/auth/clerk-webhooks";
import { withProviderTransaction } from "@/lib/db/provider";
import {
  anonymizeClerkUserTx,
  syncClerkUserTx,
} from "@/lib/db/transactions/clerk-user.tx";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
} from "@/lib/db/transactions/webhook-event.tx";

export async function POST(request: NextRequest) {
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
    const processed = await withProviderTransaction(async (tx) => {
      const webhookEventId = await claimWebhookEventTx(tx, {
        provider: "clerk",
        eventId,
        type: event.type,
        payload,
      });

      if (!webhookEventId) return false;

      if (event.type === "user.created" || event.type === "user.updated") {
        await syncClerkUserTx(tx, projectClerkUser(event.data));
      } else if (event.type === "user.deleted" && event.data.id) {
        await anonymizeClerkUserTx(tx, event.data.id);
      }

      await completeWebhookEventTx(tx, webhookEventId);
      return true;
    });

    return Response.json({ received: true, duplicate: !processed });
  } catch {
    return Response.json(
      { error: "Clerk webhook processing failed." },
      { status: 500 },
    );
  }
}
