import type { SeedContext } from "@/prisma/seeds/base";

/** Stable development fixture identifiers; repeated seeding never changes historical records. */
export const seedIds = {
  aiGeneration: "00000000-0000-4000-8000-000000000090",
  aiUsage: "00000000-0000-4000-8000-000000000091",
} as const;

/** Insert clearly identified fixtures only. No live inference or invented provider measurements. */
export async function seed({
  tx,
  owner,
  organization,
}: SeedContext): Promise<void> {
  await tx.aiGeneration.createMany({
    skipDuplicates: true,
    data: {
      id: seedIds.aiGeneration,
      organizationId: organization.id,
      userId: owner.id,
      provider: "seed",
      model: "maximal-model",
      status: "SUCCEEDED",
      input: { prompt: "Summarize the maximal template." },
      output: { text: "Development fixture: one superset, many recipes." },
      inputTokens: null,
      outputTokens: null,
      cost: null,
      measurementVersion: 1,
      startedAt: new Date("2026-08-10T12:00:00.000Z"),
      completedAt: new Date("2026-08-10T12:00:01.000Z"),
    },
  });
  await tx.aiUsageLedger.createMany({
    skipDuplicates: true,
    data: {
      id: seedIds.aiUsage,
      organizationId: organization.id,
      userId: owner.id,
      generationId: seedIds.aiGeneration,
      provider: "seed",
      model: "maximal-model",
      inputTokens: null,
      outputTokens: null,
      cost: null,
      measurementVersion: 1,
      occurredAt: new Date("2026-08-10T12:00:01.000Z"),
    },
  });
}
