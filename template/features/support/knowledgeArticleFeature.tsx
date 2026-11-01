import { notFound } from "next/navigation";
import { getKnowledgeArticle } from "@/lib/fetchers/supportFetchers";
import { SupportKnowledgeArticleTemplate } from "@/components/templates/supportKnowledgeArticleTemplate";
export async function KnowledgeArticleFeature({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getKnowledgeArticle(articleId);
  if (!article) notFound();
  return <SupportKnowledgeArticleTemplate article={article} />;
}
