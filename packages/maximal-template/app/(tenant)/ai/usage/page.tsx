import type { AiRoutePageProps } from "@/types/aiTypes";
import { Suspense } from "react";
import { AiUsageFeature } from "@/features/ai/aiUsageFeature";
import { AiUsageSkeleton } from "@/features/ai/aiUsageSkeleton";

/** The tenant route owns composition and its matching loading boundary. */
export default function Page({ searchParams }: AiRoutePageProps) {
  return (
    <Suspense fallback={<AiUsageSkeleton />}>
      <AiUsageFeature criteria={searchParams} />
    </Suspense>
  );
}
