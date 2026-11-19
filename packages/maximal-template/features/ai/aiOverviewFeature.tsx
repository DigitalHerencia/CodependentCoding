import type { AiFeatureProps } from "@/types/aiTypes";
import { AiOverviewTemplate } from "@/components/templates/ai-templates";
import { loadAiOverviewWorkflow } from "@/lib/workflows/aiWorkflows";

/** Resolves route criteria through the authorized workflow before composing the overview. */
export async function AiOverviewFeature({ criteria }: AiFeatureProps) {
  const query = await criteria;
  const view = await loadAiOverviewWorkflow(query);
  return <AiOverviewTemplate {...view} />;
}
