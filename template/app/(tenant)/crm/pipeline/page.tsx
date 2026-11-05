import { Suspense } from "react";

import { CrmPipelineFeature } from "@/features/crm/crm-pipeline-feature";
import { CrmPipelineSkeleton } from "@/features/crm/crm-pipeline-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CrmPipelineSkeleton />}>
      <CrmPipelineFeature />
    </Suspense>
  );
}
