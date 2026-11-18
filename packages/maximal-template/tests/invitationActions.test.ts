/** Invitation Actions.test contracts for the owning application slice. */
import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/authzTypes";
import {
  createInvitation,
  revokeInvitation,
} from "@/lib/actions/invitationActions";
import type * as AuthzMode from "@/lib/authz/mode";
import { SINGLE_ORGANIZATION_ID } from "@/lib/authz/mode";

const state = vi.hoisted(() => ({ tenancy: "single", role: "OWNER" }));
const tx = vi.hoisted(() => ({
  $executeRaw: vi.fn(async () => 0),
  $queryRaw: vi.fn(async () => [
    { role: state.role, status: "ACTIVE", deniedPermissions: [] },
  ]),
  invitation: {
    create: vi.fn(),
    findUnique: vi.fn(),
    updateMany: vi.fn(async () => ({ count: 1 })),
  },
  auditEvent: { create: vi.fn(async () => ({})) },
}));
const organizationId = SINGLE_ORGANIZATION_ID;
const invitationId = "00000000-0000-4000-8000-000000000021";

vi.mock("@/lib/authz/mode", async (importOriginal) => ({
  ...(await importOriginal<typeof AuthzMode>()),
  get tenancy() {
    return state.tenancy;
  },
}));
vi.mock("@/lib/integrations/clerk/server", () => ({
  requireIdentity: async () => ({ clerkUserId: "actor" }),
  getVerifiedPrimaryEmail: async () => "invitee@example.test",
}));
vi.mock("@/lib/db/rls", () => ({
  setRlsContext: vi.fn(async () => {}),
  withIdentityTransaction: (
    work: (
      client: Prisma.TransactionClient,
      user: { id: string; email: string },
    ) => unknown,
  ) =>
    work(tx as unknown as Prisma.TransactionClient, {
      id: "actor",
      email: "invitee@example.test",
    }),
}));
vi.mock("@/lib/db/tenancy", () => ({
  withTenantTransaction: (
    _identity: unknown,
    work: (client: Prisma.TransactionClient, context: AccessContext) => unknown,
  ) =>
    work(tx as unknown as Prisma.TransactionClient, {
      clerkUserId: "actor",
      userId: "actor",
      membershipId: "member-actor",
      organizationId,
      role: state.role as AccessContext["role"],
    }),
}));
vi.mock("@/lib/cache/invalidate", () => ({
  invalidatePaths: vi.fn(),
  invalidateAllPaths: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  state.tenancy = "single";
  state.role = "OWNER";
  tx.invitation.updateMany.mockResolvedValue({ count: 1 });
});

test("single tenancy permits an administrator invitation inside the configured organization", async () => {
  tx.invitation.create.mockResolvedValueOnce({
    id: invitationId,
    email: "invitee@example.test",
    role: "MEMBER",
    status: "PENDING",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
  });
  const result = await createInvitation({
    email: "invitee@example.test",
    role: "MEMBER",
  });
  expect(result.ok).toBe(true);
  expect(tx.invitation.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ organizationId, role: "MEMBER" }),
    }),
  );
  expect(tx.auditEvent.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        action: "membership.invitation.created",
        organizationId,
      }),
    }),
  );
});

test("multi tenancy permits an administrator to revoke only in the active organization", async () => {
  state.tenancy = "multi";
  expect(await revokeInvitation({ invitationId })).toEqual({
    ok: true,
    data: { id: invitationId },
  });
  expect(tx.invitation.updateMany).toHaveBeenCalledWith({
    where: { id: invitationId, organizationId, status: "PENDING" },
    data: { status: "REVOKED" },
  });
  expect(tx.auditEvent.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        organizationId,
        actorUserId: "actor",
        action: "membership.invitation.revoked",
      }),
    }),
  );
});

test("multi tenancy cannot revoke an invitation absent from the active organization", async () => {
  state.tenancy = "multi";
  tx.invitation.updateMany.mockResolvedValueOnce({ count: 0 });
  expect(await revokeInvitation({ invitationId })).toMatchObject({
    ok: false,
    error: { code: "NOT_FOUND" },
  });
  expect(tx.auditEvent.create).not.toHaveBeenCalled();
});

test("multi tenancy still requires invitation administration permission", async () => {
  state.tenancy = "multi";
  state.role = "VIEWER";
  expect(await revokeInvitation({ invitationId })).toMatchObject({
    ok: false,
    error: { code: "FORBIDDEN" },
  });
  expect(tx.invitation.updateMany).not.toHaveBeenCalled();
});
