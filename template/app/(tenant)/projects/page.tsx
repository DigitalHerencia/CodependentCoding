// Why: Route only: streams the project portfolio behind a skeleton.
import { Suspense } from "react";

import { ProjectsFeature } from "@/features/projects/projects-feature";
import { ProjectsSkeleton } from "@/features/projects/projects-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsFeature />
    </Suspense>
  );
}
