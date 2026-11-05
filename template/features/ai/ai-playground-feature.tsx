import { getAiPlaygroundConfiguration } from "@/lib/workflows/aiWorkflows";
import { AiPlaygroundFeatureClient } from "./ai-playground-form.client";
export async function AiPlaygroundFeature() {
  return (
    <AiPlaygroundFeatureClient
      configuration={await getAiPlaygroundConfiguration()}
    />
  );
}
