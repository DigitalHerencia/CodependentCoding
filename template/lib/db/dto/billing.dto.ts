import type { BillingSubscriptionDTO } from "@/types/billingTypes";
import type { BillingSubscriptionRecord } from "@/lib/db/selects/billing.selects";

export function toBillingSubscriptionDTO(
  record: BillingSubscriptionRecord,
): BillingSubscriptionDTO {
  return {
    ...record,
    currentPeriodEnd: record.currentPeriodEnd?.toISOString() ?? null,
  };
}
