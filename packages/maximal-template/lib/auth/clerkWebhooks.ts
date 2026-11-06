import { baseEnv } from "@/lib/utils/env";
import type { ClerkUserProjection } from "@/types/integrationTypes";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import "server-only";

export async function verifyClerkWebhook(request: NextRequest) {
  const signingSecret = baseEnv.read().CLERK_WEBHOOK_SIGNING_SECRET;
  if (!signingSecret) {
    throw new Error("CLERK_WEBHOOK_SIGNING_SECRET is required.");
  }
  return verifyWebhook(request, { signingSecret });
}

export function projectClerkUser(user: {
  id: string;
  email_addresses: Array<{ id: string; email_address: string }>;
  primary_email_address_id: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  username: string | null;
}): ClerkUserProjection {
  const primaryEmail = user.email_addresses.find(
    (email) => email.id === user.primary_email_address_id,
  );
  const displayName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    clerkUserId: user.id,
    email: primaryEmail?.email_address ?? null,
    displayName: displayName || user.username,
    imageUrl: user.image_url || null,
    username: user.username,
  };
}
