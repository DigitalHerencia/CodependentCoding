/** Validated active-organization preferences for authenticated requests. */
import "server-only";

import { cookies } from "next/headers";
import { organizationIdSchema } from "@/schemas/authzSchemas";
import { tenancy } from "./mode";

/** Single tenancy never accepts invitations or administrator approvals. */
export function assertInvitationsAllowed(): void {
  if (tenancy === "single")
    throw Object.assign(
      new Error("Invitations are unavailable in single tenancy."),
      { code: "FORBIDDEN" },
    );
}

/** httpOnly cookie holding the organization the user last chose (AUTH.md §4.1). */
export const ACTIVE_ORGANIZATION_COOKIE = "active-org";

/**
 * The organization the user prefers. A preference, not authority: the
 * tenancy wrapper (lib/db/tenancy.ts) re-validates it against an ACTIVE
 * membership on every request and falls back to the oldest one.
 */
export async function getActiveOrganizationPreference(): Promise<
  string | null
> {
  const parsed = organizationIdSchema.safeParse(
    (await cookies()).get(ACTIVE_ORGANIZATION_COOKIE)?.value,
  );
  return parsed.success ? parsed.data : null;
}

/** Call only after the caller's ACTIVE membership in `id` has been checked. */
export async function setActiveOrganizationPreference(
  id: string,
): Promise<void> {
  (await cookies()).set(
    ACTIVE_ORGANIZATION_COOKIE,
    organizationIdSchema.parse(id),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    },
  );
}
