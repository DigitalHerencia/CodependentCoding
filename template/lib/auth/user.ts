import "server-only";

import { currentUser } from "@clerk/nextjs/server";

import { AuthenticationRequiredError } from "./identity";

export interface CurrentUserProfile {
  clerkUserId: string;
  displayName: string | null;
  primaryEmailAddress: string | null;
  imageUrl: string;
}

export async function getCurrentUser(): Promise<CurrentUserProfile | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    null;

  return {
    clerkUserId: user.id,
    displayName,
    primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
    imageUrl: user.imageUrl,
  };
}

export async function requireCurrentUser(): Promise<CurrentUserProfile> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationRequiredError();
  }

  return user;
}
