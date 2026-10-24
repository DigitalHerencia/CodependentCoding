import type { SubscriptionStatus } from "@/generated/prisma/enums";

export interface BillingSubscriptionDTO {
  planKey: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface BillingProviderStateDTO {
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
}

export interface ReconcileBillingProviderStateCommand {
  provider: string;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  planKey: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
}
