import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { aiGenerationSelect } from "@/lib/db/selects/aiSelects";
import {
  ConcurrencyConflictError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";
import { aiInferenceResultSchema } from "@/schemas/aiSchemas";
import type {
  AiStartGenerationInput,
  AiCompleteGenerationInput,
  AiGenerationTransition,
} from "@/types/aiTypes";

/** Start one owned synchronous request; the caller supplies a locked, authorized tenant transaction. */
export async function startAiGenerationTx(
  tx: Prisma.TransactionClient,
  input: AiStartGenerationInput,
) {
  const generation = await tx.aiGeneration.create({
    data: {
      organizationId: input.organizationId,
      userId: input.userId,
      provider: input.provider,
      model: input.model,
      status: "RUNNING",
      input: { prompt: input.prompt },
      startedAt: new Date(),
      inputTokens: null,
      outputTokens: null,
      cost: null,
      measurementVersion: 1,
    },
    select: { id: true },
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.userId,
      action: "ai.generation.started",
      resourceType: "AiGeneration",
      resourceId: generation.id,
    },
  });
  return generation;
}

/**
 * Compare-and-set completion and append its unique usage entry in the caller's transaction.
 * Repeated completion returns the committed record without replacing output or ledger values.
 * A concurrent failure cannot be overwritten, and a failed ledger insert rolls back completion.
 */
export async function completeAiGenerationTx(
  tx: Prisma.TransactionClient,
  input: AiCompleteGenerationInput,
) {
  const result = aiInferenceResultSchema.parse({
    text: input.text,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    cost: input.cost,
  });
  const where = {
    id: input.generationId,
    organizationId: input.organizationId,
    userId: input.userId,
  };
  const cost = result.cost === null ? null : new Prisma.Decimal(result.cost);
  const changed = await tx.aiGeneration.updateMany({
    where: { ...where, status: "RUNNING" },
    data: {
      status: "SUCCEEDED",
      output: { text: result.text },
      errorCode: null,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      cost,
      completedAt: new Date(),
      measurementVersion: 1,
    },
  });
  const generation = await tx.aiGeneration.findFirst({
    where,
    select: aiGenerationSelect,
  });
  if (!generation) throw new ResourceNotFoundError("AI generation");
  if (changed.count === 0) {
    if (generation.status === "SUCCEEDED") return generation;
    throw new ConcurrencyConflictError("AI generation");
  }
  await tx.aiUsageLedger.create({
    data: {
      organizationId: input.organizationId,
      userId: input.userId,
      generationId: generation.id,
      provider: generation.provider,
      model: generation.model,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      cost,
      measurementVersion: 1,
    },
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.userId,
      action: "ai.generation.succeeded",
      resourceType: "AiGeneration",
      resourceId: generation.id,
    },
  });
  return generation;
}

/** Mark only an owned RUNNING request failed; completed output and append-only usage stay intact. */
export async function failAiGenerationTx(
  tx: Prisma.TransactionClient,
  input: AiGenerationTransition,
) {
  const changed = await tx.aiGeneration.updateMany({
    where: {
      id: input.generationId,
      organizationId: input.organizationId,
      userId: input.userId,
      status: "RUNNING",
    },
    data: {
      status: "FAILED",
      errorCode: "AI_GENERATION_FAILED",
      completedAt: new Date(),
    },
  });
  if (changed.count === 1)
    await tx.auditEvent.create({
      data: {
        organizationId: input.organizationId,
        actorUserId: input.userId,
        action: "ai.generation.failed",
        resourceType: "AiGeneration",
        resourceId: input.generationId,
      },
    });
}
