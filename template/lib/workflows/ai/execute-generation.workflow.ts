import { createHash } from "node:crypto";

import type { AuthenticatedIdentity } from "../../../types/access";

import { assertPermission } from "../../authz/permissions";
import { completeAiGenerationTx } from "../../db/transactions/complete-ai-generation.tx";
import {
  countRecentAiGenerationsTx,
  failAiGenerationTx,
  startAiGenerationTx,
} from "../../db/transactions/aiTransactions";
import { withTenantTransaction } from "../../db/tenant";
import {
  generateHuggingFaceText,
  getConfiguredHuggingFaceModel,
} from "../../integrations/hugging-face/inference";
import { enforceRateLimit } from "../../ai/logic/enforce-rate-limit.logic";

export async function executeGenerationWorkflow(
  identity: AuthenticatedIdentity,
  command: { prompt: string },
) {
  const model = getConfiguredHuggingFaceModel();
  const generationId = await withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "ai:write");
    const recentGenerationCount = await countRecentAiGenerationsTx(tx, {
      organizationId: access.organizationId,
      userId: access.userId,
      windowStart: new Date(Date.now() - 60_000),
    });
    enforceRateLimit({ recentGenerationCount, limit: 5 });
    const record = await startAiGenerationTx(tx, {
      organizationId: access.organizationId,
      userId: access.userId,
      provider: "hugging-face",
      model,
      prompt: command.prompt,
      requestHash: createHash("sha256")
        .update(`${model}\0${command.prompt}`)
        .digest("hex"),
    });
    return record.id;
  });

  try {
    const result = await generateHuggingFaceText({ prompt: command.prompt, model });
    await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "ai:write");
      await completeAiGenerationTx(tx, {
        organizationId: access.organizationId,
        generationId,
        output: { text: result.generated_text },
        inputTokens: 0,
        outputTokens: 0,
        cost: "0",
      });
    });
    return { generationId, text: result.generated_text, model };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "AI generation failed.";
    await withTenantTransaction(identity, async (tx, access) => {
      await failAiGenerationTx(tx, {
        organizationId: access.organizationId,
        generationId,
        errorCode: message,
      });
    });
    throw cause;
  }
}
