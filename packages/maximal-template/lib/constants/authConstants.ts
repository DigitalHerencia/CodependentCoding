/** Stable identity fixture identifiers shared by auth and domain seed owners. */
export const authSeedIds = {
  ownerUser: "user_seed_owner",
  agentUser: "user_seed_agent",
} as const;

/** Canonical credential and successful-session destinations. */
export const SIGN_IN_PATH = "/sign-in";
export const SIGN_UP_PATH = "/sign-up";
export const DEFAULT_AUTH_REDIRECT_PATH = "/dashboard";
