import { Suspense } from "react";

import { AiPlaygroundFeature } from "@/features/ai/ai-playground-feature";
import { AiPlaygroundSkeleton } from "@/features/ai/ai-playground-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AiPlaygroundSkeleton />}>
      <AiPlaygroundFeature />
    </Suspense>
  );
}
