/** Customer Authorization.test contracts for the owning application slice. */
import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/authzTypes";
import {
  getPortalBilling,
  getPortalDocument,
  getPortalDocuments,
} from "@/lib/fetchers/portalFetchers";
import { downloadPortalDocument } from "@/lib/actions/portalActions";
import { getOrganizationMembersPage } from "@/lib/fetchers/authzFetchers";
import {
  getSupportAnalytics,
  getSupportInboxPage,
  getSupportTicket,
  getSupportMessagePage,
} from "@/lib/fetchers/supportFetchers";
import {
  assertCustomerRequester,
  hasCustomerRelationship,
} from "@/lib/authz/attributes";
import { grants, permissions } from "@/lib/authz/permissions";
import { updateTicketStatusTx } from "@/lib/db/selects/supportTx";
import { readPrivateBlob } from "@/lib/integrations/vercel-blob/download";

const state = vi.hoisted(() => ({
  userId: "customer-a",
  membershipId: "member-a",
}));
const tx = vi.hoisted(() => ({
  portalDocument: { findMany: vi.fn(), findFirst: vi.fn() },
  membership: { findMany: vi.fn(async () => []) },
  $queryRaw: vi.fn(async () => [
    { id: "00000000-0000-4000-8000-000000000001" },
  ]),
  supportTicket: {
    findMany: vi.fn(async () => []),
    findFirst: vi.fn(async (): Promise<unknown> => null),
    findFirstOrThrow: vi.fn(async (): Promise<unknown> => null),
    updateMany: vi.fn(async () => ({ count: 1 })),
    groupBy: vi.fn(async (): Promise<unknown[]> => []),
  },
  supportMessage: { findMany: vi.fn(async () => []) },
}));

const access = (): AccessContext => ({
  clerkUserId: state.userId,
  userId: state.userId,
  membershipId: state.membershipId,
  organizationId: "00000000-0000-4000-8000-000000000010",
  role: "VIEWER",
});

vi.mock("@/lib/db/tenancy", () => ({
  withAuthenticatedRead: (
    read: (client: Prisma.TransactionClient, context: AccessContext) => unknown,
  ) => read(tx as unknown as Prisma.TransactionClient, access()),
  withTenantTransaction: (
    _identity: unknown,
    work: (client: Prisma.TransactionClient, context: AccessContext) => unknown,
  ) => work(tx as unknown as Prisma.TransactionClient, access()),
}));
vi.mock("@/lib/integrations/clerk/server", () => ({
  requireIdentity: async () => ({ clerkUserId: state.userId }),
}));
vi.mock("@/lib/integrations/vercel-blob/download", () => ({
  readPrivateBlob: vi.fn(),
}));
// The generator replaces this module. Mandatory customer reads/downloads must
// work without consulting either the RBAC or upstream ABAC policy implementation.
vi.mock("@/lib/authz/policies", () => {
  throw new Error("Customer boundary depends on replaceable policy module");
});

beforeEach(() => {
  vi.clearAllMocks();
  state.userId = "customer-a";
  state.membershipId = "member-a";
});

test("two customers in the same organization cannot list tenant-wide memberships or tickets", async () => {
  for (const customer of ["a", "b"]) {
    state.userId = `customer-${customer}`;
    state.membershipId = `member-${customer}`;
    await getOrganizationMembersPage(2);
    expect(tx.membership.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        skip: 50,
        take: 51,
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        where: {
          organizationId: access().organizationId,
          userId: state.userId,
        },
      }),
    );
    await getSupportInboxPage();
    expect(tx.supportTicket.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          requesterUserId: state.userId,
          organizationId: access().organizationId,
        }),
      }),
    );
  }
});

test("a shared portal flag cannot expose private documents or their downstream bytes", async () => {
  expect(await getPortalDocuments()).toEqual([]);
  expect(
    await getPortalDocument("00000000-0000-4000-8000-000000000001"),
  ).toBeNull();
  const result = await downloadPortalDocument({
    documentId: "00000000-0000-4000-8000-000000000001",
  });
  expect(result.ok).toBe(false);
  expect(tx.portalDocument.findMany).not.toHaveBeenCalled();
  expect(tx.portalDocument.findFirst).not.toHaveBeenCalled();
  expect(readPrivateBlob).not.toHaveBeenCalled();
  await expect(getPortalBilling()).rejects.toThrow(/permission/);
});

test.each([
  "ownerMembershipId",
  "assigneeMembershipId",
  "requesterUserId",
] as const)(
  "ABAC customer attribute %s requires an exact relationship in the active tenant",
  (attribute) => {
    const identity =
      attribute === "requesterUserId" ? state.userId : state.membershipId;
    expect(
      hasCustomerRelationship(access(), {
        organizationId: access().organizationId,
        [attribute]: identity,
      }),
    ).toBe(true);
    expect(
      hasCustomerRelationship(access(), {
        organizationId: access().organizationId,
        [attribute]: "another-customer",
      }),
    ).toBe(false);
    expect(
      hasCustomerRelationship(access(), {
        organizationId: "another-tenant",
        [attribute]: identity,
      }),
    ).toBe(false);
  },
);

test("another customer's ticket cannot be read or used to fetch messages", async () => {
  const ticketId = "00000000-0000-4000-8000-000000000001";
  expect(await getSupportTicket(ticketId)).toBeNull();
  await expect(getSupportMessagePage(ticketId)).rejects.toThrow(
    "Ticket was not found in the active organization.",
  );
  expect(tx.supportMessage.findMany).not.toHaveBeenCalled();
  expect(tx.supportTicket.findFirst).toHaveBeenLastCalledWith(
    expect.objectContaining({
      where: {
        id: ticketId,
        organizationId: access().organizationId,
        requesterUserId: "customer-a",
      },
    }),
  );
});

/** Hidden messages cannot influence a customer conversation page or its displayed count. */
test("customer detail and paginated conversation select only visible messages", async () => {
  const ticketId = "00000000-0000-4000-8000-000000000001";
  tx.supportTicket.findFirst.mockResolvedValueOnce({ id: ticketId });
  await expect(getSupportMessagePage(ticketId, 2)).resolves.toEqual({
    messages: [],
    page: 2,
    hasMore: false,
  });
  expect(tx.supportMessage.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        ticketId,
        organizationId: access().organizationId,
        isInternal: false,
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip: 50,
      take: 51,
    }),
  );
  await getSupportTicket(ticketId);
  expect(tx.supportTicket.findFirst).toHaveBeenLastCalledWith(
    expect.objectContaining({
      select: expect.objectContaining({
        _count: { select: { messages: { where: { isInternal: false } } } },
      }),
    }),
  );
});
/** Analytics uses the same requester predicate and includes all active rows in scope. */
test("support analytics counts the complete requester-scoped active queue", async () => {
  tx.supportTicket.groupBy.mockResolvedValueOnce([
    {
      priority: "URGENT",
      status: "WAITING_ON_CUSTOMER",
      assignedMembershipId: null,
      _count: { _all: 71 },
    },
    {
      priority: "NORMAL",
      status: "OPEN",
      assignedMembershipId: "member-b",
      _count: { _all: 36 },
    },
  ]);
  const aggregate = await getSupportAnalytics();
  expect(aggregate.count).toBe(107);
  expect(aggregate.rows[0]).toEqual({
    id: "URGENT",
    priority: "URGENT",
    count: 71,
    unassigned: 71,
    waiting: 71,
  });
  expect(tx.supportTicket.groupBy).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        requesterUserId: state.userId,
        organizationId: access().organizationId,
        status: { not: "CLOSED" },
      },
    }),
  );
  expect(tx.supportTicket.findMany).not.toHaveBeenCalled();
});
/** Closing preserves resolution time, and a stale status change cannot overwrite a newer version. */
test("closing an already resolved ticket retains its resolution timestamp", async () => {
  const ticketId = "00000000-0000-4000-8000-000000000001";
  const resolvedAt = new Date("2026-11-10T09:00:00.000Z");
  const current = {
    version: 3,
    status: "RESOLVED",
    resolvedAt,
    closedAt: null,
  };
  const input = {
    ticketId,
    organizationId: access().organizationId,
    expectedVersion: 3,
    status: "CLOSED",
  } as const;
  const client = tx as unknown as Prisma.TransactionClient;
  tx.supportTicket.findFirst.mockResolvedValueOnce(current);
  tx.supportTicket.findFirstOrThrow.mockResolvedValueOnce({
    ...current,
    version: 4,
    status: "CLOSED",
  });
  await updateTicketStatusTx(client, input);
  expect(tx.supportTicket.updateMany).toHaveBeenCalledWith({
    where: { id: ticketId, organizationId: input.organizationId, version: 3 },
    data: {
      status: "CLOSED",
      resolvedAt,
      closedAt: expect.any(Date),
      version: { increment: 1 },
    },
  });

  tx.supportTicket.findFirst.mockResolvedValueOnce({
    ...current,
    version: 4,
    status: "CLOSED",
  });
  await expect(updateTicketStatusTx(client, input)).rejects.toMatchObject({
    code: "CONFLICT",
  });
  expect(tx.supportTicket.updateMany).toHaveBeenCalledTimes(1);
});

test("customer relationships fail closed across tenants and support writes require the requester", () => {
  expect(
    hasCustomerRelationship(access(), {
      organizationId: access().organizationId,
      ownerMembershipId: "member-b",
    }),
  ).toBe(false);
  expect(
    hasCustomerRelationship(access(), {
      organizationId: "another-tenant",
      ownerMembershipId: "member-a",
    }),
  ).toBe(false);
  expect(() =>
    assertCustomerRequester(access(), {
      organizationId: access().organizationId,
      requesterUserId: "customer-b",
    }),
  ).toThrow(/Access denied/);
  expect(() =>
    assertCustomerRequester(access(), {
      organizationId: access().organizationId,
      requesterUserId: "customer-a",
    }),
  ).not.toThrow();
});

test("role grants use declared module vocabulary and customers have no private invoice/billing grants", () => {
  const declared = new Set(permissions);
  for (const roleGrants of Object.values(grants))
    for (const permission of roleGrants)
      expect(declared.has(permission)).toBe(true);
  expect(grants.VIEWER.has("invoicing.invoice:read")).toBe(false);
  expect(grants.VIEWER.has("portal.billing:read")).toBe(false);
});
