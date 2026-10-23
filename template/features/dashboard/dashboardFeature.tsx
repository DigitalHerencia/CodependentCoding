import { getCurrentOrganization } from "@/lib/fetchers/organizationFetchers";
import { installedModules } from "@/lib/modules/registry";
import { SharedDashboardTemplate } from "@/components/templates/sharedDashboardTemplate";
export async function DashboardFeature() {
  return (
    <SharedDashboardTemplate
      organization={await getCurrentOrganization()}
      workspaces={installedModules.flatMap(({ dashboard }) => dashboard ?? [])}
    />
  );
}
