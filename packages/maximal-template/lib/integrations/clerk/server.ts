/** Auth contracts and composition for the owning application slice. */
import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import type {
  AuthenticatedIdentity,
  AuthenticatedSession,
  CurrentSessionContext,
  CurrentUserProfile,
} from "@/types/authTypes";

/** Stable authentication failure without provider diagnostics or credentials. */
export class AuthenticationRequiredError extends Error {
  readonly code = "UNAUTHENTICATED";

  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationRequiredError";
  }
}

/** Resolve Clerk identity without selecting an organization or local profile. */
export async function getIdentity(): Promise<AuthenticatedIdentity | null> {
  const { isAuthenticated, userId } = await auth();
  return isAuthenticated && userId ? { clerkUserId: userId } : null;
}

/** Require an authenticated Clerk user before any application persistence. */
export async function requireIdentity(): Promise<AuthenticatedIdentity> {
  const identity = await getIdentity();
  if (!identity) throw new AuthenticationRequiredError();
  return identity;
}

/** Project session identifiers without exposing provider tokens. */
export async function getCurrentSession(): Promise<CurrentSessionContext> {
  const session = await auth();
  return {
    isAuthenticated: session.isAuthenticated,
    clerkUserId: session.userId ?? null,
    clerkSessionId: session.sessionId ?? null,
  };
}

/** Require both a user and active Clerk session for session-sensitive actions. */
export async function requireAuthenticatedSession(): Promise<AuthenticatedSession> {
  const session = await auth();
  if (!session.isAuthenticated || !session.userId || !session.sessionId) {
    throw new AuthenticationRequiredError();
  }
  return {
    clerkUserId: session.userId,
    clerkSessionId: session.sessionId,
  };
}

/** Only a provider-verified primary email may select an invitation. */
export async function getVerifiedPrimaryEmail() {
  const email = (await currentUser())?.primaryEmailAddress;
  return email?.verification?.status === "verified"
    ? email.emailAddress.toLowerCase()
    : null;
}

/** Read provider identity metadata independently of application profile fields. */
export async function getCurrentUser(): Promise<CurrentUserProfile | null> {
  const user = await currentUser();
  if (!user) return null;

  return {
    clerkUserId: user.id,
    displayName:
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      null,
    primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
    imageUrl: user.imageUrl,
  };
}

/** Require trusted provider identity metadata for authenticated integration flows. */
export async function requireCurrentUser(): Promise<CurrentUserProfile> {
  const user = await getCurrentUser();
  if (!user) throw new AuthenticationRequiredError();
  return user;
}
