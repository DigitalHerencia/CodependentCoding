import "server-only";

import { z } from "zod";

/**
 * Organization mode (AUTH.md §4.3). `hipster-stack new --tenancy` writes it;
 * change it by hand only before the app has users.
 * - "multi": memberships are scoped to individual workspaces.
 * - "single": the configured bootstrap owner provisions the shared workspace.
 */
export const tenancies = ["multi", "single"] as const;
export type Tenancy = (typeof tenancies)[number];

const configuredTenancy: Tenancy = "multi";

/** Validated when the module loads, so a hand edit that slips past the type fails at startup. */
export const tenancy: Tenancy = z.enum(tenancies).parse(configuredTenancy);

/** The single organization's slug when `tenancy` is "single". */
export const SINGLE_ORGANIZATION_SLUG = "main";
