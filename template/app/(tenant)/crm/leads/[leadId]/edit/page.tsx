import { Suspense } from "react";

import { CrmEditLeadFeature } from "@/features/crm/crm-edit-lead-feature";
import { CrmFormSkeleton } from "@/features/crm/crm-form-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <CrmEditLeadFeature leadId={leadId} />
    </Suspense>
  );
}
