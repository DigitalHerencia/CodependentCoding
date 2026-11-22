import { SupportUnavailableTemplate } from "@/components/templates/support-templates";
import { SupportEditArticleForm } from "@/features/support/supportEditArticleForm";
import { loadKnowledgeArticleEditWorkflow } from "@/lib/workflows/supportWorkflows";

/** Load the authorized edit article view. */
export async function SupportEditArticleFeature({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const result = await loadKnowledgeArticleEditWorkflow(
    (await params).articleId,
  );
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="editArticle" code={result.error.code} />
    );

  return (
    <SupportEditArticleForm key={result.data.updatedAt} article={result.data} />
  );
}
