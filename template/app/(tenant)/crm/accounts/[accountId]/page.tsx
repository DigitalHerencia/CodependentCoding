import { Suspense } from "react";

import { CrmAccountDetailFeature } from "@/features/crm/crm-account-detail-feature";
import { CrmAccountDetailSkeleton } from "@/features/crm/crm-account-detail-skeleton";

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
