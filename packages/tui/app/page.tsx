// Why: the home screen: the command center behind its loading state.
import { Suspense } from "react";

import { WorkspaceFeature } from "@/features/workspace/workspaceFeature";
import { WorkspaceSkeleton } from "@/features/workspace/workspaceSkeleton";

export function HomePage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <WorkspaceFeature />
    </Suspense>
  );
}
