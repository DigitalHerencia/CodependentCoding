import { Suspense } from "react";

import { KnowledgeArticleFeature } from "@/features/support/knowledge-article-feature";
import { KnowledgeArticleSkeleton } from "@/features/support/knowledge-article-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  return (
    <Suspense fallback={<KnowledgeArticleSkeleton />}>
      <KnowledgeArticleFeature articleId={articleId} />
    </Suspense>
  );
}
