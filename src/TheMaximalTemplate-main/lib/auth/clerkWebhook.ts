import type { WebhookEvent } from "@clerk/nextjs/server";

export interface ClerkUserProjection {
  clerkUserId: string;
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
  username: string | null;
}

export function projectClerkUser(
  data: Extract<
    WebhookEvent,
    { type: "user.created" | "user.updated" }
  >["data"],
): ClerkUserProjection {
  const email =
    data.email_addresses.find(
      (address) => address.id === data.primary_email_address_id,
    )?.email_address ?? null;
  return {
    clerkUserId: data.id,
    email,
    displayName:
      [data.first_name, data.last_name].filter(Boolean).join(" ") ||
      data.username ||
      null,
    imageUrl: data.image_url,
    username: data.username,
  };
}
