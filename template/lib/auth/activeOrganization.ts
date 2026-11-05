import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

/** httpOnly cookie holding the organization the user last chose (AUTH.md §4.1). */
export const ACTIVE_ORGANIZATION_COOKIE = "active-org";

const organizationId = z.uuid();

/**
 * The organization the user prefers. A preference, not authority: the
 * tenancy wrapper (lib/db/tenant.ts) re-validates it against an ACTIVE
 * membership on every request and falls back to the oldest one.
 */
export async function getActiveOrganizationPreference(): Promise<
  string | null
> {
  const parsed = organizationId.safeParse(
    (await cookies()).get(ACTIVE_ORGANIZATION_COOKIE)?.value,
  );
  return parsed.success ? parsed.data : null;
}

/** Call only after the caller's ACTIVE membership in `id` has been checked. */
export async function setActiveOrganizationPreference(
  id: string,
): Promise<void> {
  (await cookies()).set(ACTIVE_ORGANIZATION_COOKIE, organizationId.parse(id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
