import { Suspense } from "react";

import { AiUsageFeature } from "@/features/ai/ai-usage-feature";
import { AiUsageSkeleton } from "@/features/ai/ai-usage-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AiUsageSkeleton />}>
      <AiUsageFeature />
    </Suspense>
  );
}
