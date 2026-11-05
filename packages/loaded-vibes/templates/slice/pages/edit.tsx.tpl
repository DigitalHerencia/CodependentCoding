// Why: Route only: resolves params and streams the {{entity}} edit form.
import { Suspense } from "react";

import { {{Entity}}EditFeature } from "@/features/{{module}}/{{entityPath}}-edit-feature";
import { {{Entity}}FormSkeleton } from "@/features/{{module}}/{{entityPath}}-form-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ {{param}}: string }>;
}) {
  const { {{param}} } = await params;
  return (
    <Suspense fallback={<{{Entity}}FormSkeleton />}>
      <{{Entity}}EditFeature {{param}}={{{param}}} />
    </Suspense>
  );
}
