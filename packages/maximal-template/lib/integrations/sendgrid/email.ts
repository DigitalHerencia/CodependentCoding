import "server-only";

import { emailEnv } from "@/lib/env/email";

import { getSendGridClient } from "./client";

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  organizationId: string;
}) {
  const from = emailEnv.read().SENDGRID_FROM_EMAIL;
  const { organizationId, ...message } = input;
  const [response] = await getSendGridClient().send({
    ...message,
    from,
    customArgs: { organizationId },
  });
  return {
    statusCode: response.statusCode,
    messageId: response.headers["x-message-id"],
  };
}
