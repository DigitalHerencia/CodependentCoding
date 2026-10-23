import { getAiPlaygroundConfiguration } from "@/lib/workflows/aiWorkflows";
import { AiPlaygroundFeatureClient } from "./aiPlaygroundFeature.client";
export async function AiPlaygroundFeature() {
  return (
    <AiPlaygroundFeatureClient
      configuration={await getAiPlaygroundConfiguration()}
    />
  );
}
