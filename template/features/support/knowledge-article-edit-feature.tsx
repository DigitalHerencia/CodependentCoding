import { notFound } from "next/navigation";
import { getKnowledgeArticle } from "@/lib/fetchers/supportFetchers";
import { KnowledgeArticleNewForm } from "./knowledge-article-new-form";
export async function KnowledgeArticleEditFeature({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getKnowledgeArticle(articleId);
  if (!article) notFound();
  return <KnowledgeArticleNewForm article={article} />;
}
