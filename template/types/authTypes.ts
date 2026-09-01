export interface AuthenticatedSession {
  clerkUserId: string;
  clerkSessionId: string;
}

export interface CurrentSessionContext {
  isAuthenticated: boolean;
  clerkUserId: string | null;
  clerkSessionId: string | null;
}

export interface CurrentUserProfile {
  clerkUserId: string;
  displayName: string | null;
  primaryEmailAddress: string | null;
  imageUrl: string;
}
