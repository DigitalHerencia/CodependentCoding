// Why: Route only: streams the signed-in member's open tasks behind a skeleton.
import { Suspense } from "react";

import { MyTasksFeature } from "@/features/projects/my-tasks-feature";
import { MyTasksSkeleton } from "@/features/projects/my-tasks-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<MyTasksSkeleton />}>
      <MyTasksFeature />
    </Suspense>
  );
}
