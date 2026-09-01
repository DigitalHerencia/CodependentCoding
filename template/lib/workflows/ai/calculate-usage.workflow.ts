import type { AiUsageItem } from "@/types/aiTypes";
import { getMyAiUsage } from "../../fetchers/aiFetchers";

export async function calculateUsageWorkflow() {
  return getMyAiUsage();
}

export function calculateUsage(items: AiUsageItem[]) {
  return items.reduce(
    (total, item) => ({
      inputTokens: total.inputTokens + item.inputTokens,
      outputTokens: total.outputTokens + item.outputTokens,
      cost: total.cost + Number(item.cost),
      generationCount: total.generationCount + 1,
    }),
    { inputTokens: 0, outputTokens: 0, cost: 0, generationCount: 0 },
  );
}
