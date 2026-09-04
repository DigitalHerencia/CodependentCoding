import { Suspense } from "react";

import { KnowledgeArticleFeature } from "@/features/support/knowledgeArticleFeature";
import { KnowledgeArticleSkeleton } from "@/features/support/knowledgeArticleSkeleton";

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
