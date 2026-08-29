import "server-only";

import { auth } from "@clerk/nextjs/server";

import { AuthenticationRequiredError } from "./identity";

export interface AuthenticatedSession {
  clerkUserId: string;
  clerkSessionId: string;
}

export async function requireAuthenticatedSession(): Promise<AuthenticatedSession> {
  const { isAuthenticated, userId, sessionId } = await auth();

  if (!isAuthenticated || !userId || !sessionId) {
    throw new AuthenticationRequiredError();
  }

  return {
    clerkUserId: userId,
    clerkSessionId: sessionId,
  };
}
