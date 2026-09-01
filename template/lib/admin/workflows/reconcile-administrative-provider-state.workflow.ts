import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { reconcileAdministrativeProviderStateTx } from "../../db/transactions/adminTransactions";

export async function reconcileAdministrativeProviderStateWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    provider: string;
    providerCustomerId?: string | null;
    providerSubscriptionId?: string | null;
    planKey: string;
    status:
      | "TRIALING"
      | "ACTIVE"
      | "PAST_DUE"
      | "PAUSED"
      | "CANCELED";
    currentPeriodEnd?: Date | null;
    cancelAtPeriodEnd: boolean;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:records");
    const subscription = await reconcileAdministrativeProviderStateTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      ...command,
    });
    return {
      ...subscription,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
  });
}
