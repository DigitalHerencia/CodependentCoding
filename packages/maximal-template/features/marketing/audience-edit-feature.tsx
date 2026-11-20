import { loadAudienceEditWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewAudienceForm } from "./newAudienceForm";
/** Preserve the current concurrency token and unsupported rule semantics in the form. */
export async function AudienceEditFeature({
  audienceId,
}: {
  audienceId: string;
}) {
  const data = await loadAudienceEditWorkflow({ audienceId });
  return <NewAudienceForm key={data.audience.updatedAt} {...data} />;
}
