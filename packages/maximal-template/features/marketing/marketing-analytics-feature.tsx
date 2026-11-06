import { MarketingAnalyticsTemplate } from "@/components/templates/marketing-templates";
import { loadMarketingAnalyticsWorkflow } from "@/lib/workflows/marketingWorkflows";

export async function MarketingAnalyticsFeature() {
  const { campaigns } = await loadMarketingAnalyticsWorkflow();
  return <MarketingAnalyticsTemplate campaigns={campaigns} />;
}
