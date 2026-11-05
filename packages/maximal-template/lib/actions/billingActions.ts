"use server";
import { toActionResult } from "@/lib/utils/actionResult";

import { reconcileBillingProviderStateSchema } from "@/schema/billingSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toBillingProviderStateDTO } from "@/lib/db/dtos/billingDtos";
import { withTenantTransaction } from "@/lib/db/tenant";
import { reconcileBillingProviderStateTx } from "@/lib/db/transactions/billingReconcileProviderStateTx";

export async function reconcileBillingProviderState(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();

    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "billing.subscription:manage");
      const input = reconcileBillingProviderStateSchema.parse(rawInput);
      const subscription = await reconcileBillingProviderStateTx(tx, {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        provider: input.provider,
        providerCustomerId: input.providerCustomerId ?? null,
        providerSubscriptionId: input.providerSubscriptionId ?? null,
        planKey: input.planKey,
        status: input.status,
        currentPeriodEnd: input.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: input.cancelAtPeriodEnd,
      });
      return toBillingProviderStateDTO(subscription);
    });
  });
}
