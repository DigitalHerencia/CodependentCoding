import "server-only";

import { saveDashboardPreferences } from "@/lib/actions/dashboardActions";
import { getDashboardOverview } from "@/lib/fetchers/dashboardFetchers";
import { installedModules } from "@/lib/modules/registry";
import type {
  DashboardPageDTO,
  DashboardSavePreferencesAction,
} from "@/types/dashboardTypes";

/** Server-side dashboard contract consumed only by the dashboard feature. */
export type DashboardWorkflowResult = {
  dashboard: DashboardPageDTO;
  savePreferences: DashboardSavePreferencesAction;
};

/**
 * Orchestrate the authorized dashboard read and expose its existing Server
 * Action as a serializable reference to the feature.
 *
 * @remarks
 * The action is invoked only after user interaction; loading the dashboard
 * never writes preferences. Client code never imports this server-only module.
 */
export async function loadDashboardWorkflow(): Promise<DashboardWorkflowResult> {
  const overview = await getDashboardOverview();
  return {
    dashboard: {
      ...overview,
      workspaces: installedModules.flatMap(({ dashboard }) => dashboard ?? []),
    },
    savePreferences: saveDashboardPreferences,
  };
}
