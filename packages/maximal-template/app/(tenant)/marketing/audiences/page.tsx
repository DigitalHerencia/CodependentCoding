import { Suspense } from "react";
import { AudiencesFeature } from "@/features/marketing/audiences-feature";
import { AudiencesSkeleton } from "@/features/marketing/audiences-skeleton";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<MarketingRouteQuery>;
}) {
  const query = await searchParams;
  return (
    <Suspense key={JSON.stringify(query)} fallback={<AudiencesSkeleton />}>
      <AudiencesFeature query={query} />
    </Suspense>
  );
}
