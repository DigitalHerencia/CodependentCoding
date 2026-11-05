import { Suspense } from "react";

import { CrmEditContactFeature } from "@/features/crm/crm-edit-contact-feature";
import { CrmFormSkeleton } from "@/features/crm/crm-form-skeleton";

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
