import { Suspense } from "react";
import { AiPlaygroundFeature } from "@/features/ai/aiPlaygroundFeature";
import { AiPlaygroundSkeleton } from "@/features/ai/aiPlaygroundSkeleton";

/** The tenant route owns composition and its matching loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<AiPlaygroundSkeleton />}>
      <AiPlaygroundFeature />
    </Suspense>
  );
}
