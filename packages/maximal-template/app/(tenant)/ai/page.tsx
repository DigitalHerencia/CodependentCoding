import type { AiRoutePageProps } from "@/types/aiTypes";
import { Suspense } from "react";
import { AiOverviewFeature } from "@/features/ai/aiOverviewFeature";
import { AiOverviewSkeleton } from "@/features/ai/aiOverviewSkeleton";

/** The tenant route owns composition and its matching loading boundary. */
export default function Page({ searchParams }: AiRoutePageProps) {
  return (
    <Suspense fallback={<AiOverviewSkeleton />}>
      <AiOverviewFeature criteria={searchParams} />
    </Suspense>
  );
}
