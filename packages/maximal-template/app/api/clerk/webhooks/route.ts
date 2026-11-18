/** Signed Clerk identity events are the only provider-sync entry point. */
import type { NextRequest } from "next/server";
import { handleClerkWebhookWorkflow } from "@/lib/workflows/authWorkflows";
import {
  verifyClerkWebhook,
  resolveClerkWebhookUser,
} from "@/lib/integrations/clerk/webhooks";
import {
  claimClerkWebhook,
  commitClerkWebhook,
  failClerkWebhook,
} from "@/lib/db/selects/authTx";
import { WebhookIdentityConflictError } from "@/lib/db/transactions/webhookEventTx";

/** Server capabilities never cross a Server Action or browser serialization boundary. */
export async function POST(request: NextRequest) {
  return handleClerkWebhookWorkflow(request, {
    verify: verifyClerkWebhook,
    project: resolveClerkWebhookUser,
    claim: claimClerkWebhook,
    commit: commitClerkWebhook,
    fail: failClerkWebhook,
    isConflict: (error) => error instanceof WebhookIdentityConflictError,
  });
}
