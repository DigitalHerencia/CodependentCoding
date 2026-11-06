import {
  assertAiReadAccess,
  getMyAiGenerations,
  getMyAiUsage,
} from "@/lib/fetchers/aiFetchers";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";
import { getConfiguredHuggingFaceModel } from "@/lib/integrations/hugging-face/inference";
import { type AiUsageItem } from "@/types/aiTypes";
import "server-only";

export async function getAiWorkspaceWorkflow() {
  const [configuration, generations, usage] = await Promise.all([
    getAiPlaygroundConfiguration(),
    getMyAiGenerations(),
    getMyAiUsage(),
  ]);
  return { configuration, generations, usage };
}

// Provider configuration is not a persisted read, so it lives here rather than in a fetcher.
export async function getAiPlaygroundConfiguration() {
  await assertAiReadAccess();
  return {
    configured: isHuggingFaceConfigured(),
    model: getConfiguredHuggingFaceModel(),
  };
}

const TICKS_PER_US_DOLLAR = 10_000_000_000n;

export function costTicksToUsd(costTicks: number | bigint): string {
  const ticks = BigInt(costTicks);
  if (ticks < 0n) throw new Error("Provider cost cannot be negative.");
  const whole = ticks / TICKS_PER_US_DOLLAR;
  const fraction = (ticks % TICKS_PER_US_DOLLAR).toString().padStart(10, "0");
  return `${whole}.${fraction.slice(0, 8)}`;
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

export async function loadAiGenerationWorkflow() {
  const generations = await getMyAiGenerations();
  return { generations };
}

export async function loadAiPlaygroundWorkflow() {
  const configuration = await getAiPlaygroundConfiguration();
  return { configuration };
}

export async function loadAiUsageWorkflow() {
  const usage = await getMyAiUsage();
  return { usage };
}
