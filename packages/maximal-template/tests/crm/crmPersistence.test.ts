import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  countAccounts: vi.fn(async () => 55),
  listAccounts: vi.fn(async (_args: unknown) => [{ id: "account-1", name: "Acme" }]),
  countContacts: vi.fn(async () => 32),
  listContacts: vi.fn(async (_args: unknown) => [{ id: "contact-1", firstName: "Ada" }]),
  countDeals: vi.fn(async () => 8),
  listDeals: vi.fn(async (_args: unknown) => [{ id: "deal-1", name: "Renewal", stage: "PROPOSAL" }]),
  analytics: vi.fn(async () => [
    { currency: "USD", stage: "PROPOSAL", count: 150, value: "1250", weighted: "575" },
  ]),
  permission: vi.fn(),
}));

vi.mock("@/lib/db/tenant", () => ({
  withAuthenticatedRead: vi.fn(async (read: (
    tx: unknown,
    context: unknown,
  ) => Promise<unknown>) => read({
    crmAccount: { count: mock.countAccounts, findMany: mock.listAccounts },
    crmContact: { count: mock.countContacts, findMany: mock.listContacts },
    crmDeal: { count: mock.countDeals, findMany: mock.listDeals },
    $queryRaw: mock.analytics,
  }, {
    organizationId: "00000000-0000-4000-8000-000000000010",
  })),
}));

vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: mock.permission,
}));

vi.mock("@/lib/db/dtos/crmDtos", () => ({
  toCrmAccountDTO: (row: unknown) => row,
  toCrmContactDTO: (row: unknown) => row,
  toCrmDealSummaryDTO: (row: unknown) => row,
  toCrmDealDTO: (row: unknown) => row,
}));

import {
  getCrmAccountsPage,
  getCrmContactsPage,
  getCrmDealsPage,
  getCrmDealAnalytics,
} from "@/lib/fetchers/crmFetchers";

describe("CRM persisted lists and aggregates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("scopes contact search and pagination before taking the requested page", async () => {
    const result = await getCrmContactsPage({
      q: "Acme", status: "LEAD", page: "2", pageSize: "10",
      sort: "updated-desc",
    });
    const args = mock.listContacts.mock.calls[0]?.[0] as unknown as {
      where: Record<string, unknown>; skip: number; take: number;
      orderBy: Array<Record<string, string>>;
    };
    expect(args.where.organizationId).toBe("00000000-0000-4000-8000-000000000010");
    expect(args.where.archivedAt).toBeNull();
    expect(args.where.status).toBe("LEAD");
    expect(args.where.OR).toEqual(expect.arrayContaining([
      { account: { name: { contains: "Acme", mode: "insensitive" } } },
    ]));
    expect(args.skip).toBe(10);
    expect(args.take).toBe(10);
    expect(args.orderBy.at(-1)).toEqual({ id: "asc" });
    expect(result.pageInfo.total).toBe(32);
    expect(result.pageInfo.hasNext).toBe(true);
    expect(mock.permission).toHaveBeenCalledWith(expect.anything(), "crm.contact:read");
  });

  it("uses stable account search, status filtering and URL limits", async () => {
    const result = await getCrmAccountsPage({
      q: "soft", status: "ACTIVE", page: 3, pageSize: 20,
      sort: "name-desc",
    });
    const args = mock.listAccounts.mock.calls[0]?.[0] as unknown as {
      where: Record<string, unknown>; skip: number; take: number;
      orderBy: Array<Record<string, string>>;
    };
    expect(args.where.status).toBe("ACTIVE");
    expect(args.where.archivedAt).toBeNull();
    expect(args.skip).toBe(40);
    expect(args.take).toBe(20);
    expect(args.orderBy).toEqual([{ name: "desc" }, { id: "asc" }]);
    expect(result.pageInfo.totalPages).toBe(3);
  });

  it("caps page size at 100 and rejects malformed query values safely", async () => {
    const result = await getCrmAccountsPage({
      q: "", page: "-2", pageSize: "100000",
    });
    expect(result.pageInfo.page).toBe(1);
    expect(result.pageInfo.pageSize).toBe(25);
  });

  it("scopes opportunity search to tenant and stage before pagination", async () => {
    const result = await getCrmDealsPage({
      q: "renew", stage: "PROPOSAL", sort: "value-desc",
    });
    const args = mock.listDeals.mock.calls[0]?.[0] as unknown as {
      where: Record<string, unknown>; orderBy: Array<Record<string, string>>;
    };
    expect(args.where.stage).toBe("PROPOSAL");
    expect(args.where.archivedAt).toBeNull();
    expect(args.where.organizationId).toBe("00000000-0000-4000-8000-000000000010");
    expect(args.orderBy).toEqual([{ value: "desc" }, { id: "asc" }]);
    expect(result.pageInfo.total).toBe(8);
    expect(mock.permission).toHaveBeenCalledWith(expect.anything(), "crm.deal:read");
  });

  it("aggregates a tenant's entire pipeline without the page limit", async () => {
    const rows = await getCrmDealAnalytics();
    expect(rows[0]?.count).toBe(150);
    expect(mock.analytics).toHaveBeenCalledOnce();
    expect(mock.listDeals).not.toHaveBeenCalled();
  });
});
