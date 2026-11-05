import { getMyAiGenerations } from "@/lib/fetchers/aiFetchers";
import { AiGenerationTemplate } from "@/components/templates/ai-templates";
export async function AiGenerationFeature() {
  return <AiGenerationTemplate generations={await getMyAiGenerations()} />;
}
