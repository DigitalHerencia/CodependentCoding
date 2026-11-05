import { Prisma } from "@/generated/prisma/client";
import type { SeedContext } from "@/prisma/seeds/base";

export const seedIds = {
  aiGeneration: "00000000-0000-4000-8000-000000000090",
  aiUsage: "00000000-0000-4000-8000-000000000091",
} as const;

export async function seed({
  tx,
  owner,
  organization,
}: SeedContext): Promise<void> {
  const generation = await tx.aiGeneration.upsert({
    where: {
      id: seedIds.aiGeneration,
    },
    update: {
      organizationId: organization.id,
      userId: owner.id,
      provider: "seed",
      model: "maximal-model",
      status: "SUCCEEDED",
      input: {
        prompt: "Summarize the maximal template.",
      },
      output: {
        text: "One superset, many recipes.",
      },
      requestHash: "seed-generation",
      inputTokens: 10,
      outputTokens: 6,
      cost: new Prisma.Decimal("0.00010000"),
      startedAt: new Date("2026-08-10T12:00:00.000Z"),
      completedAt: new Date("2026-08-10T12:00:01.000Z"),
    },
    create: {
      id: seedIds.aiGeneration,
      organizationId: organization.id,
      userId: owner.id,
      provider: "seed",
      model: "maximal-model",
      status: "SUCCEEDED",
      input: {
        prompt: "Summarize the maximal template.",
      },
      output: {
        text: "One superset, many recipes.",
      },
      requestHash: "seed-generation",
      inputTokens: 10,
      outputTokens: 6,
      cost: new Prisma.Decimal("0.00010000"),
      startedAt: new Date("2026-08-10T12:00:00.000Z"),
      completedAt: new Date("2026-08-10T12:00:01.000Z"),
    },
  });

  await tx.aiUsageLedger.upsert({
    where: {
      id: seedIds.aiUsage,
    },
    update: {
      organizationId: organization.id,
      userId: owner.id,
      generationId: generation.id,
      provider: generation.provider,
      model: generation.model,
      inputTokens: 10,
      outputTokens: 6,
      cost: new Prisma.Decimal("0.00010000"),
    },
    create: {
      id: seedIds.aiUsage,
      organizationId: organization.id,
      userId: owner.id,
      generationId: generation.id,
      provider: generation.provider,
      model: generation.model,
      inputTokens: 10,
      outputTokens: 6,
      cost: new Prisma.Decimal("0.00010000"),
    },
  });
}
