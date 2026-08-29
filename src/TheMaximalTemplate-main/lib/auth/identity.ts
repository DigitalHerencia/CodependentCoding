import "server-only";

import { auth } from "@clerk/nextjs/server";

import type { AuthenticatedIdentity } from "../../types/access";

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationRequiredError";
  }
}

export async function getIdentity(): Promise<AuthenticatedIdentity | null> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  return { clerkUserId: userId };
}

export async function requireIdentity(): Promise<AuthenticatedIdentity> {
  const identity = await getIdentity();

  if (!identity) {
    throw new AuthenticationRequiredError();
  }

  return identity;
}
