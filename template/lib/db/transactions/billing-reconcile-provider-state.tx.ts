import "server-only";

import type { Prisma, SubscriptionStatus } from "@/generated/prisma/client";

import { billingProviderSubscriptionSelect } from "@/lib/db/selects/billing.selects";

export async function reconcileBillingProviderStateTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    provider: string;
    providerCustomerId?: string | null;
    providerSubscriptionId?: string | null;
    planKey: string;
    status: SubscriptionStatus;
    currentPeriodEnd?: Date | null;
    cancelAtPeriodEnd: boolean;
  },
) {
  const subscription = await tx.billingSubscription.upsert({
    where: { organizationId: input.organizationId },
    create: {
      organizationId: input.organizationId,
      provider: input.provider,
      providerCustomerId: input.providerCustomerId ?? null,
      providerSubscriptionId: input.providerSubscriptionId ?? null,
      planKey: input.planKey,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    },
    update: {
      provider: input.provider,
      providerCustomerId: input.providerCustomerId ?? null,
      providerSubscriptionId: input.providerSubscriptionId ?? null,
      planKey: input.planKey,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    },
    select: billingProviderSubscriptionSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "billing.provider.reconciled",
      resourceType: "BillingSubscription",
      resourceId: subscription.id,
      metadata: {
        provider: subscription.provider,
        status: subscription.status,
      },
    },
  });
  return subscription;
}
