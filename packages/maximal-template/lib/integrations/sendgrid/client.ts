import "server-only";

import sgMail from "@sendgrid/mail";

import { sendGridEnv } from "@/lib/integrations/sendgrid/env";

let configured = false;
export function getSendGridClient() {
  if (!configured) {
    sgMail.setApiKey(sendGridEnv.read().SENDGRID_API_KEY);
    configured = true;
  }
  return sgMail;
}
