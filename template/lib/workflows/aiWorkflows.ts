import "server-only";

import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead, withTenantTransaction } from "@/lib/db/tenant";
import { completeAiGenerationTx } from "@/lib/db/transactions/ai-complete-generation.tx";
import {
  createAiGenerationTx,
  failAiGenerationTx,
} from "@/lib/db/transactions/ai.tx";
import { getMyAiUsage, getMyAiGenerations } from "@/lib/fetchers/aiFetchers";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";
import {
  generateHuggingFaceText,
  getConfiguredHuggingFaceModel,
} from "@/lib/integrations/hugging-face/inference";
import {
  enforceRateLimit,
  isRateLimitConfigured,
} from "@/lib/integrations/upstash/ratelimit";
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
    assertPermission(access, "ai.generation:read");
    return {
      configured: isHuggingFaceConfigured() && isRateLimitConfigured(),
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
  const identity = await requireIdentity();
  await enforceRateLimit("ai-generate", identity.clerkUserId, {
    requests: 5,
    window: "60 s",
  });
  const generation = await withTenantTransaction(
    identity,
    async (tx, access) => {
      assertPermission(access, "ai.generation:create");
      return createAiGenerationTx(tx, {
        organizationId: access.organizationId,
        userId: access.userId,
        provider: "hugging-face",
        model,
        input: { prompt: command.prompt },
      });
    },
  );
  try {
    const result = await generateHuggingFaceText({
      prompt: command.prompt,
      model,
    });
    await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "ai.generation:update");
      return completeAiGenerationTx(tx, {
        organizationId: access.organizationId,
        generationId: generation.id,
        output: { text: result.generated_text },
        inputTokens: 0,
        outputTokens: 0,
        cost: "0",
      });
    });
    return { generationId: generation.id, text: result.generated_text, model };
  } catch (cause) {
    await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "ai.generation:update");
      return failAiGenerationTx(tx, {
        organizationId: access.organizationId,
        generationId: generation.id,
        errorCode:
          cause instanceof Error ? cause.message : "AI generation failed.",
      });
    });
    throw cause;
  }
}
