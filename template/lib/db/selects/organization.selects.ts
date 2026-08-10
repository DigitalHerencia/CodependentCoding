import "server-only"

import type { Prisma } from "@/prisma/generated/prisma/client"

export const organizationSettingsSelect = {
  id: true,
  name: true,
  slug: true,
  status: true,
} satisfies Prisma.OrganizationSelect

export const teamMemberSelect = {
  id: true,
  role: true,
  createdAt: true,
  user: { select: { id: true, displayName: true, email: true } },
} satisfies Prisma.MembershipSelect
