// Why: the doctrine screen behind its loading state.
import { Suspense } from "react";

import { DoctrineFeature } from "@/features/doctrine/doctrineFeature";
import { DoctrineSkeleton } from "@/features/doctrine/doctrineSkeleton";

export function DoctrinePage() {
  return (
    <Suspense fallback={<DoctrineSkeleton />}>
      <DoctrineFeature />
    </Suspense>
  );
}
