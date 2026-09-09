import type { CampaignDTO } from "@/types/marketingTypes";
import {
  DashboardLayout,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
export function MarketingAnalyticsTemplate({
  campaigns,
}: {
  campaigns: CampaignDTO[];
}) {
  return (
    <DashboardLayout title="Campaign operations" nav={[]}>
      <p>
        Lifecycle snapshot of {campaigns.length} loaded campaigns. Delivery and
        engagement rates require recorded provider events.
      </p>
      <DashboardTable
        columns={[
          { key: "name", label: "Campaign" },
          { key: "audience", label: "Audience" },
          { key: "status", label: "Lifecycle" },
          { key: "scheduled", label: "Scheduled" },
          { key: "steps", label: "Steps" },
        ]}
        rows={campaigns.map((campaign) => ({
          id: campaign.id,
          href: `/marketing/campaigns/${campaign.id}`,
          cells: {
            name: campaign.name,
            audience: campaign.audience?.name,
            status: campaign.status,
            scheduled: campaign.scheduledAt,
            steps: campaign.stepCount,
          },
        }))}
      />
    </DashboardLayout>
  );
}
