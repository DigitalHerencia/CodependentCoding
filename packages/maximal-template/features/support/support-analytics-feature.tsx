import { SupportAnalyticsTemplate } from "@/components/templates/support-templates";
import { loadSupportAnalyticsWorkflow } from "@/lib/workflows/supportWorkflows";

export async function SupportAnalyticsFeature() {
  const view = await loadSupportAnalyticsWorkflow();
  return <SupportAnalyticsTemplate {...view} />;
}
