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
