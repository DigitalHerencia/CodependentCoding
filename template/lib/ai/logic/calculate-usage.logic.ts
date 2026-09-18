export interface AiUsageItem {
  inputTokens: number;
  outputTokens: number;
  cost: string;
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

