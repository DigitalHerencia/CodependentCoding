import { loadAiPlaygroundWorkflow } from "@/lib/workflows/aiWorkflows";
import { AiNewGenerationForm } from "./aiNewGenerationForm";

/** Loads server-owned model availability; tenancy and onboarding remain in the tenant layout. */
export async function AiPlaygroundFeature() {
  const { configuration } = await loadAiPlaygroundWorkflow();
  return <AiNewGenerationForm configuration={configuration} />;
}
