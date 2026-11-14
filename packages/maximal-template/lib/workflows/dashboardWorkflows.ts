import "server-only";

import { getDashboardOverview } from "@/lib/fetchers/dashboardFetchers";
import { installedModules } from "@/lib/modules/registry";
import type { DashboardPageDTO } from "@/types/dashboardTypes";

/**
 * Assemble the tenant dashboard view model from authorized reads and
 * the application's installed-module registry.
 */
export async function loadDashboardWorkflow(): Promise<DashboardPageDTO> {
  const overview = await getDashboardOverview();
  return {
    ...overview,
    workspaces: installedModules.flatMap(({ dashboard }) => dashboard ?? []),
  };
}
