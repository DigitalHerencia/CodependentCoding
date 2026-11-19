import "server-only";
import type {
  AiGenerationDTO,
  AiGenerationRecord,
  AiUsageRecord,
  AiUsageRecordDTO,
  AiUsageSummaryDTO,
  AiUsageAggregate,
} from "@/types/aiTypes";

/** Serialize selected metadata; decimal costs never pass through JavaScript floating point. */
export function toAiGenerationDTO(record: AiGenerationRecord): AiGenerationDTO {
  return {
    id: record.id,
    provider: record.provider,
    model: record.model,
    status: record.status,
    inputTokens: record.measurementVersion === 1 ? record.inputTokens : null,
    outputTokens: record.measurementVersion === 1 ? record.outputTokens : null,
    cost:
      record.measurementVersion === 1
        ? (record.cost?.toFixed(8) ?? null)
        : null,
    errorCode: record.errorCode,
    startedAt: record.startedAt?.toISOString() ?? null,
    completedAt: record.completedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}

/** Project an append-only ledger row without disclosing its request contents. */
export function toAiUsageDTO(record: AiUsageRecord): AiUsageRecordDTO {
  return {
    id: record.id,
    generationId: record.generationId,
    provider: record.provider,
    model: record.model,
    inputTokens: record.measurementVersion === 1 ? record.inputTokens : null,
    outputTokens: record.measurementVersion === 1 ? record.outputTokens : null,
    cost:
      record.measurementVersion === 1
        ? (record.cost?.toFixed(8) ?? null)
        : null,
    occurredAt: record.occurredAt.toISOString(),
  };
}

/** SQL SUM preserves null without measurements; counts disclose partial measurement coverage. */
export function toAiUsageSummaryDTO(
  aggregate: AiUsageAggregate,
): AiUsageSummaryDTO {
  return {
    inputTokens: aggregate._sum.inputTokens,
    outputTokens: aggregate._sum.outputTokens,
    cost: aggregate._sum.cost?.toFixed(8) ?? null,
    generationCount: aggregate._count._all,
    measuredInputCount: aggregate._count.inputTokens,
    measuredOutputCount: aggregate._count.outputTokens,
    measuredCostCount: aggregate._count.cost,
  };
}
