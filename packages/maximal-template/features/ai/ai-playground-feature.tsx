import { loadAiPlaygroundWorkflow } from "@/lib/workflows/aiWorkflows";
import { NewAiGenerationForm } from "./newAiGenerationForm";

export async function AiPlaygroundFeature() {
  const { configuration } = await loadAiPlaygroundWorkflow();
  return <NewAiGenerationForm configuration={configuration} />;
}
