// Why: Route only: resolves params and streams the {{entity}} detail.
import { Suspense } from "react";

import { {{Entity}}Feature } from "@/features/{{module}}/{{entity}}Feature";
import { {{Entity}}Skeleton } from "@/features/{{module}}/{{entity}}Skeleton";

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
