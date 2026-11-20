import { loadAudienceNewWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewAudienceForm } from "./newAudienceForm";
/** Prepare audience creation authority inside the established tenant shell. */
export async function AudienceNewFeature() {
  return <NewAudienceForm {...await loadAudienceNewWorkflow()} />;
}
