import "server-only";

import type {
  BillingProviderStateDTO,
  BillingSubscriptionDTO,
} from "@/types/billingTypes";
import type {
  BillingProviderSubscriptionRecord,
  BillingSubscriptionRecord,
} from "@/lib/db/selects/billingSelects";

export function toBillingSubscriptionDTO(
  record: BillingSubscriptionRecord,
): BillingSubscriptionDTO {
  return {
    ...record,
    currentPeriodEnd: record.currentPeriodEnd?.toISOString() ?? null,
  };
}

export function toBillingProviderStateDTO(
  record: BillingProviderSubscriptionRecord,
): BillingProviderStateDTO {
  return {
    ...record,
    currentPeriodEnd: record.currentPeriodEnd?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
