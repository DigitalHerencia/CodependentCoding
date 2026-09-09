"use client";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MarketingCampaignsTemplate } from "@/components/templates/marketingCampaignsTemplate";
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
      toolbar={
        <div className="flex flex-wrap gap-3">
          <Input
            aria-label="Search campaigns"
            placeholder="Search campaign or audience"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Link className="type-link" href="/marketing/campaigns/new">
            Plan campaign
          </Link>
        </div>
      }
    />
  );
}
