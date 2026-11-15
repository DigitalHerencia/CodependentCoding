import { CrmAnalyticsTemplate } from "@/components/templates/crm-templates";
import { loadCrmAnalyticsWorkflow } from "@/lib/workflows/crmWorkflows";

/** Compose the authorized CRM workflow and the route presentation. */
export async function CrmAnalyticsFeature() {
  const view = await loadCrmAnalyticsWorkflow();
  return <CrmAnalyticsTemplate {...view} />;
}
