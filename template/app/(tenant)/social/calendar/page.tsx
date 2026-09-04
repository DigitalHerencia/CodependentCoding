import { Suspense } from "react";

import { CalendarFeature } from "@/features/social/calendarFeature";
import { CalendarSkeleton } from "@/features/social/calendarSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarFeature />
    </Suspense>
  );
}
