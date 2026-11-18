/** Clerk signature verification and identity projection; never persists application data. */
import { baseEnv } from "@/lib/utils/env";
import { clerkClient } from "@clerk/nextjs/server";
import type {
  ClerkWebhookUser,
  ClerkUserProjection,
  ClerkWebhookEvent,
} from "@/types/authTypes";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import "server-only";

/** Reject unverified envelopes before provider state or application data is read. */
export async function verifyClerkWebhook(request: NextRequest) {
  const signingSecret = baseEnv.read().CLERK_WEBHOOK_SIGNING_SECRET;
  if (!signingSecret) {
    throw new Error("CLERK_WEBHOOK_SIGNING_SECRET is required.");
  }
  return verifyWebhook(request, { signingSecret });
}

/** Project verified provider identity without local application profile fields. */
export function projectClerkUser(user: ClerkWebhookUser): ClerkUserProjection {
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
    verifiedEmail:
      primaryEmail?.verification?.status === "verified"
        ? primaryEmail.email_address.toLowerCase()
        : null,
    displayName: displayName || user.username,
    imageUrl: user.image_url || null,
    username: user.username,
  };
}

/** Read current identity state; only an authoritative 404 means a deleted user. */
export async function getClerkUserProjection(
  userId: string,
): Promise<ClerkUserProjection | null> {
  try {
    const user = await (await clerkClient()).users.getUser(userId);
    return projectClerkUser({
      id: user.id,
      primary_email_address_id: user.primaryEmailAddressId,
      first_name: user.firstName,
      last_name: user.lastName,
      image_url: user.imageUrl,
      username: user.username,
      email_addresses: user.emailAddresses.map((email) => ({
        id: email.id,
        email_address: email.emailAddress,
        verification: email.verification,
      })),
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404
    )
      return null;
    throw error;
  }
}
/** Webhook delivery is unordered: retrieve current state before committing changes. */
export async function resolveClerkWebhookUser(event: ClerkWebhookEvent) {
  if (event.type === "user.deleted") return null;
  if (event.type === "user.created" || event.type === "user.updated")
    return getClerkUserProjection(event.data.id);
  return undefined;
}
