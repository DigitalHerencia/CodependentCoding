import Link from "next/link";
import type { ReactNode } from "react";
import type { CampaignDTO } from "@/types/marketingTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
export function MarketingCampaignsTemplate({
  campaigns,
  toolbar,
}: {
  campaigns: CampaignDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Campaign planner" nav={[]} toolbar={toolbar}>
      <div className="space-y-4">
        {[
          "DRAFT",
          "SCHEDULED",
          "ACTIVE",
          "PAUSED",
          "COMPLETED",
          "CANCELED",
        ].map((status) => {
          const group = campaigns.filter(
            (campaign) => campaign.status === status,
          );
          return (
            <DashboardPanel key={status} title={`${status} · ${group.length}`}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.map((campaign) => (
                  <article
                    className="space-y-3 surface-inset p-4"
                    key={campaign.id}
                  >
                    <Link
                      className="type-label hover:underline"
                      href={`/marketing/campaigns/${campaign.id}`}
                    >
                      {campaign.name}
                    </Link>
                    <p className="line-clamp-2 text-muted-primary">
                      {campaign.description ?? "No campaign brief."}
                    </p>
                    <p>Audience: {campaign.audience?.name ?? "Not selected"}</p>
                    <p>
                      Planned:{" "}
                      {campaign.scheduledAt?.slice(0, 16).replace("T", " ") ??
                        "Unscheduled"}
                    </p>
                    <p>{campaign.stepCount} workflow steps</p>
                  </article>
                ))}
              </div>
              {!group.length && <p>No campaigns in this phase.</p>}
            </DashboardPanel>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
