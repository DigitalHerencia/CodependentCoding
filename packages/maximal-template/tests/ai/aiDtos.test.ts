import { Prisma } from "@/generated/prisma/client";
import {
  toAiGenerationDTO,
  toAiUsageDTO,
  toAiUsageSummaryDTO,
} from "@/lib/db/dtos/aiDtos";
import type {
  AiGenerationRecord,
  AiUsageAggregate,
  AiUsageRecord,
} from "@/types/aiTypes";
import { describe, expect, it } from "vitest";

const instant = new Date("2026-11-18T12:00:00.000Z");
const generation: AiGenerationRecord = {
  id: "generation-1",
  provider: "hugging-face",
  model: "configured-model",
  status: "SUCCEEDED",
  measurementVersion: 1,
  inputTokens: null,
  outputTokens: 0,
  cost: new Prisma.Decimal("99999999999.12345678"),
  errorCode: null,
  startedAt: instant,
  completedAt: instant,
  createdAt: instant,
};
const usage: AiUsageRecord = {
  id: "usage-1",
  generationId: generation.id,
  provider: generation.provider,
  model: generation.model,
  measurementVersion: 1,
  inputTokens: null,
  outputTokens: 0,
  cost: generation.cost,
  occurredAt: instant,
};

/** Transport must retain database precision and expose only the approved public metadata. */
describe("AI DTO mapping", () => {
  it("masks legacy measurements without mutating retained historical amounts", () => {
    const oldGeneration = {
      ...generation,
      measurementVersion: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: new Prisma.Decimal("0.00000000"),
    };
    const oldUsage = {
      ...usage,
      measurementVersion: 0,
      inputTokens: 12,
      outputTokens: 34,
      cost: new Prisma.Decimal("1.23456789"),
    };
    expect(toAiGenerationDTO(oldGeneration)).toMatchObject({
      inputTokens: null,
      outputTokens: null,
      cost: null,
    });
    expect(toAiUsageDTO(oldUsage)).toMatchObject({
      inputTokens: null,
      outputTokens: null,
      cost: null,
    });
    expect(oldGeneration.inputTokens).toBe(0);
    expect(oldGeneration.cost.toFixed(8)).toBe("0.00000000");
    expect(oldUsage.inputTokens).toBe(12);
    expect(oldUsage.outputTokens).toBe(34);
    expect(oldUsage.cost.toFixed(8)).toBe("1.23456789");
    expect(toAiUsageDTO(oldUsage)).not.toHaveProperty("measurementVersion");
  });
  it("serializes large decimal costs without a JavaScript floating-point round trip", () => {
    expect(toAiGenerationDTO(generation).cost).toBe("99999999999.12345678");
    expect(toAiUsageDTO(usage).cost).toBe("99999999999.12345678");
  });

  it("distinguishes an absent measurement from a measured zero and converts dates to ISO", () => {
    expect(
      toAiGenerationDTO({
        ...generation,
        cost: null,
        startedAt: null,
        completedAt: null,
      }),
    ).toMatchObject({
      inputTokens: null,
      outputTokens: 0,
      cost: null,
      startedAt: null,
      completedAt: null,
      createdAt: instant.toISOString(),
    });
    expect(toAiUsageDTO({ ...usage, cost: null })).toMatchObject({
      inputTokens: null,
      outputTokens: 0,
      cost: null,
      occurredAt: instant.toISOString(),
    });
  });

  it("does not serialize private request payloads or tenant identifiers from widened records", () => {
    const widenedRecord = {
      ...generation,
      organizationId: "private-tenant",
      userId: "private-user",
      input: { prompt: "private prompt" },
      output: { text: "private response" },
    };
    const dto = toAiGenerationDTO(widenedRecord);
    expect(Object.keys(dto).sort()).toEqual(
      [
        "id",
        "provider",
        "model",
        "status",
        "inputTokens",
        "outputTokens",
        "cost",
        "errorCode",
        "startedAt",
        "completedAt",
        "createdAt",
      ].sort(),
    );
    expect(JSON.stringify(dto)).not.toContain("private");
  });

  it("retains null aggregate totals and discloses measurement coverage for partially measured usage", () => {
    const aggregate: AiUsageAggregate = {
      _sum: { inputTokens: null, outputTokens: 0, cost: null },
      _count: { _all: 3, inputTokens: 0, outputTokens: 1, cost: 0 },
    };
    expect(toAiUsageSummaryDTO(aggregate)).toEqual({
      inputTokens: null,
      outputTokens: 0,
      cost: null,
      generationCount: 3,
      measuredInputCount: 0,
      measuredOutputCount: 1,
      measuredCostCount: 0,
    });
  });
});
