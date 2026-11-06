import { loadAudiencesWorkflow } from "@/lib/workflows/marketingWorkflows";
import { AudiencesFeatureClient } from "./audiences-feature.client";

export async function AudiencesFeature() {
  const { audiences } = await loadAudiencesWorkflow();
  return <AudiencesFeatureClient audiences={audiences} />;
}
