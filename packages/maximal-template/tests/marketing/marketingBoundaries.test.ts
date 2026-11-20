import assert from "node:assert/strict";
import { beforeEach, test, vi } from "vitest";

const state = vi.hoisted(() => ({
  denied: false,
  active: false,
  tx: {} as Record<string, unknown>,
  access: {
    organizationId: "tenant-a",
    membershipId: "member-a",
    userId: "actor-a",
    role: "MEMBER",
  },
}));
vi.mock("@/lib/db/tenancy", () => ({
  withAuthenticatedRead: async (
    work: (tx: unknown, access: unknown) => Promise<unknown>,
  ) => work(state.tx, state.access),
  withTenantTransaction: async (
    _identity: unknown,
    work: (tx: unknown, access: unknown) => Promise<unknown>,
  ) => {
    state.active = true;
    try {
      return await work(state.tx, state.access);
    } finally {
      state.active = false;
    }
  },
}));
vi.mock("@/lib/integrations/clerk/server", () => ({
  requireIdentity: async () => ({ clerkUserId: "clerk-a" }),
}));
vi.mock("@/lib/cache/invalidate", () => ({ invalidatePaths: vi.fn() }));
import { invalidatePaths } from "@/lib/cache/invalidate";
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: () => {
    if (state.denied)
      throw Object.assign(new Error("Denied"), { code: "FORBIDDEN" });
  },
  hasPermission: () => !state.denied,
}));
import {
  getCampaign,
  getCampaigns,
  getCampaignSteps,
  getMarketingAnalytics,
} from "@/lib/fetchers/marketingFetchers";
import {
  updateAudience,
  updateCampaign,
  updateCampaignStatus,
} from "@/lib/actions/marketingActions";

const id = "00000000-0000-4000-8000-000000000001";
beforeEach(() => {
  vi.clearAllMocks();
  state.denied = false;
  state.active = false;
  state.tx = {};
});

test("denied reads and mutations fail before querying marketing records", async () => {
  state.denied = true;
  await assert.rejects(getCampaign(id), /Denied/);
  const result = await updateCampaignStatus({
    campaignId: id,
    expectedVersion: 1,
    status: "ACTIVE",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "FORBIDDEN");
});

test("detail lookup reads the requested tenant ID directly, independent of list caps", async () => {
  const findFirst = vi.fn(async (_args: unknown) => null);
  state.tx = { campaign: { findFirst } };
  assert.equal(await getCampaign(id), null);
  assert.equal(findFirst.mock.calls.length, 1);
  const call = findFirst.mock.calls[0]?.[0] as { where: unknown };
  assert.deepEqual(call.where, { id, organizationId: "tenant-a" });
});

test("campaign search, status and pagination are sent to the database with a deterministic order", async () => {
  const count = vi.fn(async () => 105);
  const findMany = vi.fn(async (_args: unknown) => []);
  state.tx = { campaign: { count, findMany } };
  const page = await getCampaigns({
    search: "Launch",
    status: "DRAFT",
    page: 2,
    pageSize: 20,
  });
  assert.equal(page.total, 105);
  assert.equal(page.pageCount, 6);
  const args = findMany.mock.calls[0]?.[0] as {
    where: { organizationId: string; status: string; OR: unknown[] };
    orderBy: unknown;
    skip: number;
    take: number;
  };
  assert.equal(args.where.organizationId, "tenant-a");
  assert.equal(args.where.status, "DRAFT");
  assert.equal(args.where.OR.length, 2);
  assert.equal(args.skip, 20);
  assert.equal(args.take, 20);
  assert.deepEqual(args.orderBy, [{ updatedAt: "desc" }, { id: "asc" }]);
});

test("campaign steps use their own bounded page after checking the owning campaign", async () => {
  const findMany = vi.fn(async (_args: unknown) => []);
  state.tx = {
    campaign: { findFirst: async () => ({ id }) },
    campaignStep: { count: async () => 73, findMany },
  };
  const result = await getCampaignSteps(id, 2);
  assert.equal(result.total, 73);
  const args = findMany.mock.calls[0]?.[0] as {
    where: unknown;
    take: number;
    skip: number;
  };
  assert.deepEqual(args.where, { campaignId: id, organizationId: "tenant-a" });
  assert.equal(args.take, 50);
  assert.equal(args.skip, 50);
});

test("analytics aggregate the complete UTC creation range without inferring telemetry", async () => {
  const groupBy = vi.fn(async (_args: unknown) => [
    { status: "DRAFT", _count: { _all: 104 } },
  ]);
  state.tx = {
    campaign: { groupBy, findMany: async () => [] },
    audience: {
      groupBy: async () => [{ status: "ACTIVE", _count: { _all: 9 } }],
    },
    campaignStep: { count: async () => 11 },
  };
  const result = await getMarketingAnalytics({
    from: "2026-11-01T00:00:00.000Z",
    to: "2026-12-01T00:00:00.000Z",
  });
  assert.equal(result.campaignTotal, 104);
  assert.equal(result.audienceTotal, 9);
  assert.equal(result.stepTotal, 11);
  assert.equal("delivered" in result, false);
  const args = groupBy.mock.calls[0]?.[0] as {
    where: { createdAt: unknown; organizationId: string };
  };
  assert.deepEqual(args.where.createdAt, {
    gte: new Date("2026-11-01T00:00:00.000Z"),
    lt: new Date("2026-12-01T00:00:00.000Z"),
  });
  assert.equal(args.where.organizationId, "tenant-a");
});

test("stale campaign versions return conflict without modifying data or audit history", async () => {
  const updateMany = vi.fn();
  const audit = vi.fn();
  state.tx = {
    campaign: { findFirst: async () => ({ id, version: 2 }), updateMany },
    auditEvent: { create: audit },
  };
  const result = await updateCampaign({
    campaignId: id,
    expectedVersion: 1,
    name: "Stale edit",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "CONFLICT");
  assert.equal(updateMany.mock.calls.length, 0);
  assert.equal(audit.mock.calls.length, 0);
  assert.equal(vi.mocked(invalidatePaths).mock.calls.length, 0);
});

test("terminal lifecycle commands reject enum-valid restarts before any write", async () => {
  const updateMany = vi.fn();
  state.tx = {
    campaign: {
      findFirst: async () => ({ id, version: 1, status: "COMPLETED" }),
      updateMany,
    },
  };
  const result = await updateCampaignStatus({
    campaignId: id,
    expectedVersion: 1,
    status: "ACTIVE",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "VALIDATION");
  assert.equal(updateMany.mock.calls.length, 0);
});

test("complex audience definitions survive metadata updates and audit stays in the transaction", async () => {
  const updatedAt = new Date("2026-11-20T01:00:00.000Z");
  const definition = {
    operator: "or",
    rules: [{ field: "country", operator: "equals", value: "US" }],
  };
  const updateMany = vi.fn(async (_args: unknown) => ({ count: 1 }));
  const audit = vi.fn(async () => {
    assert.equal(state.active, true);
    return { id: "audit-a" };
  });
  state.tx = {
    audience: {
      findFirst: async () => ({ id, updatedAt, definition }),
      updateMany,
      findFirstOrThrow: async () => ({
        id,
        name: "Renamed",
        status: "ACTIVE",
        definition,
        createdAt: updatedAt,
        updatedAt,
      }),
    },
    auditEvent: { create: audit },
  };
  const result = await updateAudience({
    audienceId: id,
    expectedUpdatedAt: updatedAt.toISOString(),
    name: "Renamed",
    status: "ACTIVE",
  });
  assert.equal(result.ok, true);
  const args = updateMany.mock.calls[0]?.[0] as {
    data: Record<string, unknown>;
    where: { updatedAt: { gte: Date; lt: Date } };
  };
  assert.equal("definition" in args.data, false);
  assert.equal(
    args.where.updatedAt.lt.getTime() - args.where.updatedAt.gte.getTime(),
    1,
  );
  assert.equal(audit.mock.calls.length, 1);
  assert.equal(vi.mocked(invalidatePaths).mock.calls.length, 1);
  assert.equal(
    vi
      .mocked(invalidatePaths)
      .mock.calls[0]?.[0].includes("/marketing/analytics"),
    true,
  );
});

test("direct replacement of a complex definition is rejected explicitly instead of silently changing rules", async () => {
  const updatedAt = new Date("2026-11-20T01:00:00.000Z");
  const updateMany = vi.fn();
  state.tx = {
    audience: {
      findFirst: async () => ({
        id,
        updatedAt,
        definition: { operator: "or", rules: [] },
      }),
      updateMany,
    },
  };
  const result = await updateAudience({
    audienceId: id,
    expectedUpdatedAt: updatedAt.toISOString(),
    name: "New name",
    status: "ACTIVE",
    definition: {
      operator: "and",
      rules: [{ field: "status", operator: "equals", value: "active" }],
    },
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "VALIDATION");
  assert.equal(updateMany.mock.calls.length, 0);
  assert.equal(vi.mocked(invalidatePaths).mock.calls.length, 0);
});
