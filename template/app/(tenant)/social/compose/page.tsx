import { Suspense } from "react";

import { ComposerFeature } from "@/features/social/composerFeature";
import { ComposerSkeleton } from "@/features/social/composerSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ComposerSkeleton />}>
      <ComposerFeature />
    </Suspense>
  );
}
