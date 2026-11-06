import { getCurrentOrganization } from "@/lib/fetchers/organizationFetchers";
import { installedModules } from "@/lib/modules/registry";
import "server-only";

export async function loadDashboardWorkflow() {
  const organization = await getCurrentOrganization();
  return {
    organization,
    workspaces: installedModules.flatMap(({ dashboard }) => dashboard ?? []),
  };
}
