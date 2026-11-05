"use client";
import { marketingBlockCopy } from "@/content/marketing";
import Link from "next/link";
import { Input } from "@/components/ui/input";
export function AudiencesToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={marketingBlockCopy.searchAudiences}
        placeholder={marketingBlockCopy.searchAudiences}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Link className="type-link" href="/marketing/audiences/new">
        {marketingBlockCopy.defineAudience}
      </Link>
    </div>
  );
}
export function CampaignsToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={marketingBlockCopy.searchCampaigns}
        placeholder={marketingBlockCopy.searchCampaignOrAudience}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Link className="type-link" href="/marketing/campaigns/new">
        {marketingBlockCopy.planCampaign}
      </Link>
    </div>
  );
}
