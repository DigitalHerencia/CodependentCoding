/** Stable identifiers for the application-owned authorization seed fixtures. */
export const authzSeedIds = {
  organization: "00000000-0000-4000-8000-000000000010",
  ownerMembership: "00000000-0000-4000-8000-000000000011",
  agentMembership: "00000000-0000-4000-8000-000000000012",
  settings: "00000000-0000-4000-8000-000000000013",
} as const;

/** Supported organization allocation modes. */
export const tenancies = ["multi", "single"] as const;
