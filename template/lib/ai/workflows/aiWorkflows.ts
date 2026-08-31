import {
  completeAiGenerationSchema,
  createAiGenerationSchema,
} from "../../../schemas/aiSchemas";

import { requireIdentity } from "../../auth/identity";
import { assertPermission } from "../../authz/permissions";
import { toAiGenerationDTO } from "../../db/dto/ai.dto";
import { aiGenerationSelect } from "../../db/selects/ai.selects";
import { withTenantTransaction } from "../../db/tenant";
import { completeAiGenerationTx } from "../../db/transactions/complete-ai-generation.tx";

export async function createAiGenerationRecordWorkflow(rawInput: unknown) {
  const input = createAiGenerationSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "ai:write");

    const record = await tx.aiGeneration.create({
      data: {
        organizationId: access.organizationId,
        userId: access.userId,
        provider: input.provider,
        model: input.model,
        status: "PENDING",
        input: input.input,
        requestHash: input.requestHash ?? null,
      },
      select: aiGenerationSelect,
    });

    return toAiGenerationDTO(record);
  });
}

/**
 * Call this only after the external model/provider request has completed.
 * Provider network I/O must not occur inside this database transaction.
 */
export async function completeAiGenerationRecordWorkflow(rawInput: unknown) {
  const input = completeAiGenerationSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "ai:write");

    const record = await completeAiGenerationTx(tx, {
      organizationId: access.organizationId,
      generationId: input.generationId,
      output: input.output,
      inputTokens: input.inputTokens,
      outputTokens: input.outputTokens,
      cost: input.cost,
    });

    return toAiGenerationDTO(record);
  });
}
