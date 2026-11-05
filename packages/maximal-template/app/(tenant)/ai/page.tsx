import { Suspense } from "react";

import { AiGenerationFeature } from "@/features/ai/ai-generation-feature";
import { AiGenerationSkeleton } from "@/features/ai/ai-generation-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AiGenerationSkeleton />}>
      <AiGenerationFeature />
    </Suspense>
  );
}
