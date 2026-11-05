import { Suspense } from "react";

import { PortalFeature } from "@/features/portal/portal-feature";
import { PortalSkeleton } from "@/features/portal/portal-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<PortalSkeleton />}>
      <PortalFeature />
    </Suspense>
  );
}
