import { Suspense } from "react";

import { InboxFeature } from "@/features/support/inbox-feature";
import { InboxSkeleton } from "@/features/support/inbox-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxFeature />
    </Suspense>
  );
}
