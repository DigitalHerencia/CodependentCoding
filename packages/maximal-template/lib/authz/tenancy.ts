/** Validated active-organization preferences for authenticated requests. */
import "server-only";

import { cookies } from "next/headers";
import { organizationIdSchema } from "@/schemas/authzSchemas";
import { SINGLE_ORGANIZATION_ID, tenancy } from "./mode";
import { activeMembershipScope } from "./mode";
import { authorizationMembershipSelect } from "@/lib/db/selects/authzSelects";
import type { Prisma } from "@/generated/prisma/client";
import type {
  AccessContext,
  CapturedTenantAuthority,
} from "@/types/authzTypes";
import type { AuthenticatedIdentity } from "@/types/authTypes";

/**
 * Recheck the original membership after external work, without selecting another tenant.
 * The shared row lock prevents membership suspension, transfer or restriction changes
 * until the protected transition commits. Call after setting the captured tenant's RLS.
 */
export async function resolveCapturedAccessTx(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
  captured: CapturedTenantAuthority,
): Promise<AccessContext> {
  if (captured.userId !== identity.clerkUserId)
    throw Object.assign(
      new Error("The original request authority is unavailable."),
      { code: "FORBIDDEN" },
    );
  await tx.$queryRaw`SELECT "id" FROM "Membership" WHERE "id" = ${captured.membershipId}::uuid AND "organizationId" = ${captured.organizationId}::uuid AND "userId" = ${captured.userId} FOR SHARE`;
  const membership = await tx.membership.findFirst({
    where: {
      ...activeMembershipScope(captured.userId),
      id: captured.membershipId,
      organizationId: captured.organizationId,
    },
    select: authorizationMembershipSelect,
  });
  if (
    !membership ||
    (tenancy === "single" &&
      membership.organizationId !== SINGLE_ORGANIZATION_ID)
  )
    throw Object.assign(
      new Error("The original request authority is unavailable."),
      { code: "FORBIDDEN" },
    );
  return {
    ...identity,
    ...captured,
    role: membership.role,
    deniedPermissions: membership.deniedPermissions,
  };
}

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
