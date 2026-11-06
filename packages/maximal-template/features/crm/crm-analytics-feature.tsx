import { CrmAnalyticsTemplate } from "@/components/templates/crm-templates";
import { loadCrmAnalyticsWorkflow } from "@/lib/workflows/crmWorkflows";

export async function CrmAnalyticsFeature() {
  const view = await loadCrmAnalyticsWorkflow();
  return <CrmAnalyticsTemplate {...view} />;
}
