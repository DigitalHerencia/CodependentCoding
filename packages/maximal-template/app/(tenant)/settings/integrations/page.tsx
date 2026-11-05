import { Suspense } from "react";

import { IntegrationsFeature } from "@/features/settings/integrations-feature";
import { IntegrationsSkeleton } from "@/features/settings/integrations-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<IntegrationsSkeleton />}>
      <IntegrationsFeature />
    </Suspense>
  );
}
