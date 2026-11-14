import "server-only";

import type {
  DashboardActivityDTO,
  DashboardOrganizationDTO,
  DashboardPreferencesDTO,
} from "@/types/dashboardTypes";
import type {
  DashboardActivityRecord,
  DashboardOrganizationRecord,
  DashboardPreferenceRecord,
} from "@/lib/db/selects/dashboardSelects";

/** Default view state when a membership has never customized its dashboard. */
export const defaultDashboardPreferences: DashboardPreferencesDTO = {
  showWorkspaces: true,
  showActivity: true,
  compactView: false,
};

/** Convert the selected organization into a transport-safe summary. */
export function toDashboardOrganizationDTO(
  record: DashboardOrganizationRecord,
): DashboardOrganizationDTO {
  return {
    id: record.id,
    name: record.name,
    memberCount: record._count.memberships,
    timezone: record.settings?.timezone ?? "UTC",
  };
}

/** Map persisted settings without exposing organization or membership keys. */
export function toDashboardPreferencesDTO(
  record: DashboardPreferenceRecord | null,
): DashboardPreferencesDTO {
  if (!record) return { ...defaultDashboardPreferences };
  return {
    showWorkspaces: record.showWorkspaces,
    showActivity: record.showActivity,
    compactView: record.compactView,
  };
}

/** Remove database types and internal audit metadata from activity entries. */
export function toDashboardActivityDTO(
  record: DashboardActivityRecord,
): DashboardActivityDTO {
  return {
    id: record.id,
    action: record.action,
    resourceType: record.resourceType,
    createdAt: record.createdAt.toISOString(),
  };
}
