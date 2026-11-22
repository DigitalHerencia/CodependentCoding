import {
  SupportKnowledgeBaseTemplate,
  SupportUnavailableTemplate,
} from "@/components/templates/support-templates";
import { loadKnowledgeBaseWorkflow } from "@/lib/workflows/supportWorkflows";
import { supportPager } from "@/lib/utils/supportPager";
import type { SupportSearchParams } from "@/types/supportTypes";

/** Load the authorized, bounded published article search. */
export async function SupportKnowledgeBaseFeature({
  searchParams,
}: {
  searchParams: Promise<SupportSearchParams>;
}) {
  const result = await loadKnowledgeBaseWorkflow(await searchParams);
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="knowledge" code={result.error.code} />
    );
  const { page, hasMore, criteria, ...view } = result.data;
  const pager = supportPager("/support/knowledge-base", page, hasMore, {
    query: criteria.query,
  });
  return <SupportKnowledgeBaseTemplate {...view} {...criteria} pager={pager} />;
}
