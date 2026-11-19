import "server-only";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { aiGenerationSelect, aiUsageSelect } from "@/lib/db/selects/aiSelects";
import {
  toAiGenerationDTO,
  toAiUsageDTO,
  toAiUsageSummaryDTO,
} from "@/lib/db/dtos/aiDtos";
import { aiPageQuerySchema } from "@/schemas/aiSchemas";
import type { Prisma } from "@/generated/prisma/client";
import type { AiReadScope } from "@/types/aiTypes";

const PAGE_SIZE = 20;

/** Validate raw URL pagination centrally rather than accepting unchecked query options. */
function pagination(rawQuery: unknown) {
  const { page } = aiPageQuerySchema.parse(rawQuery ?? {});
  return { page, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE + 1 };
}

/** Aggregate verified measurement versions in PostgreSQL while counting all retained ledger rows. */
async function usageAggregate(
  tx: Prisma.TransactionClient,
  where: Prisma.AiUsageLedgerWhereInput,
) {
  const [aggregate, count] = await Promise.all([
    tx.aiUsageLedger.aggregate({
      where: { ...where, measurementVersion: 1 },
      _sum: { inputTokens: true, outputTokens: true, cost: true },
      _count: { _all: true, inputTokens: true, outputTokens: true, cost: true },
    }),
    tx.aiUsageLedger.count({ where }),
  ]);
  return { ...aggregate, _count: { ...aggregate._count, _all: count } };
}

/** Read provider-display authority independently of tenant layout authentication. */
export async function getAiCapabilities() {
  return withAuthenticatedRead(async (_tx, access) => {
    assertPermission(access, "ai.generation:read");
    return {
      canGenerate:
        hasPermission(access, "ai.generation:create") &&
        hasPermission(access, "ai.generation:update"),
    };
  });
}

/** One authorized overview of personal rows, outcome counts and recent usage activity. */
export async function getAiOverviewData(rawQuery: unknown, scope: AiReadScope) {
  const query = pagination(rawQuery);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "ai.generation:read");
    const owner = {
      organizationId: access.organizationId,
      userId: access.userId,
    };
    const generationWhere = {
      ...owner,
      createdAt: { gte: scope.from, lt: scope.to },
    };
    const usageWhere = {
      ...owner,
      occurredAt: { gte: scope.from, lt: scope.to },
    };
    const [rows, grouped, aggregate, activity] = await Promise.all([
      tx.aiGeneration.findMany({
        where: generationWhere,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: query.skip,
        take: query.take,
        select: aiGenerationSelect,
      }),
      tx.aiGeneration.groupBy({
        by: ["status"],
        where: generationWhere,
        _count: { _all: true },
      }),
      usageAggregate(tx, usageWhere),
      tx.aiUsageLedger.findMany({
        where: usageWhere,
        orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
        take: 5,
        select: aiUsageSelect,
      }),
    ]);
    const count = (status: string) =>
      grouped.find((group) => group.status === status)?._count._all ?? 0;
    return {
      generations: {
        items: rows.slice(0, PAGE_SIZE).map(toAiGenerationDTO),
        page: query.page,
        hasNextPage: rows.length > PAGE_SIZE && query.page < 1000,
      },
      generationCount: grouped.reduce(
        (sum, group) => sum + group._count._all,
        0,
      ),
      succeededCount: count("SUCCEEDED"),
      failedCount: count("FAILED"),
      runningCount: count("RUNNING"),
      summary: toAiUsageSummaryDTO(aggregate),
      activity: activity.map(toAiUsageDTO),
      canGenerate:
        hasPermission(access, "ai.generation:create") &&
        hasPermission(access, "ai.generation:update"),
    };
  });
}

/** Bounded personal ledger records and full-window SQL totals use the same explicit scope. */
export async function getAiUsageData(rawQuery: unknown, scope: AiReadScope) {
  const query = pagination(rawQuery);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "ai.generation:read");
    const where = {
      organizationId: access.organizationId,
      userId: access.userId,
      occurredAt: { gte: scope.from, lt: scope.to },
    };
    const [rows, aggregate] = await Promise.all([
      tx.aiUsageLedger.findMany({
        where,
        orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
        skip: query.skip,
        take: query.take,
        select: aiUsageSelect,
      }),
      usageAggregate(tx, where),
    ]);
    return {
      usage: {
        items: rows.slice(0, PAGE_SIZE).map(toAiUsageDTO),
        page: query.page,
        hasNextPage: rows.length > PAGE_SIZE && query.page < 1000,
      },
      summary: toAiUsageSummaryDTO(aggregate),
    };
  });
}
