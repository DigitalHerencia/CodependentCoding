/** Validated active-organization preferences for authenticated requests. */
import "server-only";

import { cookies } from "next/headers";
import { organizationIdSchema } from "@/schemas/authzSchemas";
import { SINGLE_ORGANIZATION_ID, tenancy } from "./mode";

/** Validate the invitation's trusted tenant context in either tenancy mode. */
export function assertInvitationsAllowed(organizationId: string): void {
  const id = organizationIdSchema.parse(organizationId);
  if (tenancy === "single" && id !== SINGLE_ORGANIZATION_ID)
    throw Object.assign(new Error("Invitation organization is unavailable."), {
      code: "FORBIDDEN",
    });
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
