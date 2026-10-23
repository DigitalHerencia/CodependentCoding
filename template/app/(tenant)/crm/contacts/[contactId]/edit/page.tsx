import { Suspense } from "react";

import { CrmEditContactFeature } from "@/features/crm/crmEditContactFeature";
import { CrmFormSkeleton } from "@/features/crm/crmFormSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <CrmEditContactFeature contactId={contactId} />
    </Suspense>
  );
}
