import "server-only";

import { z } from "zod";

/**
 * Organization mode (AUTH.md §4.3). `hipster-stack new --tenancy` writes it;
 * change it by hand only before the app has users.
 * - "multi": a sign-up without an invitation gets its own organization.
 * - "single": one organization; the first sign-up owns it and everyone else joins by invitation.
 */
export const tenancies = ["multi", "single"] as const;
export type Tenancy = (typeof tenancies)[number];

const configuredTenancy: Tenancy = "multi";

/** Validated when the module loads, so a hand edit that slips past the type fails at startup. */
export const tenancy: Tenancy = z.enum(tenancies).parse(configuredTenancy);

/** The single organization's slug when `tenancy` is "single". */
export const SINGLE_ORGANIZATION_SLUG = "main";
