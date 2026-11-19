import "server-only";
import type { Prisma } from "@/generated/prisma/client";

/** History excludes private prompts, output payloads and tenant identifiers. */
export const aiGenerationSelect = {
  id: true,
  provider: true,
  model: true,
  status: true,
  inputTokens: true,
  outputTokens: true,
  cost: true,
  errorCode: true,
  measurementVersion: true,
  startedAt: true,
  completedAt: true,
  createdAt: true,
} satisfies Prisma.AiGenerationSelect;

/** Only fields required by personal usage and recent activity cross the read boundary. */
export const aiUsageSelect = {
  id: true,
  generationId: true,
  provider: true,
  model: true,
  inputTokens: true,
  outputTokens: true,
  cost: true,
  occurredAt: true,
  measurementVersion: true,
} satisfies Prisma.AiUsageLedgerSelect;
