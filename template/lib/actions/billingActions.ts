"use server";

import { reconcileBillingProviderStateSchema } from "@/schemas/billingSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toBillingProviderStateDTO } from "@/lib/db/dto/billing.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import { reconcileBillingProviderStateTx } from "@/lib/db/transactions/billing-reconcile-provider-state.tx";

export async function reconcileBillingProviderState(rawInput: unknown) {
  const input = reconcileBillingProviderStateSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "billing:manage");
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
}
