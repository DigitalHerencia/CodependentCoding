import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { requireApplicationAdminContext } from "@/lib/auth/session"
import {
  mapAdminBillingDTO,
  mapAdminOrganizationDTO,
  mapAdminUserDTO,
  mapAdminWebhookDTO,
} from "@/lib/db/dto/admin.mappers"
import { getPrisma } from "@/lib/db/prisma"
import {
  adminBillingSelect,
  adminOrganizationSelect,
  adminUserSelect,
  adminWebhookSelect,
} from "@/lib/db/selects/admin.selects"

export async function getAdminOverview() {
  noStore()
  await requireApplicationAdminContext()
  const prisma = getPrisma()
  const [users, webhooks] = await Promise.all([
    prisma.user.count(),
    prisma.providerWebhookEvent.count({ where: { status: { in: ["received", "failed"] } } }),
  ])
  return { users, webhooks }
}

export async function getAdminUsers() {
  noStore()
  await requireApplicationAdminContext()
  const users = await getPrisma().user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: adminUserSelect,
  })
  return users.map(mapAdminUserDTO)
}

export async function getAdminOrganizations() {
  noStore()
  await requireApplicationAdminContext()
  const organizations = await getPrisma().organization.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: adminOrganizationSelect,
  })
  return organizations.map(mapAdminOrganizationDTO)
}

export async function getAdminBilling() {
  noStore()
  await requireApplicationAdminContext()
  const subscriptions = await getPrisma().billingSubscription.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: adminBillingSelect,
  })
  return subscriptions.map(mapAdminBillingDTO)
}

export async function getAdminWebhooks() {
  noStore()
  await requireApplicationAdminContext()
  const webhooks = await getPrisma().providerWebhookEvent.findMany({
    orderBy: { receivedAt: "desc" },
    take: 50,
    select: adminWebhookSelect,
  })
  return webhooks.map(mapAdminWebhookDTO)
}
