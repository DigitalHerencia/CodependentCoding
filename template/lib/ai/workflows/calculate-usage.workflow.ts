import { getMyAiUsage } from "../../fetchers/aiFetchers";
export async function calculateUsageWorkflow() {
  return getMyAiUsage();
}
