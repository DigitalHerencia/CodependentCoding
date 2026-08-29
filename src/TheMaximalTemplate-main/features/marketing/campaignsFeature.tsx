import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getCampaigns } from "@/lib/fetchers/marketingFetchers";
export async function CampaignsFeature() {
  const campaigns = await getCampaigns();
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Marketing" title="Campaigns" />
      <DataTableBlock
        columns={[
          { key: "name", label: "Campaign" },
          { key: "audience", label: "Audience" },
          { key: "status", label: "Status" },
          { key: "schedule", label: "Schedule" },
        ]}
        rows={campaigns.map((campaign) => ({
          id: campaign.id,
          cells: {
            name: campaign.name,
            audience: campaign.audience?.name ?? null,
            status: campaign.status,
            schedule: campaign.scheduledAt
              ? new Date(campaign.scheduledAt).toLocaleString()
              : null,
          },
        }))}
      />
    </div>
  );
}
