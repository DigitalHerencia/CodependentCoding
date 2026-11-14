import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Minimal organization projection for the tenant dashboard. */
export const dashboardOrganizationSelect = {
  id: true,
  name: true,
  settings: { select: { timezone: true } },
  _count: { select: { memberships: true } },
} satisfies Prisma.OrganizationSelect;

/** Prisma record type for the organization projection. */
export type DashboardOrganizationRecord = Prisma.OrganizationGetPayload<{
  select: typeof dashboardOrganizationSelect;
}>;

/** Fields needed for one member's dashboard preferences. */
export const dashboardPreferenceSelect = {
  id: true,
  showWorkspaces: true,
  showActivity: true,
  compactView: true,
} satisfies Prisma.DashboardPreferenceSelect;

/** Prisma record type for dashboard preferences. */
export type DashboardPreferenceRecord = Prisma.DashboardPreferenceGetPayload<{
  select: typeof dashboardPreferenceSelect;
}>;

/** An explicitly scoped audit projection, excluding sensitive metadata. */
export const dashboardActivitySelect = {
  id: true,
  action: true,
  resourceType: true,
  createdAt: true,
} satisfies Prisma.AuditEventSelect;

/** Prisma record type for the audit projection. */
export type DashboardActivityRecord = Prisma.AuditEventGetPayload<{
  select: typeof dashboardActivitySelect;
}>;
