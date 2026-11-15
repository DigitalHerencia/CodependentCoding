import { Suspense } from "react";

import { CrmLeadDetailFeature } from "@/features/crm/crmLeadDetailFeature";
import { CrmLeadDetailSkeleton } from "@/features/crm/crmSkeletons";

/** Declare or implement the CRM-specific contract named Page. */
export default async function Page({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  return (
    <Suspense fallback={<CrmLeadDetailSkeleton />}>
      <CrmLeadDetailFeature leadId={leadId} />
    </Suspense>
  );
}
