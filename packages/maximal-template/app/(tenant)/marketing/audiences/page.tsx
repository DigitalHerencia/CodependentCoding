import { Suspense } from "react";

import { AudiencesFeature } from "@/features/marketing/audiences-feature";
import { AudiencesSkeleton } from "@/features/marketing/audiences-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AudiencesSkeleton />}>
      <AudiencesFeature />
    </Suspense>
  );
}
