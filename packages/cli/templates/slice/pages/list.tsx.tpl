// Why: Route only: streams the {{entity}} list behind a skeleton.
import { Suspense } from "react";

import { {{Entities}}Feature } from "@/features/{{module}}/{{entities}}Feature";
import { {{Entities}}Skeleton } from "@/features/{{module}}/{{entities}}Skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<{{Entities}}Skeleton />}>
      <{{Entities}}Feature />
    </Suspense>
  );
}
