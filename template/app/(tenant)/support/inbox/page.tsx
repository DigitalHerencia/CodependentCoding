import { Suspense } from "react";

import { InboxFeature } from "@/features/support/inboxFeature";
import { InboxSkeleton } from "@/features/support/inboxSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxFeature />
    </Suspense>
  );
}
