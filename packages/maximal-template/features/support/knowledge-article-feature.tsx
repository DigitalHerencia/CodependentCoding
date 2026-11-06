import { SupportKnowledgeArticleTemplate } from "@/components/templates/support-templates";
import { loadKnowledgeArticleWorkflow } from "@/lib/workflows/supportWorkflows";

export async function KnowledgeArticleFeature({
  articleId,
}: {
  articleId: string;
}) {
  const { article } = await loadKnowledgeArticleWorkflow({ articleId });
  return <SupportKnowledgeArticleTemplate article={article} />;
}
