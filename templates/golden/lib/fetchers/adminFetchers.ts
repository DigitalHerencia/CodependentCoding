import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { requireApplicationAdminContext } from "@/lib/auth/session"
import { getPrisma } from "@/lib/db/prisma"

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
