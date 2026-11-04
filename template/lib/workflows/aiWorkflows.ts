import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import { getMyAiUsage, getMyAiGenerations } from "@/lib/fetchers/aiFetchers";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";
import { getConfiguredHuggingFaceModel } from "@/lib/integrations/hugging-face/inference";
import type { AiUsageItem } from "@/types/aiTypes";

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
  return withAuthenticatedRead(async (_tx, access) => {
    assertPermission(access, "ai.generation:read");
    return {
      configured: isHuggingFaceConfigured(),
      model: getConfiguredHuggingFaceModel(),
    };
  });
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
