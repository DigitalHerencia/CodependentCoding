"use client";
import { CampaignsToolbar } from "@/components/blocks/marketing-blocks";
import { useState } from "react";
import { MarketingCampaignsTemplate } from "@/components/templates/marketing-templates";
import type { CampaignDTO } from "@/types/marketingTypes";
export function CampaignsFeatureClient({
  campaigns,
}: {
  campaigns: CampaignDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <MarketingCampaignsTemplate
      campaigns={campaigns.filter((campaign) =>
        `${campaign.name} ${campaign.audience?.name ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<CampaignsToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
