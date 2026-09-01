import "server-only";

import { EventWebhook } from "@sendgrid/eventwebhook";

export function verifySendGridWebhook(
  payload: string,
  signature: string | null,
  timestamp: string | null,
) {
  const verificationKey = process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY?.trim();
  if (!verificationKey)
    throw new Error(
      "SendGrid webhooks are not configured. Add SENDGRID_WEBHOOK_VERIFICATION_KEY to .env.local.",
    );
  if (!signature || !timestamp)
    throw new Error("SendGrid webhook signature headers are required.");
  const verifier = new EventWebhook();
  return verifier.verifySignature(
    verifier.convertPublicKeyToECDSA(verificationKey),
    payload,
    signature,
    timestamp,
  );
}
