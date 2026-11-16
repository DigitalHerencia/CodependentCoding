import { createHash } from "node:crypto";
import { beforeEach, expect, test, vi } from "vitest";
import {
  createInvitation,
  acceptInvitation,
  revokeInvitation,
} from "@/lib/actions/invitationActions";
import { getPendingInvitations } from "@/lib/fetchers/invitationFetchers";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/accessTypes";

const state = vi.hoisted(() => ({
  tenancy: "multi",
  administrator: true,
  verifiedEmail: "invitee@example.test" as string | null,
  role: "ADMIN" as AccessContext["role"],
  permission: true,
  tenant: vi.fn(),
  identity: vi.fn(),
  read: vi.fn(),
  admin: vi.fn(),
  accept: vi.fn(),
}));
vi.mock("@/lib/auth/auth", () => ({
  requireIdentity: async () => ({ clerkUserId: "actor" }),
  getVerifiedPrimaryEmail: async () => state.verifiedEmail,
}));
vi.mock("@/lib/authz/mode", () => ({
  get tenancy() {
    return state.tenancy;
  },
}));
vi.mock("@/lib/authz/tenancy", () => ({
  assertInvitationsAllowed: () => {
    if (state.tenancy === "single")
      throw Object.assign(new Error("single tenancy"), { code: "FORBIDDEN" });
  },
}));
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: vi.fn(),
  hasPermission: () => state.permission,
}));
vi.mock("@/lib/db/tenant", () => ({
  withTenantTransaction: state.tenant,
  withIdentityTransaction: state.identity,
  withAuthenticatedRead: state.read,
}));
vi.mock("@/lib/db/transactions/adminTx", () => ({
  assertMembershipAdministratorTx: state.admin,
}));
vi.mock("@/lib/db/transactions/invitationTx", () => ({
  acceptInvitationTx: state.accept,
  hashInvitationToken: (value: string) =>
    createHash("sha256").update(value).digest("hex"),
}));
vi.mock("@/lib/cache/invalidate", () => ({ invalidatePaths: vi.fn() }));

const org = "10000000-0000-4000-8000-000000000001";
const invitationId = "20000000-0000-4000-8000-000000000001";
const record = {
  id: invitationId,
  email: "invitee@example.test",
  role: "MEMBER",
  status: "PENDING",
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 60_000),
  organizationId: org,
};
const tx = {
  invitation: {
    create: vi.fn(),
    updateMany: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  auditEvent: { create: vi.fn() },
};
const access = (): AccessContext => ({
  organizationId: org,
  clerkUserId: "actor",
  userId: "actor",
  membershipId: "membership",
  role: state.role,
});

beforeEach(() => {
  vi.clearAllMocks();
  state.tenancy = "multi";
  state.administrator = true;
  state.verifiedEmail = record.email;
  state.role = "ADMIN";
  state.permission = true;
  state.tenant.mockImplementation(
    async (
      _identity,
      work: (db: Prisma.TransactionClient, context: AccessContext) => unknown,
    ) => work(tx as unknown as Prisma.TransactionClient, access()),
  );
  state.identity.mockImplementation(
    async (
      work: (
        db: Prisma.TransactionClient,
        user: { id: string; email: string },
      ) => unknown,
    ) =>
      work(tx as unknown as Prisma.TransactionClient, {
        id: "invitee",
        email: record.email,
      }),
  );
  state.read.mockImplementation(
    async (
      work: (db: Prisma.TransactionClient, context: AccessContext) => unknown,
    ) => work(tx as unknown as Prisma.TransactionClient, access()),
  );
  state.admin.mockImplementation(async () => {
    if (!state.administrator)
      throw Object.assign(new Error("not admin"), { code: "NOT_FOUND" });
  });
  state.accept.mockResolvedValue({
    membershipId: "joined",
    organizationId: org,
  });
  tx.invitation.create.mockResolvedValue(record);
  tx.invitation.findUnique.mockResolvedValue(record);
  tx.invitation.updateMany.mockResolvedValue({ count: 1 });
  tx.invitation.findMany.mockResolvedValue([record]);
});

test("creation hashes the once-shown token and always uses the active server organization", async () => {
  const result = await createInvitation({
    email: " Invitee@Example.test ",
    role: "MEMBER",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("Creation must succeed in fixture.");
  const token = result.data.path.split("/").at(-1)!;
  expect(token.length).toBeGreaterThanOrEqual(32);
  expect(tx.invitation.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        organizationId: org,
        invitedByUserId: "actor",
        email: record.email,
        role: "MEMBER",
        tokenHash: createHash("sha256").update(token).digest("hex"),
      }),
    }),
  );
  expect(JSON.stringify(result.data.invitation)).not.toContain(token);
  expect(state.admin).toHaveBeenCalledWith(tx, {
    organizationId: org,
    actorUserId: "actor",
  });
});

test.each(["OWNER", "unknown"])(
  "invitation creation refuses role %s",
  async (role) => {
    expect((await createInvitation({ email: record.email, role })).ok).toBe(
      false,
    );
    expect(tx.invitation.create).not.toHaveBeenCalled();
  },
);

test("client organization overrides are rejected by strict validation", async () => {
  expect(
    (
      await createInvitation({
        email: record.email,
        role: "MEMBER",
        organizationId: "other-org",
      })
    ).ok,
  ).toBe(false);
  expect(tx.invitation.create).not.toHaveBeenCalled();
});

test.each(["create", "revoke", "accept"])(
  "single tenancy blocks %s before persistence",
  async (command) => {
    state.tenancy = "single";
    const result =
      command === "create"
        ? await createInvitation({ email: record.email, role: "MEMBER" })
        : command === "revoke"
          ? await revokeInvitation({ invitationId })
          : await acceptInvitation({ token: "x".repeat(43) });
    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    expect(state.tenant).not.toHaveBeenCalled();
    expect(state.identity).not.toHaveBeenCalled();
  },
);

test.each(["create", "revoke"])(
  "%s rechecks administrator authority inside the active tenant",
  async (command) => {
    state.administrator = false;
    const result =
      command === "create"
        ? await createInvitation({ email: record.email, role: "MEMBER" })
        : await revokeInvitation({ invitationId });
    expect(result.ok).toBe(false);
    expect(tx.invitation.create).not.toHaveBeenCalled();
    expect(tx.invitation.updateMany).not.toHaveBeenCalled();
  },
);

test("revocation is restricted to a pending invitation in the actor's organization", async () => {
  expect((await revokeInvitation({ invitationId })).ok).toBe(true);
  expect(tx.invitation.updateMany).toHaveBeenCalledWith({
    where: { id: invitationId, organizationId: org, status: "PENDING" },
    data: { status: "REVOKED" },
  });
});

test.each([null, "different@example.test"])(
  "acceptance refuses an unverified or mismatching identity (%s)",
  async (email) => {
    state.verifiedEmail = email;
    expect((await acceptInvitation({ token: "x".repeat(43) })).ok).toBe(false);
    expect(tx.invitation.findUnique).not.toHaveBeenCalled();
    expect(state.accept).not.toHaveBeenCalled();
  },
);

test.each(["expired", "revoked", "missing"])(
  "acceptance refuses %s invitation with a safe error",
  async (reason) => {
    tx.invitation.findUnique.mockResolvedValueOnce(
      reason === "missing"
        ? null
        : {
            ...record,
            ...(reason === "expired"
              ? { expiresAt: new Date(0) }
              : { status: "REVOKED" }),
          },
    );
    const result = await acceptInvitation({ token: "x".repeat(43) });
    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
    expect(state.accept).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain(record.email);
  },
);

test("acceptance looks up only the verified recipient's token and does not require leaving another organization", async () => {
  const token = "x".repeat(43);
  expect(await acceptInvitation({ token })).toEqual({
    ok: true,
    data: { organizationId: org },
  });
  expect(tx.invitation.findUnique).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        tokenHash: createHash("sha256").update(token).digest("hex"),
        email: record.email,
        requiresToken: true,
      },
    }),
  );
  expect(state.accept).toHaveBeenCalledWith(tx, record, "invitee");
  expect(state.tenant).not.toHaveBeenCalled();
});

test.each(["MEMBER", "VIEWER"] as const)(
  "%s cannot read administrator invitations",
  async (role) => {
    state.role = role;
    expect(await getPendingInvitations()).toEqual({
      canInvite: false,
      invitations: [],
    });
    expect(tx.invitation.findMany).not.toHaveBeenCalled();
  },
);

test("admin list is limited to unexpired pending invitations in the active organization", async () => {
  const result = await getPendingInvitations();
  expect(result.canInvite).toBe(true);
  expect(tx.invitation.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        organizationId: org,
        status: "PENDING",
        expiresAt: { gt: expect.any(Date) },
      },
    }),
  );
});
