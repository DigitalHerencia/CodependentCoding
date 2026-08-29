import { Suspense } from "react";

import { ContactDetailFeature } from "@/features/crm/contactDetailFeature";
import { ContactDetailSkeleton } from "@/features/crm/contactDetailSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  return (
    <Suspense fallback={<ContactDetailSkeleton />}>
      <ContactDetailFeature contactId={contactId} />
    </Suspense>
  );
}
