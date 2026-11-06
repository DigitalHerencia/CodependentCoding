"use client";

import { MarketingCampaignsTemplate } from "@/components/templates/marketing-templates";
import { selectCampaignsWorkflow } from "@/lib/workflows/marketingClientWorkflows";
import type { CampaignDTO } from "@/types/marketingTypes";
import { useState } from "react";

export function CampaignsFeatureClient({
  campaigns,
}: {
  campaigns: CampaignDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <MarketingCampaignsTemplate
      {...selectCampaignsWorkflow(campaigns, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    />
  );
}
