import { costTicksToUsd } from "../../ai/logic/calculate-credits.logic";
export async function calculateCreditsWorkflow(costTicks: number | bigint) {
  return costTicksToUsd(costTicks);
}
