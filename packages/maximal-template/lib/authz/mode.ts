import "server-only";

import { tenancySchema } from "@/schemas/accessSchemas";
import type { Tenancy } from "@/types/accessTypes";
export type { Tenancy } from "@/types/accessTypes";
export { tenancies } from "@/schemas/accessSchemas";

/**
 * Organization mode (AUTH.md §4.3). `hipster-stack new --tenancy` writes it;
 * change it by hand only before the app has users.
 * - "single" (default): one shared organization. Users who finish onboarding
 *   join it with the lowest role; the bootstrap owner joins as OWNER.
 * - "multi": users who finish onboarding without an invitation get their own
 *   organization as OWNER; invited users join the inviting organization.
 */

const configuredTenancy: Tenancy = "single";

/** Validated when the module loads, so a hand edit that slips past the type fails at startup. */
export const tenancy: Tenancy = tenancySchema.parse(configuredTenancy);

/** The single organization's slug when `tenancy` is "single". */
export const SINGLE_ORGANIZATION_SLUG = "main";

/**
 * The single organization's id when `tenancy` is "single". Fixed so joining
 * can set the RLS context before the row is visible; it matches the seed
 * organization (prisma/seeds/base.ts), so seeded data lives in it.
 */
export const SINGLE_ORGANIZATION_ID = "00000000-0000-4000-8000-000000000010";

/** The memberships a user can act through: under single tenancy, only the shared organization's. */
export function activeMembershipScope(userId: string) {
  return {
    userId,
    status: "ACTIVE",
    ...(tenancy === "single" ? { organizationId: SINGLE_ORGANIZATION_ID } : {}),
  } as const;
}
