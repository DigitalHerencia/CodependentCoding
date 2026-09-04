import { Suspense } from "react";

import { KnowledgeBaseFeature } from "@/features/support/knowledgeBaseFeature";
import { KnowledgeBaseSkeleton } from "@/features/support/knowledgeBaseSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<KnowledgeBaseSkeleton />}>
      <KnowledgeBaseFeature />
    </Suspense>
  );
}
