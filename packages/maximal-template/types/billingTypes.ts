import type { SubscriptionStatus } from "@/generated/prisma/enums";

export type BillingSubscriptionDTO = {
  planKey: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

/** Read-only billing presentation supplied by the authorized owner fetcher. */
export type BillingSubscriptionPresentationProps = {
  subscription: BillingSubscriptionDTO | null;
};

export type BillingProviderStateDTO = {
  id: string;
  organizationId: string;
  provider: string;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  planKey: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReconcileBillingProviderStateCommand = {
  provider: string;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  planKey: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
};
