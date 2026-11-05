import { Suspense } from "react";

import { ComposerFeature } from "@/features/social/composer-feature";
import { ComposerSkeleton } from "@/features/social/composer-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ComposerSkeleton />}>
      <ComposerFeature />
    </Suspense>
  );
}
