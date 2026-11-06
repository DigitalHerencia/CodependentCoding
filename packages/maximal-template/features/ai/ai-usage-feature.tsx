import { AiUsageTemplate } from "@/components/templates/ai-templates";
import { loadAiUsageWorkflow } from "@/lib/workflows/aiWorkflows";

export async function AiUsageFeature() {
  const { usage } = await loadAiUsageWorkflow();
  return <AiUsageTemplate usage={usage} />;
}
