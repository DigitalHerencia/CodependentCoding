import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/accessTypes";
import { getPortalBilling, getPortalDocument, getPortalDocuments } from "@/lib/fetchers/portalFetchers";
import { downloadPortalDocument } from "@/lib/actions/portalActions";
import { getOrganizationMembers } from "@/lib/fetchers/organizationFetchers";
import { getSupportInbox, getSupportTicket, getSupportMessages } from "@/lib/fetchers/supportFetchers";
import { assertCustomerRequester, hasCustomerRelationship } from "@/lib/authz/attributes";
import { grants, permissions } from "@/lib/authz/permissions";
import { readPrivateBlob } from "@/lib/integrations/vercel-blob/download";

const state = vi.hoisted(() => ({ userId: "customer-a", membershipId: "member-a" }));
const tx = vi.hoisted(() => ({
  portalDocument: { findMany: vi.fn(), findFirst: vi.fn() },
  membership: { findMany: vi.fn(async () => []) },
  supportTicket: { findMany: vi.fn(async () => []), findFirst: vi.fn(async () => null) },
  supportMessage: { findMany: vi.fn() },
}));

const access = (): AccessContext => ({ clerkUserId: state.userId, userId: state.userId, membershipId: state.membershipId, organizationId: "00000000-0000-4000-8000-000000000010", role: "VIEWER" });

vi.mock("@/lib/db/tenant", () => ({
  withAuthenticatedRead: (read: (client: Prisma.TransactionClient, context: AccessContext) => unknown) => read(tx as unknown as Prisma.TransactionClient, access()),
  withTenantTransaction: (_identity: unknown, work: (client: Prisma.TransactionClient, context: AccessContext) => unknown) => work(tx as unknown as Prisma.TransactionClient, access()),
}));
vi.mock("@/lib/auth/auth", () => ({ requireIdentity: async () => ({ clerkUserId: state.userId }) }));
vi.mock("@/lib/integrations/vercel-blob/download", () => ({ readPrivateBlob: vi.fn() }));
// The generator replaces this module. Mandatory customer reads/downloads must
// work without consulting either the RBAC or upstream ABAC policy implementation.
vi.mock("@/lib/authz/policies", () => { throw new Error("Customer boundary depends on replaceable policy module"); });

beforeEach(() => {
  vi.clearAllMocks();
  state.userId = "customer-a";
  state.membershipId = "member-a";
});

test("two customers in the same organization cannot list tenant-wide memberships or tickets", async () => {
  for (const customer of ["a", "b"]) {
    state.userId = `customer-${customer}`;
    state.membershipId = `member-${customer}`;
    await getOrganizationMembers();
    expect(tx.membership.findMany).toHaveBeenLastCalledWith(expect.objectContaining({ where: { organizationId: access().organizationId, userId: state.userId } }));
    await getSupportInbox();
    expect(tx.supportTicket.findMany).toHaveBeenLastCalledWith(expect.objectContaining({ where: expect.objectContaining({ requesterUserId: state.userId, organizationId: access().organizationId }) }));
  }
});

test("a shared portal flag cannot expose private documents or their downstream bytes", async () => {
  expect(await getPortalDocuments()).toEqual([]);
  expect(await getPortalDocument("00000000-0000-4000-8000-000000000001")).toBeNull();
  const result = await downloadPortalDocument({ documentId: "00000000-0000-4000-8000-000000000001" });
  expect(result.ok).toBe(false);
  expect(tx.portalDocument.findMany).not.toHaveBeenCalled();
  expect(tx.portalDocument.findFirst).not.toHaveBeenCalled();
  expect(readPrivateBlob).not.toHaveBeenCalled();
  await expect(getPortalBilling()).rejects.toThrow(/permission/);
});

test.each(["ownerMembershipId", "assigneeMembershipId", "requesterUserId"] as const)("ABAC customer attribute %s requires an exact relationship in the active tenant", (attribute) => {
  const identity = attribute === "requesterUserId" ? state.userId : state.membershipId;
  expect(hasCustomerRelationship(access(), { organizationId: access().organizationId, [attribute]: identity })).toBe(true);
  expect(hasCustomerRelationship(access(), { organizationId: access().organizationId, [attribute]: "another-customer" })).toBe(false);
  expect(hasCustomerRelationship(access(), { organizationId: "another-tenant", [attribute]: identity })).toBe(false);
});

test("another customer's ticket cannot be read or used to fetch messages", async () => {
  const ticketId = "00000000-0000-4000-8000-000000000001";
  expect(await getSupportTicket(ticketId)).toBeNull();
  await expect(getSupportMessages(ticketId)).rejects.toThrow("Ticket not found");
  expect(tx.supportMessage.findMany).not.toHaveBeenCalled();
  expect(tx.supportTicket.findFirst).toHaveBeenLastCalledWith(expect.objectContaining({ where: { id: ticketId, organizationId: access().organizationId, requesterUserId: "customer-a" } }));
});

test("customer relationships fail closed across tenants and support writes require the requester", () => {
  expect(hasCustomerRelationship(access(), { organizationId: access().organizationId, ownerMembershipId: "member-b" })).toBe(false);
  expect(hasCustomerRelationship(access(), { organizationId: "another-tenant", ownerMembershipId: "member-a" })).toBe(false);
  expect(() => assertCustomerRequester(access(), { organizationId: access().organizationId, requesterUserId: "customer-b" })).toThrow(/Access denied/);
  expect(() => assertCustomerRequester(access(), { organizationId: access().organizationId, requesterUserId: "customer-a" })).not.toThrow();
});

test("role grants use declared module vocabulary and customers have no private invoice/billing grants", () => {
  const declared = new Set(permissions);
  for (const roleGrants of Object.values(grants))
    for (const permission of roleGrants) expect(declared.has(permission)).toBe(true);
  expect(grants.VIEWER.has("invoicing.invoice:read")).toBe(false);
  expect(grants.VIEWER.has("portal.billing:read")).toBe(false);
});
