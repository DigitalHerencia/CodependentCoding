/** Validated application tenancy configuration and membership scoping. */
import "server-only";

import { tenancySchema } from "@/schemas/authzSchemas";
import type { Tenancy } from "@/types/authzTypes";
export type { Tenancy } from "@/types/authzTypes";
export { tenancies } from "@/lib/constants/authzConstants";

/**
 * Organization mode (AUTH.md §4.3). `hipster-stack new --tenancy` writes it;
 * change it by hand only before the app has users.
 * - "single" (default): one shared organization. The first eligible provisioning
 *   transaction allocates OWNER once; later signups join as VIEWER. Asynchronous
 *   delivery does not guarantee chronological signup order. Allocation survives
 *   owner deletion.
 * - "multi": signups with verified email and no invitation get their own
 *   organization as OWNER; invited users join the inviting organization.
 *   Unverified signups wait before any new organization is created.
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
