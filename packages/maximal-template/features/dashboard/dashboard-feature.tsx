import { DashboardPageTemplate } from "@/components/templates/dashboard-templates";
import { loadDashboardWorkflow } from "@/lib/workflows/dashboardWorkflows";
import { DashboardFeatureClient } from "./dashboard-feature.client";

/** Server feature orchestrating its workflow, template and client action slot. */
export async function DashboardFeature() {
  const { dashboard, savePreferences } = await loadDashboardWorkflow();

  return (
    <DashboardPageTemplate
      dashboard={dashboard}
      preferencesControl={
        <DashboardFeatureClient
          key={dashboard.organization.id}
          initialPreferences={dashboard.preferences}
          savePreferences={savePreferences}
        />
      }
    />
  );
}
