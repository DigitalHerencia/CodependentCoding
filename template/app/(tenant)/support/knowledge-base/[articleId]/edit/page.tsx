import { Suspense } from "react";

import { KnowledgeArticleEditFeature } from "@/features/support/knowledge-article-edit-feature";
import { KnowledgeArticleFormSkeleton } from "@/features/support/knowledge-article-form-skeleton";

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
