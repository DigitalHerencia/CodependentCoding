import {
  MetricGridBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getCampaigns } from "@/lib/fetchers/marketingFetchers";
export async function MarketingAnalyticsFeature() {
  const campaigns = await getCampaigns(100);
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Marketing" title="Campaign analytics" />
      <MetricGridBlock
        metrics={[
          { label: "Campaigns", value: String(campaigns.length) },
          {
            label: "Active",
            value: String(
              campaigns.filter((campaign) => campaign.status === "ACTIVE")
                .length,
            ),
          },
          {
            label: "Scheduled",
            value: String(
              campaigns.filter((campaign) => campaign.status === "SCHEDULED")
                .length,
            ),
          },
          {
            label: "Completed",
            value: String(
              campaigns.filter((campaign) => campaign.status === "COMPLETED")
                .length,
            ),
          },
        ]}
      />
    </div>
  );
}
