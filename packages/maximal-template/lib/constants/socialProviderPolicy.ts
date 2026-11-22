import "server-only";

/** Existing application limits measured in UTF-16 code units, not provider acceptance rules. */
export const SOCIAL_VARIANT_CODE_UNIT_LIMITS = {
  LINKEDIN: 3_000,
  X: 280,
  FACEBOOK: 63_206,
  INSTAGRAM: 2_200,
  OTHER: 100_000,
} as const;
