import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { toBillingSubscriptionDTO } from "@/lib/db/dto/billing.dto";
import { billingSubscriptionSelect } from "@/lib/db/selects/billing.selects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getBillingSubscription() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "billing:read");
    const subscription = await tx.billingSubscription.findUnique({
      where: { organizationId: access.organizationId },
      select: billingSubscriptionSelect,
    });
    return subscription ? toBillingSubscriptionDTO(subscription) : null;
  });
}
