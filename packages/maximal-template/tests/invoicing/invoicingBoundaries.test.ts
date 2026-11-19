import assert from "node:assert/strict";
import { test, vi, beforeEach } from "vitest";

const state = vi.hoisted(() => ({
  denied: false,
  active: false,
  tx: {} as Record<string, unknown>,
  access: {
    organizationId: "tenant-a",
    membershipId: "member-a",
    userId: "actor-a",
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
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: () => {
    if (state.denied)
      throw Object.assign(new Error("Denied"), { code: "FORBIDDEN" });
  },
  hasPermission: () => !state.denied,
}));
import {
  getExpensesPage,
  getExpensePage,
} from "@/lib/fetchers/invoicingFetchers";
import {
  createExpense,
  updateInvoiceStatus,
} from "@/lib/actions/invoicingActions";

beforeEach(() => {
  state.denied = false;
  state.active = false;
  state.tx = {};
});
test("denied reads fail before expense queries", async () => {
  state.denied = true;
  await assert.rejects(getExpensesPage({}), /Denied/);
});
test("expense detail uses a direct authorized ID lookup beyond list pages", async () => {
  const id = "00000000-0000-4000-8000-000000000001";
  let reads = 0;
  state.tx = {
    expense: {
      findFirst: async ({ where }: { where: Record<string, unknown> }) => {
        reads++;
        assert.deepEqual(where, { id, organizationId: "tenant-a" });
        return null;
      },
    },
  };
  assert.equal((await getExpensePage(id)).expense, null);
  assert.equal(reads, 1);
});
test("pagination bounds rows while currency/status summary covers the complete filter", async () => {
  const whereReads: unknown[] = [];
  state.tx = {
    expense: {
      findMany: async (args: {
        where: unknown;
        take: number;
        skip: number;
        orderBy: unknown[];
      }) => {
        whereReads.push(args.where);
        assert.equal(args.take, 2);
        assert.equal(args.skip, 2);
        assert.deepEqual(args.orderBy, [
          { currency: "asc" },
          { amount: "desc" },
          { id: "asc" },
        ]);
        return [];
      },
      count: async (args: { where: unknown }) => {
        whereReads.push(args.where);
        return 9;
      },
      groupBy: async (args: { where: unknown; by: string[] }) => {
        whereReads.push(args.where);
        assert.deepEqual(args.by, ["currency", "status"]);
        return [
          {
            currency: "USD",
            status: "SUBMITTED",
            _count: { _all: 9 },
            _sum: { amount: { toString: () => "999.9999" } },
          },
        ];
      },
    },
  };
  const result = await getExpensesPage({
    page: 2,
    pageSize: 2,
    search: "vendor",
    currency: "USD",
    status: "SUBMITTED",
    sort: "amount-desc",
  });
  assert.deepEqual(whereReads[0], whereReads[1]);
  assert.deepEqual(whereReads[1], whereReads[2]);
  assert.equal(result.pagination.total, 9);
  assert.equal(result.summary[0]?.total, "999.9999");
});
test("expense creation audits within the same authorized financial transaction", async () => {
  let audits = 0;
  const now = new Date("2026-11-18T00:00:00.000Z");
  state.tx = {
    expense: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        assert.equal(state.active, true);
        assert.equal(data.organizationId, "tenant-a");
        assert.equal(data.submittedByMembershipId, "member-a");
        return {
          id: "expense-a",
          updatedAt: now,
          vendor: "Vendor",
          description: "Travel",
          amount: { toString: () => "1.2345" },
          currency: "USD",
          incurredAt: now,
          status: "SUBMITTED",
          submittedBy: null,
        };
      },
    },
    auditEvent: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        assert.equal(state.active, true);
        assert.equal(data.organizationId, "tenant-a");
        assert.equal(data.actorUserId, "actor-a");
        audits++;
      },
    },
  };
  const result = await createExpense({
    vendor: "Vendor",
    description: "Travel",
    amount: "1.2345",
    currency: "USD",
    incurredAt: "2026-11-18",
  });
  assert.equal(result.ok, true);
  assert.equal(audits, 1);
});

test("terminal status requests fail closed without financial mutations or audit events", async () => {
  // No tx models are provided: any financial read or write would fail the test.
  const result = await updateInvoiceStatus({
    invoiceId: "00000000-0000-4000-8000-000000000001",
    expectedVersion: 1,
    status: "PAID",
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.error.code, "VALIDATION");
  assert.deepEqual(state.tx, {});
});
