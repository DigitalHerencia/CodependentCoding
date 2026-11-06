import "server-only";

import { tenancySchema } from "@/schemas/accessSchemas";
import type { Tenancy } from "@/types/accessTypes";
export type { Tenancy } from "@/types/accessTypes";
export { tenancies } from "@/schemas/accessSchemas";

/**
 * Organization mode (AUTH.md §4.3). `hipster-stack new --tenancy` writes it;
 * change it by hand only before the app has users.
 * - "multi": memberships are scoped to individual workspaces.
 * - "single": the configured bootstrap owner provisions the shared workspace.
 */

const configuredTenancy: Tenancy = "multi";

/** Validated when the module loads, so a hand edit that slips past the type fails at startup. */
export const tenancy: Tenancy = tenancySchema.parse(configuredTenancy);

/** The single organization's slug when `tenancy` is "single". */
export const SINGLE_ORGANIZATION_SLUG = "main";
