import { Suspense } from "react";

import { CrmEditLeadFeature } from "@/features/crm/crmEditLeadFeature";
import { CrmFormSkeleton } from "@/features/crm/crmFormSkeleton";

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
