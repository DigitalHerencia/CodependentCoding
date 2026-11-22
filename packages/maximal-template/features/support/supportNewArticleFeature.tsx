import { SupportUnavailableTemplate } from "@/components/templates/support-templates";
import { SupportNewArticleForm } from "@/features/support/supportNewArticleForm";
import { loadSupportCapabilitiesWorkflow } from "@/lib/workflows/supportWorkflows";

/** Load the authorized new article view. */
export async function SupportNewArticleFeature() {
  const result = await loadSupportCapabilitiesWorkflow();
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="newArticle" code={result.error.code} />
    );
  if (!result.data.canCreateArticle)
    return <SupportUnavailableTemplate page="newArticle" code="FORBIDDEN" />;
  return <SupportNewArticleForm />;
}
