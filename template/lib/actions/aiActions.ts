"use server";

import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { withTenantTransaction } from "@/lib/db/tenant";
import { completeAiGenerationTx } from "@/lib/db/transactions/aiCompleteGenerationTx";
import {
  createAiGenerationTx,
  failAiGenerationTx,
} from "@/lib/db/transactions/aiTx";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";
import {
  generateHuggingFaceText,
  getConfiguredHuggingFaceModel,
} from "@/lib/integrations/hugging-face/inference";
import {
  enforceRateLimit,
  isRateLimitRequested,
} from "@/lib/integrations/upstash/ratelimit";
import { toActionResult } from "@/lib/utils/actionResult";
import { aiGenerationRequestSchema } from "@/schema/aiSchemas";

export async function generateAiResponse(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const { prompt } = await withTenantTransaction(
      identity,
      async (_tx, access) => {
        assertPermission(access, "ai.generation:create");
        return aiGenerationRequestSchema.parse(rawInput);
      },
    );

    if (!isHuggingFaceConfigured()) {
      throw new Error("The AI provider is not configured.");
    }
    const model = getConfiguredHuggingFaceModel();
    if (isRateLimitRequested()) {
      await enforceRateLimit("ai-generate", identity.clerkUserId, {
        requests: 5,
        window: "60 s",
      });
    }
    const generation = await withTenantTransaction(
      identity,
      async (tx, access) => {
        assertPermission(access, "ai.generation:create");
        return createAiGenerationTx(tx, {
          organizationId: access.organizationId,
          userId: access.userId,
          provider: "hugging-face",
          model,
          input: { prompt: prompt },
        });
      },
    );
    try {
      const result = await generateHuggingFaceText({
        prompt: prompt,
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
      return {
        generationId: generation.id,
        text: result.generated_text,
        model,
      };
    } catch (cause) {
      await withTenantTransaction(identity, async (tx, access) => {
        assertPermission(access, "ai.generation:update");
        return failAiGenerationTx(tx, {
          organizationId: access.organizationId,
          generationId: generation.id,
          errorCode: "AI_GENERATION_FAILED",
        });
      });
      throw cause;
    }
  });
}
