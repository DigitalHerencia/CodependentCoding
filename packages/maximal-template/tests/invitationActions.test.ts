import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/accessTypes";
import {
  acceptInvitation,
  createInvitation,
  revokeInvitation,
} from "@/lib/actions/commonActions";
import { addAdminMembership } from "@/lib/actions/adminActions";

const state = vi.hoisted(() => ({ tenancy: "single", role: "OWNER" }));
const tx = vi.hoisted(() => ({
  invitation: {
    create: vi.fn(),
    findUnique: vi.fn(),
    updateMany: vi.fn(async () => ({ count: 1 })),
  },
  auditEvent: { create: vi.fn(async () => ({})) },
}));
const organizationId = "00000000-0000-4000-8000-000000000010";
const invitationId = "00000000-0000-4000-8000-000000000021";

vi.mock("@/lib/authz/mode", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/authz/mode")>()),
  get tenancy() { return state.tenancy; },
}));
vi.mock("@/lib/auth/auth", () => ({
  requireIdentity: async () => ({ clerkUserId: "actor" }),
  getVerifiedPrimaryEmail: async () => "invitee@example.test",
}));
vi.mock("@/lib/db/tenant", () => ({
  withTenantTransaction: (_identity: unknown, work: (client: Prisma.TransactionClient, context: AccessContext) => unknown) =>
    work(tx as unknown as Prisma.TransactionClient, { clerkUserId: "actor", userId: "actor", membershipId: "member-actor", organizationId, role: state.role as AccessContext["role"] }),
  withIdentityTransaction: (work: (client: Prisma.TransactionClient, user: { id: string; email: string }) => unknown) =>
    work(tx as unknown as Prisma.TransactionClient, { id: "actor", email: "invitee@example.test" }),
}));
vi.mock("@/lib/cache/invalidate", () => ({ invalidatePaths: vi.fn(), invalidateAllPaths: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  state.tenancy = "single";
  state.role = "OWNER";
  tx.invitation.updateMany.mockResolvedValue({ count: 1 });
});

test.each([
  { name: "create", run: () => createInvitation({ email: "invitee@example.test", role: "MEMBER" }) },
  { name: "approve", run: () => addAdminMembership({ email: "invitee@example.test", role: "MEMBER" }) },
  { name: "accept", run: () => acceptInvitation({ token: "a".repeat(43) }) },
  { name: "revoke", run: () => revokeInvitation({ invitationId }) },
])("single tenancy forbids invitation $name before invitation persistence", async ({ run }) => {
  expect(await run()).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  expect(tx.invitation.create).not.toHaveBeenCalled();
  expect(tx.invitation.findUnique).not.toHaveBeenCalled();
  expect(tx.invitation.updateMany).not.toHaveBeenCalled();
  expect(tx.auditEvent.create).not.toHaveBeenCalled();
});

test("multi tenancy permits an administrator to revoke only in the active organization", async () => {
  state.tenancy = "multi";
  expect(await revokeInvitation({ invitationId })).toEqual({ ok: true, data: { id: invitationId } });
  expect(tx.invitation.updateMany).toHaveBeenCalledWith({ where: { id: invitationId, organizationId, status: "PENDING" }, data: { status: "REVOKED" } });
  expect(tx.auditEvent.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ organizationId, actorUserId: "actor", action: "membership.invitation.revoked" }) }));
});

test("multi tenancy cannot revoke an invitation absent from the active organization", async () => {
  state.tenancy = "multi";
  tx.invitation.updateMany.mockResolvedValueOnce({ count: 0 });
  expect(await revokeInvitation({ invitationId })).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  expect(tx.auditEvent.create).not.toHaveBeenCalled();
});

test("multi tenancy still requires invitation administration permission", async () => {
  state.tenancy = "multi";
  state.role = "VIEWER";
  expect(await revokeInvitation({ invitationId })).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  expect(tx.invitation.updateMany).not.toHaveBeenCalled();
});
