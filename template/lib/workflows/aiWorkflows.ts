import "server-only";

import {
  completeAiGenerationRecord,
  createRateLimitedAiGenerationRecord,
  failAiGenerationRecord,
} from "@/lib/actions/aiActions";
import { assertPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import { getMyAiUsage, getMyAiGenerations } from "@/lib/fetchers/aiFetchers";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";
import {
  generateHuggingFaceText,
  getConfiguredHuggingFaceModel,
} from "@/lib/integrations/hugging-face/inference";
import type { AiUsageItem, ExecuteAiGenerationCommand } from "@/types/aiTypes";

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
    assertPermission(access, "ai:read");
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

export async function calculateUsageWorkflow() {
  return getMyAiUsage();
}

export async function selectModelWorkflow() {
  const configuration = await getAiPlaygroundConfiguration();
  if (!configuration.configured) {
    throw new Error("The AI provider is not configured.");
  }
  return configuration.model;
}

export async function executeGenerationWorkflow(
  command: ExecuteAiGenerationCommand,
) {
  const model = await selectModelWorkflow();
  const generation = await createRateLimitedAiGenerationRecord({
    provider: "hugging-face",
    model,
    input: { prompt: command.prompt },
  });
  try {
    const result = await generateHuggingFaceText({
      prompt: command.prompt,
      model,
    });
    await completeAiGenerationRecord({
      generationId: generation.id,
      output: { text: result.generated_text },
      inputTokens: 0,
      outputTokens: 0,
      cost: "0",
    });
    return { generationId: generation.id, text: result.generated_text, model };
  } catch (cause) {
    await failAiGenerationRecord({
      generationId: generation.id,
      errorCode:
        cause instanceof Error ? cause.message : "AI generation failed.",
    });
    throw cause;
  }
}
