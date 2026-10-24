import type { Prisma } from "@/generated/prisma/client";

export const billingSubscriptionSelect = {
  planKey: true,
  status: true,
  currentPeriodEnd: true,
  cancelAtPeriodEnd: true,
} satisfies Prisma.BillingSubscriptionSelect;

export type BillingSubscriptionRecord = Prisma.BillingSubscriptionGetPayload<{
  select: typeof billingSubscriptionSelect;
}>;

export const billingProviderSubscriptionSelect = {
  id: true,
  organizationId: true,
  provider: true,
  providerCustomerId: true,
  providerSubscriptionId: true,
  planKey: true,
  status: true,
  currentPeriodEnd: true,
  cancelAtPeriodEnd: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BillingSubscriptionSelect;

export type BillingProviderSubscriptionRecord =
  Prisma.BillingSubscriptionGetPayload<{
    select: typeof billingProviderSubscriptionSelect;
  }>;
