import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"

export const adminUserSelect = {
  id: true,
  displayName: true,
  email: true,
  status: true,
  isApplicationAdmin: true,
  createdAt: true,
} satisfies Prisma.UserSelect

export const adminOrganizationSelect = {
  id: true,
  name: true,
  slug: true,
  status: true,
  createdAt: true,
  _count: { select: { memberships: true, projects: true } },
} satisfies Prisma.OrganizationSelect

export const adminBillingSelect = {
  id: true,
  status: true,
  stripePriceId: true,
  cancelAtPeriodEnd: true,
  currentPeriodEnd: true,
  updatedAt: true,
  organization: { select: { name: true, slug: true } },
} satisfies Prisma.BillingSubscriptionSelect

export const adminWebhookSelect = {
  id: true,
  provider: true,
  eventType: true,
  status: true,
  attemptCount: true,
  receivedAt: true,
  processedAt: true,
  processingError: true,
} satisfies Prisma.ProviderWebhookEventSelect
