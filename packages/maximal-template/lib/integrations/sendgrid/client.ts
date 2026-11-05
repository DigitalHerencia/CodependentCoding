import "server-only";

import sgMail from "@sendgrid/mail";

import { emailEnv } from "@/lib/env/email";

let configured = false;
export function getSendGridClient() {
  if (!configured) {
    sgMail.setApiKey(emailEnv.read().SENDGRID_API_KEY);
    configured = true;
  }
  return sgMail;
}
