import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  generations: vi.fn(async (_args: unknown) =>
    Array.from({ length: 21 }, (_, id) => ({ id: `generation-${id}` })),
  ),
  grouped: vi.fn(async (_args: unknown) => [
    { status: "SUCCEEDED", _count: { _all: 500 } },
    { status: "FAILED", _count: { _all: 3 } },
    { status: "RUNNING", _count: { _all: 2 } },
  ]),
  usage: vi.fn(async (_args: unknown) =>
    Array.from({ length: 21 }, (_, id) => ({ id: `usage-${id}` })),
  ),
  aggregate: vi.fn(async (_args: unknown) => ({
    _sum: { inputTokens: null, outputTokens: 0, cost: null },
    _count: { _all: 500, inputTokens: 0, outputTokens: 1, cost: 0 },
  })),
  count: vi.fn(async (_args: unknown) => 900),
  permission: vi.fn(),
  hasPermission: vi.fn(() => true),
}));
vi.mock("@/lib/db/tenancy", () => ({
  withAuthenticatedRead: vi.fn(
    async (read: (tx: unknown, access: unknown) => Promise<unknown>) =>
      read(
        {
          aiGeneration: { findMany: mock.generations, groupBy: mock.grouped },
          aiUsageLedger: {
            findMany: mock.usage,
            aggregate: mock.aggregate,
            count: mock.count,
          },
        },
        { organizationId: "organization-1", userId: "user-1" },
      ),
  ),
}));
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: mock.permission,
  hasPermission: mock.hasPermission,
}));
vi.mock("@/lib/db/dtos/aiDtos", () => ({
  toAiGenerationDTO: (row: unknown) => row,
  toAiUsageDTO: (row: unknown) => row,
  toAiUsageSummaryDTO: (aggregate: unknown) => aggregate,
}));

import { getAiOverviewData, getAiUsageData } from "@/lib/fetchers/aiFetchers";

const scope = {
  from: new Date("2026-10-19T00:00:00Z"),
  to: new Date("2026-11-18T00:00:00Z"),
};
const owner = { organizationId: "organization-1", userId: "user-1" };

/** Read integration sources verify tenancy, permission and bounded queries using transactional doubles. */
describe("AI persisted read boundaries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mock.permission.mockImplementation(() => undefined);
  });

  it("paginates owned history deterministically and aggregates the complete authorized date window", async () => {
    const view = await getAiOverviewData({ page: "2" }, scope);
    expect(mock.permission).toHaveBeenCalledWith(
      expect.objectContaining(owner),
      "ai.generation:read",
    );
    expect(mock.generations).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { ...owner, createdAt: { gte: scope.from, lt: scope.to } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: 20,
        take: 21,
      }),
    );
    expect(view.generations.items).toHaveLength(20);
    expect(view.generations.hasNextPage).toBe(true);
    expect(view.generationCount).toBe(505);
    expect(view.succeededCount).toBe(500);
    expect(mock.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          ...owner,
          occurredAt: { gte: scope.from, lt: scope.to },
          measurementVersion: 1,
        },
        _sum: { inputTokens: true, outputTokens: true, cost: true },
      }),
    );
    expect(mock.count).toHaveBeenCalledWith({
      where: { ...owner, occurredAt: { gte: scope.from, lt: scope.to } },
    });
    expect(view.summary).toHaveProperty("_count._all", 900);
    expect(view.summary).toHaveProperty("_count.outputTokens", 1);
    expect(mock.usage).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });

  it("bounds usage records but never applies pagination to aggregate totals", async () => {
    const view = await getAiUsageData({ page: 3 }, scope);
    expect(mock.usage).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { ...owner, occurredAt: { gte: scope.from, lt: scope.to } },
        skip: 40,
        take: 21,
      }),
    );
    expect(view.usage.items).toHaveLength(20);
    expect(view.usage.page).toBe(3);
    const aggregateArgs = mock.aggregate.mock.calls[0]?.[0];
    expect(aggregateArgs).not.toHaveProperty("skip");
    expect(aggregateArgs).not.toHaveProperty("take");
  });

  it("denies before querying records when AI read permission is absent", async () => {
    mock.permission.mockImplementation(() => {
      throw new Error("forbidden");
    });
    await expect(getAiUsageData({}, scope)).rejects.toThrow("forbidden");
    expect(mock.usage).not.toHaveBeenCalled();
    expect(mock.aggregate).not.toHaveBeenCalled();
    expect(mock.count).not.toHaveBeenCalled();
  });

  it("rejects unbounded pagination before issuing database reads", async () => {
    await expect(getAiOverviewData({ page: 1001 }, scope)).rejects.toThrow();
    expect(mock.generations).not.toHaveBeenCalled();
    expect(mock.aggregate).not.toHaveBeenCalled();
    expect(mock.count).not.toHaveBeenCalled();
  });
});
