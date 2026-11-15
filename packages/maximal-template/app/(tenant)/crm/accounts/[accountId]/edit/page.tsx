import { Suspense } from "react";

import { CrmEditAccountFeature } from "@/features/crm/crmEditAccountFeature";
import { CrmFormSkeleton } from "@/features/crm/crmSkeletons";

/** Declare or implement the CRM-specific contract named Page. */
export default async function Page({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <CrmEditAccountFeature accountId={accountId} />
    </Suspense>
  );
}
