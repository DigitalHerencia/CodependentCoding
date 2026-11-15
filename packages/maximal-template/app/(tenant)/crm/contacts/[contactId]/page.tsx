import { Suspense } from "react";

import { CrmContactDetailFeature } from "@/features/crm/crmContactDetailFeature";
import { CrmContactDetailSkeleton } from "@/features/crm/crmSkeletons";

/** Declare or implement the CRM-specific contract named Page. */
export default async function Page({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  return (
    <Suspense fallback={<CrmContactDetailSkeleton />}>
      <CrmContactDetailFeature contactId={contactId} />
    </Suspense>
  );
}
