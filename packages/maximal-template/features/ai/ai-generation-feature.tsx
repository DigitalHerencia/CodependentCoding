import { AiGenerationTemplate } from "@/components/templates/ai-templates";
import { loadAiGenerationWorkflow } from "@/lib/workflows/aiWorkflows";

export async function AiGenerationFeature() {
  const { generations } = await loadAiGenerationWorkflow();
  return <AiGenerationTemplate generations={generations} />;
}
