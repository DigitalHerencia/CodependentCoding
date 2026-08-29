import { Suspense } from "react";

import { ContactDetailSkeleton } from "@/features/crm/contactDetailSkeleton";
import { ContactEditFeature } from "@/features/crm/contactEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  return (
    <Suspense fallback={<ContactDetailSkeleton />}>
      <ContactEditFeature contactId={contactId} />
    </Suspense>
  );
}
