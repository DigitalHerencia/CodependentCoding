import { Suspense } from "react";

import { KnowledgeArticleEditFeature } from "@/features/support/knowledgeArticleEditFeature";
import { KnowledgeArticleFormSkeleton } from "@/features/support/knowledgeArticleFormSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  return (
    <Suspense fallback={<KnowledgeArticleFormSkeleton />}>
      <KnowledgeArticleEditFeature articleId={articleId} />
    </Suspense>
  );
}
