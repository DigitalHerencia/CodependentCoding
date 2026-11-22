import { loadCalendarWorkflow } from "@/lib/workflows/socialWorkflows";
import { SocialCalendarFeatureClient } from "./socialCalendarFeatureClient";

/** Load the authorized calendar within the existing tenant route. */
export async function SocialCalendarFeature() {
  const view = await loadCalendarWorkflow();
  return <SocialCalendarFeatureClient {...view} />;
}
