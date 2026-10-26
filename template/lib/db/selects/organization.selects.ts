import type { Prisma } from "@/generated/prisma/client";

export const organizationOverviewSelect = {
  id: true,
  slug: true,
  name: true,
  imageUrl: true,
  settings: {
    select: {
      timezone: true,
      locale: true,
      defaultCurrency: true,
    },
  },
  _count: {
    select: {
      memberships: true,
    },
  },
} satisfies Prisma.OrganizationSelect;

export type OrganizationOverviewRecord = Prisma.OrganizationGetPayload<{
  select: typeof organizationOverviewSelect;
}>;

export const invitationSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  expiresAt: true,
  createdAt: true,
} satisfies Prisma.InvitationSelect;

export type InvitationRecord = Prisma.InvitationGetPayload<{
  select: typeof invitationSelect;
}>;
