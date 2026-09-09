import { notFound } from "next/navigation";
import { getKnowledgeArticleWorkflow } from "@/lib/workflows/supportWorkflows";
import { SupportKnowledgeArticleTemplate } from "@/components/templates/supportKnowledgeArticleTemplate";
export async function KnowledgeArticleFeature({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getKnowledgeArticleWorkflow(articleId);
  if (!article) notFound();
  return <SupportKnowledgeArticleTemplate article={article} />;
}
