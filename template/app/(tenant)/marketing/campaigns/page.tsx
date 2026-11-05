import { Suspense } from "react";

import { CampaignsFeature } from "@/features/marketing/campaigns-feature";
import { CampaignsSkeleton } from "@/features/marketing/campaigns-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CampaignsSkeleton />}>
      <CampaignsFeature />
    </Suspense>
  );
}
