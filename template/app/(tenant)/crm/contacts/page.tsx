import { Suspense } from "react";

import { ContactsFeature } from "@/features/crm/contactsFeature";
import { ContactsSkeleton } from "@/features/crm/contactsSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<ContactsSkeleton />}>
      <ContactsFeature />
    </Suspense>
  );
}
