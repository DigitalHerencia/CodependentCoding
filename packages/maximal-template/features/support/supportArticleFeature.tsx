import {
  SupportUnavailableTemplate,
  SupportArticleTemplate,
} from "@/components/templates/support-templates";
import { loadKnowledgeArticleWorkflow } from "@/lib/workflows/supportWorkflows";

/** Load the authorized article view. */
export async function SupportArticleFeature({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const result = await loadKnowledgeArticleWorkflow((await params).articleId);
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="article" code={result.error.code} />
    );

  return <SupportArticleTemplate {...result.data} />;
}
