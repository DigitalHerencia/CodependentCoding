import { KnowledgeArticleEditForm } from "@/features/support/knowledgeArticleEditForm";

export default async function Page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  return <KnowledgeArticleEditForm articleId={articleId} />;
}
