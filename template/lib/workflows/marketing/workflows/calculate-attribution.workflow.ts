import { calculateAttribution } from "../../marketing/logic/calculate-attribution.logic";

export async function calculateAttributionWorkflow(
  touchpointIds: string[],
  model: "first-touch" | "last-touch" | "linear",
) {
  return calculateAttribution(touchpointIds, model);
}
