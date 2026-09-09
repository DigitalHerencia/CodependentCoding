import { getCampaigns } from "@/lib/fetchers/marketingFetchers";
import { MarketingAnalyticsTemplate } from "@/components/templates/marketingAnalyticsTemplate";
export async function MarketingAnalyticsFeature() {
  return <MarketingAnalyticsTemplate campaigns={await getCampaigns(100)} />;
}
