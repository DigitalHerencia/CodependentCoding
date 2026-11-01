import { getCampaigns } from "@/lib/fetchers/marketingFetchers";
import { MarketingAnalyticsTemplate } from "@/components/templates/marketing-templates";
export async function MarketingAnalyticsFeature() {
  return <MarketingAnalyticsTemplate campaigns={await getCampaigns(100)} />;
}
