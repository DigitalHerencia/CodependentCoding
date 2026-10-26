/**
 * How organizations come to exist (AUTH.md §4). `hipster-stack new` sets it.
 * - "multi": a sign-up without an invitation gets its own organization.
 * - "single": one organization; the first sign-up owns it and everyone else joins by invitation.
 */
export const tenancy: "multi" | "single" = "multi";

/** The single organization's slug when `tenancy` is "single". */
export const SINGLE_ORGANIZATION_SLUG = "main";

/** Days an invitation link stays valid. */
export const INVITATION_TTL_DAYS = 14;
