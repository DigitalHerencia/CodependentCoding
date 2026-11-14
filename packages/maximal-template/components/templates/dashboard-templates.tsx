import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/blocks/shared-blocks";
import {
  DashboardActivityBlock,
  DashboardMetricsBlock,
  DashboardOverviewBlock,
  DashboardWorkspacesBlock,
} from "@/components/blocks/dashboard-blocks";
import type { DashboardPageDTO } from "@/types/dashboardTypes";

/**
 * Pure dashboard page arrangement; no authentication, data access, or workflows.
 *
 * @param props Prepared dashboard data and a browser-only preference-control slot.
 */
export function DashboardPageTemplate({
  dashboard,
  preferencesControl,
}: {
  dashboard: DashboardPageDTO;
  preferencesControl: ReactNode;
}) {
  const { organization, preferences, activities, workspaces } = dashboard;
  return (
    <DashboardLayout title={organization.name} nav={[]}>
      <div className={preferences.compactView ? "space-y-3" : "space-y-6"}>
        <DashboardOverviewBlock organization={organization} />
        <DashboardMetricsBlock
          memberCount={organization.memberCount}
          workspaceCount={workspaces.length}
          activityCount={activities.length}
        />
        {preferences.showWorkspaces && (
          <DashboardWorkspacesBlock
            workspaces={workspaces}
            compact={preferences.compactView}
          />
        )}
        {preferences.showActivity && <DashboardActivityBlock activities={activities} />}
        {preferencesControl}
      </div>
    </DashboardLayout>
  );
}
