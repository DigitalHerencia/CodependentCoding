import { Suspense } from "react";

import { CalendarFeature } from "@/features/social/calendar-feature";
import { CalendarSkeleton } from "@/features/social/calendar-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarFeature />
    </Suspense>
  );
}
