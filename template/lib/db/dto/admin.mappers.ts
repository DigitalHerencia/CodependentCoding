import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"
import {
  adminBillingSelect,
  adminOrganizationSelect,
  adminUserSelect,
  adminWebhookSelect,
} from "@/lib/db/selects/admin.selects"
import type {
  AdminBillingDTO,
  AdminOrganizationDTO,
  AdminUserDTO,
  AdminWebhookDTO,
} from "@/types/adminTypes"

type UserRecord = Prisma.UserGetPayload<{ select: typeof adminUserSelect }>
type OrganizationRecord = Prisma.OrganizationGetPayload<{
  select: typeof adminOrganizationSelect
}>
type BillingRecord = Prisma.BillingSubscriptionGetPayload<{
  select: typeof adminBillingSelect
}>
type WebhookRecord = Prisma.ProviderWebhookEventGetPayload<{
  select: typeof adminWebhookSelect
}>

export function mapAdminUserDTO(record: UserRecord): AdminUserDTO {
  return {
    id: record.id,
    displayName: record.displayName ?? record.email ?? "Unnamed user",
    email: record.email,
    status: record.status,
    isApplicationAdmin: record.isApplicationAdmin,
    createdAt: record.createdAt.toISOString(),
  }
}

export function mapAdminOrganizationDTO(record: OrganizationRecord): AdminOrganizationDTO {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    status: record.status,
    memberCount: record._count.memberships,
    projectCount: record._count.projects,
    createdAt: record.createdAt.toISOString(),
  }
}

export function mapAdminBillingDTO(record: BillingRecord): AdminBillingDTO {
  return {
    id: record.id,
    organizationName: record.organization.name,
    organizationSlug: record.organization.slug,
    status: record.status,
    priceId: record.stripePriceId,
    cancelAtPeriodEnd: record.cancelAtPeriodEnd,
    currentPeriodEnd: record.currentPeriodEnd?.toISOString() ?? null,
    updatedAt: record.updatedAt.toISOString(),
  }
}

export function mapAdminWebhookDTO(record: WebhookRecord): AdminWebhookDTO {
  return {
    id: record.id,
    provider: record.provider,
    eventType: record.eventType,
    status: record.status,
    attemptCount: record.attemptCount,
    receivedAt: record.receivedAt.toISOString(),
    processedAt: record.processedAt?.toISOString() ?? null,
    processingError: record.processingError,
  }
}
