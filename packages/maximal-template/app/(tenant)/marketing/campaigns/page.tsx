import { Suspense } from "react";
import { CampaignsFeature } from "@/features/marketing/campaigns-feature";
import { CampaignsSkeleton } from "@/features/marketing/campaigns-skeleton";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<MarketingRouteQuery>;
}) {
  const query = await searchParams;
  return (
    <Suspense key={JSON.stringify(query)} fallback={<CampaignsSkeleton />}>
      <CampaignsFeature query={query} />
    </Suspense>
  );
}
