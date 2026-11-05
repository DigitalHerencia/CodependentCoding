// Why: Route only: resolves params and streams the {{entity}} detail.
import { Suspense } from "react";

import { {{Entity}}Feature } from "@/features/{{module}}/{{entityPath}}-feature";
import { {{Entity}}Skeleton } from "@/features/{{module}}/{{entityPath}}-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ {{param}}: string }>;
}) {
  const { {{param}} } = await params;
  return (
    <Suspense fallback={<{{Entity}}Skeleton />}>
      <{{Entity}}Feature {{param}}={{{param}}} />
    </Suspense>
  );
}
