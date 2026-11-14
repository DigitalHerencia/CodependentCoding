"use server";

import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidatePaths } from "@/lib/cache/invalidate";
import { withTenantTransaction } from "@/lib/db/tenant";
import { saveDashboardPreferencesTx } from "@/lib/db/transactions/dashboardSavePreferencesTx";
import { toActionResult } from "@/lib/utils/actionResult";
import { dashboardPreferencesSchema } from "@/schemas/dashboardSchemas";
import type { ActionResult } from "@/types/actionTypes";
import type { DashboardPreferencesDTO } from "@/types/dashboardTypes";

/**
 * Save the current membership's dashboard preferences.
 *
 * @param rawInput Untrusted browser values, never tenant identifiers.
 * @returns A client-safe action result containing the saved preferences.
 */
export async function saveDashboardPreferences(
  rawInput: unknown,
): Promise<ActionResult<DashboardPreferencesDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "base.dashboard:update");
      const preferences = dashboardPreferencesSchema.parse(rawInput);
      return saveDashboardPreferencesTx(tx, {
        organizationId: access.organizationId,
        membershipId: access.membershipId,
        actorUserId: access.userId,
        preferences,
      });
    });

    invalidatePaths(["/dashboard"]);
    return saved;
  });
}
