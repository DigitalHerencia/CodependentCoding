"use server";

import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { resolveCapturedAccessTx } from "@/lib/authz/tenancy";
import {
  withTenantTransaction,
  withCapturedTenantTransaction,
} from "@/lib/db/tenancy";
import {
  startAiGenerationTx,
  completeAiGenerationTx,
  failAiGenerationTx,
} from "@/lib/db/selects/aiTx";
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
import { aiGenerationRequestSchema } from "@/schemas/aiSchemas";
import type { AiGenerationResult } from "@/types/aiTypes";
import type { ActionResult } from "@/types/actionTypes";

/**
 * Authorize and capture the request owner before network work, then recheck that exact
 * membership before either terminal transition. Inference and rate limiting run outside
 * database transactions. Raw provider/database diagnostics never reach logs or the client.
 */
export async function generateAiResponse(
  rawInput: unknown,
): Promise<ActionResult<AiGenerationResult>> {
  return toActionResult(async () => {
    try {
      const identity = await requireIdentity();
      const input = aiGenerationRequestSchema.parse(rawInput);
      const captured = await withTenantTransaction(
        identity,
        async (tx, access) => {
          const current = await resolveCapturedAccessTx(tx, identity, access);
          assertPermission(current, "ai.generation:create");
          assertPermission(current, "ai.generation:update");
          return {
            organizationId: current.organizationId,
            userId: current.userId,
            membershipId: current.membershipId,
          };
        },
      );
      if (!isHuggingFaceConfigured())
        throw new Error("AI inference is unavailable.");
      const model = getConfiguredHuggingFaceModel();
      if (isRateLimitRequested())
        await enforceRateLimit("ai-generate", identity.clerkUserId, {
          requests: 5,
          window: "60 s",
        });

      const generation = await withCapturedTenantTransaction(
        identity,
        captured,
        async (tx, access) => {
          assertPermission(access, "ai.generation:create");
          assertPermission(access, "ai.generation:update");
          return startAiGenerationTx(tx, {
            ...captured,
            provider: "hugging-face",
            model,
            prompt: input.prompt,
          });
        },
      );
      let result;
      try {
        result = await generateHuggingFaceText({ prompt: input.prompt, model });
      } catch {
        await withCapturedTenantTransaction(
          identity,
          captured,
          async (tx, access) => {
            assertPermission(access, "ai.generation:update");
            await failAiGenerationTx(tx, {
              ...captured,
              generationId: generation.id,
            });
          },
        );
        throw new Error("AI inference is unavailable.");
      }
      await withCapturedTenantTransaction(
        identity,
        captured,
        async (tx, access) => {
          assertPermission(access, "ai.generation:update");
          await completeAiGenerationTx(tx, {
            ...captured,
            generationId: generation.id,
            ...result,
          });
        },
      );
      return { generationId: generation.id, text: result.text, model };
    } catch (cause) {
      unstable_rethrow(cause);
      if (cause instanceof ZodError) throw cause;
      const code = (cause as { code?: unknown } | null)?.code;
      if (
        typeof code === "string" &&
        [
          "UNAUTHENTICATED",
          "FORBIDDEN",
          "NOT_FOUND",
          "CONFLICT",
          "RATE_LIMITED",
        ].includes(code)
      )
        throw Object.assign(
          new Error("The AI request could not be completed."),
          { code },
        );
      throw new Error("The AI request could not be completed.");
    }
  });
}
