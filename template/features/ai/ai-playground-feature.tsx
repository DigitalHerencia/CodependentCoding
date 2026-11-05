import { getAiPlaygroundConfiguration } from "@/lib/workflows/aiWorkflows";
import { AiPlaygroundFeatureClient } from "./ai-playground-feature.client";
export async function AiPlaygroundFeature() {
  return (
    <AiPlaygroundFeatureClient
      configuration={await getAiPlaygroundConfiguration()}
    />
  );
}
