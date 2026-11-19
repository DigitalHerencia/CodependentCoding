import type { AiFeatureProps } from "@/types/aiTypes";
import { AiUsageTemplate } from "@/components/templates/ai-templates";
import { loadAiUsageWorkflow } from "@/lib/workflows/aiWorkflows";

/** Supplies authorized pagination and aggregate usage to the route presentation. */
export async function AiUsageFeature({ criteria }: AiFeatureProps) {
  const query = await criteria;
  const view = await loadAiUsageWorkflow(query);
  return <AiUsageTemplate {...view} />;
}
