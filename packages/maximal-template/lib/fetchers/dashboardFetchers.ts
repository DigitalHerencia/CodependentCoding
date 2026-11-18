/** Dashboard Fetchers contracts and composition for the owning application slice. */
import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import {
  toDashboardActivityDTO,
  toDashboardOrganizationDTO,
  toDashboardPreferencesDTO,
} from "@/lib/db/dtos/dashboardDtos";
import {
  dashboardActivitySelect,
  dashboardOrganizationSelect,
  dashboardPreferenceSelect,
} from "@/lib/db/selects/dashboardSelects";
import type { DashboardOverviewDTO } from "@/types/dashboardTypes";

/**
 * Load the active member's dashboard from one authorized, RLS-scoped read.
 *
 * @remarks
 * Organization and membership identity come from the verified session.
 * Audit activity is restricted to the current actor, not the full tenant log.
 */
export async function getDashboardOverview(): Promise<DashboardOverviewDTO> {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "base.dashboard:read");

    const [organization, preference, activities] = await Promise.all([
      tx.organization.findFirstOrThrow({
        where: { id: access.organizationId },
        select: dashboardOrganizationSelect,
      }),
      tx.dashboardPreference.findFirst({
        where: {
          organizationId: access.organizationId,
          membershipId: access.membershipId,
        },
        select: dashboardPreferenceSelect,
      }),
      tx.auditEvent.findMany({
        where: {
          organizationId: access.organizationId,
          actorUserId: access.userId,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 8,
        select: dashboardActivitySelect,
      }),
    ]);

    return {
      organization: toDashboardOrganizationDTO(organization),
      preferences: toDashboardPreferencesDTO(preference),
      activities: activities.map(toDashboardActivityDTO),
    };
  });
}
