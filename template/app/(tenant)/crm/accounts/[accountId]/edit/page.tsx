import { Suspense } from "react";

import { CrmEditAccountFeature } from "@/features/crm/crm-edit-account-feature";
import { CrmFormSkeleton } from "@/features/crm/crm-form-skeleton";

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
