"use client";

import { useAuth } from "@clerk/nextjs";

export function useActiveIdentity() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  return {
    isLoaded,
    isSignedIn: isSignedIn === true,
    clerkUserId: userId ?? null,
  };
}
