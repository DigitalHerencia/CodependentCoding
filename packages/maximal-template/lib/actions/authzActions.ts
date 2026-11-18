"use server";

/** Authenticated mutations for application-owned organization access. */
import { switchOrganizationSchema } from "@/schemas/authzSchemas";
import type { ActionResult } from "@/types/actionTypes";
import { setActiveOrganizationPreference } from "@/lib/authz/tenancy";
import { getVerifiedPrimaryEmail } from "@/lib/integrations/clerk/server";
import { activeMembershipScope } from "@/lib/authz/mode";
import { invalidateAllPaths } from "@/lib/cache/invalidate";
import { withIdentityTransaction } from "@/lib/db/rls";
import { authzIdSelect } from "@/lib/db/selects/authzSelects";
import { provisionWorkspaceAccessTx } from "@/lib/db/selects/authzTx";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { toActionResult } from "@/lib/utils/actionResult";

/**
 * Makes another of the caller's organizations the active one. The cookie is
 * set only after an ACTIVE membership there is confirmed; the tenancy wrapper
 * re-checks it on every request anyway.
 */
export async function switchOrganization(
  rawInput: unknown,
): Promise<ActionResult<{ organizationId: string }>> {
  return toActionResult(async () => {
    const organizationId = await withIdentityTransaction(async (tx, user) => {
      const { organizationId } = switchOrganizationSchema.parse(rawInput);
      const membership = await tx.membership.findFirst({
        where: { organizationId, ...activeMembershipScope(user.id) },
        select: authzIdSelect,
      });
      if (!membership) throw new ResourceNotFoundError("Organization");
      return organizationId;
    });
    await setActiveOrganizationPreference(organizationId);
    invalidateAllPaths();
    return { organizationId };
  });
}

/** Provision workspace membership using only the caller's verified email. */
export async function provisionWorkspaceAccess() {
  return toActionResult(async () => {
    const email = await getVerifiedPrimaryEmail();
    await withIdentityTransaction(async (tx, user) => {
      const verifiedEmail =
        email && email === user.email?.toLowerCase() ? email : null;
      const granted = await provisionWorkspaceAccessTx(
        tx,
        { id: user.id, displayName: user.displayName },
        verifiedEmail,
      );
      if (!granted) throw new ResourceNotFoundError("Workspace access");
    });
  });
}
