import { loadAudienceEditWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewAudienceForm } from "./newAudienceForm";

export async function AudienceEditFeature({
  audienceId,
}: {
  audienceId: string;
}) {
  const { audience } = await loadAudienceEditWorkflow({ audienceId });
  return <NewAudienceForm audience={audience} />;
}
