import { KnowledgeArticleEditFeature } from "@/features/support/knowledgeArticleEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  return <KnowledgeArticleEditFeature articleId={articleId} />;
}
