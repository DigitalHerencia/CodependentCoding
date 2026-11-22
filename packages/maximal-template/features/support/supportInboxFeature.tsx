import {
  SupportInboxTemplate,
  SupportUnavailableTemplate,
} from "@/components/templates/support-templates";
import { loadInboxWorkflow } from "@/lib/workflows/supportWorkflows";
import { supportPager } from "@/lib/utils/supportPager";
import type { SupportSearchParams } from "@/types/supportTypes";

/** Load the authorized, bounded queue search. */
export async function SupportInboxFeature({
  searchParams,
}: {
  searchParams: Promise<SupportSearchParams>;
}) {
  const result = await loadInboxWorkflow(await searchParams);
  if (!result.ok)
    return <SupportUnavailableTemplate page="inbox" code={result.error.code} />;
  const { page, hasMore, criteria, ...view } = result.data;
  const pager = supportPager("/support/inbox", page, hasMore, {
    query: criteria.query,
    status: criteria.status,
    priority: criteria.priority,
  });
  return <SupportInboxTemplate {...view} {...criteria} pager={pager} />;
}
