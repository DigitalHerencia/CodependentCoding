import { Suspense } from "react";

import { CrmAccountDetailFeature } from "@/features/crm/crmAccountDetailFeature";
import { CrmAccountDetailSkeleton } from "@/features/crm/crmSkeletons";

/** Declare or implement the CRM-specific contract named Page. */
export default async function Page({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  return (
    <Suspense fallback={<CrmAccountDetailSkeleton />}>
      <CrmAccountDetailFeature accountId={accountId} />
    </Suspense>
  );
}
