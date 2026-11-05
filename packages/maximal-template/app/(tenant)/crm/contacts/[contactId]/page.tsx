import { Suspense } from "react";

import { CrmContactDetailFeature } from "@/features/crm/crm-contact-detail-feature";
import { CrmContactDetailSkeleton } from "@/features/crm/crm-contact-detail-skeleton";

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
