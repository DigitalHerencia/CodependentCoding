import { DashboardPageTemplate } from "@/components/templates/dashboard-templates";
import { loadDashboardWorkflow } from "@/lib/workflows/dashboardWorkflows";
import { DashboardFeatureClient } from "./dashboard-feature.client";

/** Server feature coordinating the dashboard read and prepared presentation. */
export async function DashboardFeature() {
  const dashboard = await loadDashboardWorkflow();
  return (
    <DashboardPageTemplate
      dashboard={dashboard}
      preferencesControl={
        <DashboardFeatureClient
          key={dashboard.organization.id}
          initialPreferences={dashboard.preferences}
        />
      }
    />
  );
}
