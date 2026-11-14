import type { ReactNode } from "react";

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
    <section aria-labelledby="dashboard-heading" className="min-w-0 p-4">
      <div className={preferences.compactView ? "space-y-3" : "space-y-6"}>
        <header className="border-b border-foreground/30 pb-4">
          <h1 id="dashboard-heading" className="type-title text-foreground">
            {organization.name}
          </h1>
        </header>
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
    </section>
  );
}
