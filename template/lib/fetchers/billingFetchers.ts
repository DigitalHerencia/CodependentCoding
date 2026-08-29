import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { requireTenantContext } from "@/lib/auth/session"
import { assertCapability } from "@/lib/authz/assertions"
import { withTenantContext } from "@/lib/db/withTenantContext"
import type { BillingSettingsDTO } from "@/types/billingTypes"

export async function hasCoreEntitlement(): Promise<boolean> {
  const context = await requireTenantContext()
  const entitlement = await withTenantContext(context.organization.id, (tx) =>
    tx.billingEntitlement.findUnique({
      where: { organizationId_key: { organizationId: context.organization.id, key: "core" } },
      select: { active: true },
    })
  )
  return entitlement?.active ?? false
}

export async function getBillingSettingsState(): Promise<BillingSettingsDTO> {
  noStore()
  const context = await requireTenantContext()
  assertCapability(context, "billing.manage")
  const state = await withTenantContext(context.organization.id, async (tx) => {
    const [customer, subscription, entitlement] = await Promise.all([
      tx.billingCustomer.findUnique({
        where: { organizationId: context.organization.id },
        select: { id: true },
      }),
      tx.billingSubscription.findUnique({
        where: { organizationId: context.organization.id },
        select: {
          status: true,
          stripePriceId: true,
          cancelAtPeriodEnd: true,
          currentPeriodEnd: true,
        },
      }),
      tx.billingEntitlement.findUnique({
        where: { organizationId_key: { organizationId: context.organization.id, key: "core" } },
        select: { active: true },
      }),
    ])
    return { customer, subscription, entitlement }
  })
  return {
    customerConfigured: Boolean(state.customer),
    entitlementActive: state.entitlement?.active ?? false,
    subscription: state.subscription
      ? {
          status: state.subscription.status,
          priceId: state.subscription.stripePriceId,
          cancelAtPeriodEnd: state.subscription.cancelAtPeriodEnd,
          currentPeriodEnd: state.subscription.currentPeriodEnd?.toISOString() ?? null,
        }
      : null,
  }
}
