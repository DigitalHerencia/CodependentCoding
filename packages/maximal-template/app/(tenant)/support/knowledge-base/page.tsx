import { Suspense } from "react";

import { KnowledgeBaseFeature } from "@/features/support/knowledge-base-feature";
import { KnowledgeBaseSkeleton } from "@/features/support/knowledge-base-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<KnowledgeBaseSkeleton />}>
      <KnowledgeBaseFeature />
    </Suspense>
  );
}
