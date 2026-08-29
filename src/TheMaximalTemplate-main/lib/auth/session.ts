import "server-only";

import { auth } from "@clerk/nextjs/server";

export interface CurrentSessionContext {
  isAuthenticated: boolean;
  clerkUserId: string | null;
  clerkSessionId: string | null;
}

export async function getCurrentSession(): Promise<CurrentSessionContext> {
  const session = await auth();

  return {
    isAuthenticated: session.isAuthenticated,
    clerkUserId: session.userId ?? null,
    clerkSessionId: session.sessionId ?? null,
  };
}
