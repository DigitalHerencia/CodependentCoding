import "server-only";

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

export { invitationSelect } from "@/lib/db/selects/invitationSelects";
export type { InvitationRecord } from "@/lib/db/selects/invitationSelects";
