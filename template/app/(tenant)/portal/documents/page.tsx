import { Suspense } from "react";

import { DocumentsFeature } from "@/features/portal/documents-feature";
import { DocumentsSkeleton } from "@/features/portal/documents-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<DocumentsSkeleton />}>
      <DocumentsFeature />
    </Suspense>
  );
}
