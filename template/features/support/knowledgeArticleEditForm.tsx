import { notFound } from "next/navigation";
import { getKnowledgeArticleWorkflow } from "@/lib/workflows/supportWorkflows";
import { KnowledgeArticleNewForm } from "./knowledgeArticleNewForm";
export async function KnowledgeArticleEditForm({
  articleId,
}: {
  articleId: string;
}) {
  const article = await getKnowledgeArticleWorkflow(articleId);
  if (!article) notFound();
  return <KnowledgeArticleNewForm article={article} />;
}
