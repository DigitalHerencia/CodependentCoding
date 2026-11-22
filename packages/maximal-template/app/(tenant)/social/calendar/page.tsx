import { Suspense } from "react";
import { SocialCalendarFeature } from "@/features/social/socialCalendarFeature";
import { SocialCalendarSkeleton } from "@/features/social/socialCalendarSkeleton";

/** Preserve the tenant-shell route with its social loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<SocialCalendarSkeleton />}>
      <SocialCalendarFeature />
    </Suspense>
  );
}
