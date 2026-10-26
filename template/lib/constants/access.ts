/**
 * Setup choices for organizations and authorization (AUTH.md §4.3, §5).
 * `hipster-stack new` writes both values; change them by hand only before
 * the app has users.
 */
export type Tenancy = "multi" | "single";
export type AccessControl = "rbac" | "abac";

/**
 * - "multi": a sign-up without an invitation gets its own organization.
 * - "single": one organization; the first sign-up owns it and everyone else joins by invitation.
 */
export const tenancy: Tenancy = "multi";

/**
 * - "rbac": the role's permissions decide; any record in the organization is in reach.
 * - "abac": after the role check, record rules apply (owner, assignee, requester, shared with viewers).
 */
export const accessControl: AccessControl = "abac";

/** The single organization's slug when `tenancy` is "single". */
export const SINGLE_ORGANIZATION_SLUG = "main";

/** Days an invitation link stays valid. */
export const INVITATION_TTL_DAYS = 14;
