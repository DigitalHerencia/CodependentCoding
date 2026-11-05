import "server-only";

import { toActionResult } from "@/lib/utils/actionResult";
import { auth, currentUser, reverificationError } from "@clerk/nextjs/server";

import type {
  AuthenticatedIdentity,
  AuthenticatedSession,
  CurrentSessionContext,
  CurrentUserProfile,
} from "@/types/accessTypes";

export class AuthenticationRequiredError extends Error {
  readonly code = "UNAUTHENTICATED";

  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationRequiredError";
  }
}

export async function getIdentity(): Promise<AuthenticatedIdentity | null> {
  const { isAuthenticated, userId } = await auth();
  return isAuthenticated && userId ? { clerkUserId: userId } : null;
}

export async function requireIdentity(): Promise<AuthenticatedIdentity> {
  const identity = await getIdentity();
  if (!identity) throw new AuthenticationRequiredError();
  return identity;
}

export async function getCurrentSession(): Promise<CurrentSessionContext> {
  const session = await auth();
  return {
    isAuthenticated: session.isAuthenticated,
    clerkUserId: session.userId ?? null,
    clerkSessionId: session.sessionId ?? null,
  };
}

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

export async function getVerifiedPrimaryEmail() {
  const email = (await currentUser())?.primaryEmailAddress;
  return email?.verification?.status === "verified"
    ? email.emailAddress.toLowerCase()
    : null;
}

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

export async function requireCurrentUser(): Promise<CurrentUserProfile> {
  const user = await getCurrentUser();
  if (!user) throw new AuthenticationRequiredError();
  return user;
}

/** Admin access expires independently of the ordinary signed-in session. */
export async function getAdminSessionState(afterMinutes = 10) {
  const session = await auth();
  if (!session.isAuthenticated) throw new AuthenticationRequiredError();
  const ages = session.sessionClaims?.fva;
  if (
    ages &&
    ages[0] >= 0 &&
    ages[1] >= 0 &&
    ages.every((age) => age < afterMinutes)
  )
    return "verified" as const;
  if (!(await currentUser())?.twoFactorEnabled)
    return "enrollment-required" as const;
  return "verification-required" as const;
}

export class AdminReverificationRequiredError extends Error {}

export async function requireFreshAdminSession(afterMinutes = 10) {
  const session = await auth();
  if (!session.isAuthenticated) throw new AuthenticationRequiredError();
  const ages = session.sessionClaims?.fva;
  if (
    ages &&
    ages[0] >= 0 &&
    ages[1] >= 0 &&
    ages.every((age) => age < afterMinutes)
  )
    return;
  throw new AdminReverificationRequiredError();
}

export { reverificationError } from "@clerk/nextjs/server";

/** Preserve Clerk's reverification protocol while mapping all other failures safely. */
export async function toReverifiedActionResult<T>(run: () => Promise<T>) {
  try {
    return { ok: true, data: await run() } as const;
  } catch (cause) {
    if (cause instanceof AdminReverificationRequiredError)
      return reverificationError({ level: "multi_factor", afterMinutes: 5 });
    return toActionResult<T>(async () => {
      throw cause;
    });
  }
}
