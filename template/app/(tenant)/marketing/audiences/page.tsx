import { Suspense } from "react";

import { AudiencesFeature } from "@/features/marketing/audiencesFeature";
import { AudiencesSkeleton } from "@/features/marketing/audiencesSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AudiencesSkeleton />}>
      <AudiencesFeature />
    </Suspense>
  );
}
