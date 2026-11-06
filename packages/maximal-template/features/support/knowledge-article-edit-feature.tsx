import { loadKnowledgeArticleEditWorkflow } from "@/lib/workflows/supportWorkflows";
import { NewKnowledgeArticleForm } from "./newKnowledgeArticleForm";

export async function KnowledgeArticleEditFeature({
  articleId,
}: {
  articleId: string;
}) {
  const { article } = await loadKnowledgeArticleEditWorkflow({ articleId });
  return <NewKnowledgeArticleForm article={article} />;
}
