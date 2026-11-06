import { SharedDashboardTemplate } from "@/components/templates/shared-templates";
import { loadDashboardWorkflow } from "@/lib/workflows/dashboardWorkflows";

export async function DashboardFeature() {
  const { organization, workspaces } = await loadDashboardWorkflow();
  return (
    <SharedDashboardTemplate
      organization={organization}
      workspaces={workspaces}
    />
  );
}
