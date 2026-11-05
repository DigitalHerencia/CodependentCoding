import { Suspense } from "react";

import { CrmLeadDetailFeature } from "@/features/crm/crm-lead-detail-feature";
import { CrmLeadDetailSkeleton } from "@/features/crm/crm-lead-detail-skeleton";

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
