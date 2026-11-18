/** Existing administration expectations for the current domain API. */
import { beforeEach, expect, test, vi } from "vitest";
import type * as TenancyMode from "@/lib/authz/mode";
import type { Prisma } from "@/generated/prisma/client";
import { updateMembershipAdministrationTx } from "@/lib/db/selects/adminTx";
import { SINGLE_ORGANIZATION_ID } from "@/lib/authz/mode";

const mode = vi.hoisted(() => ({ tenancy: "single" }));
vi.mock("@/lib/authz/mode", async (importOriginal) => ({
  ...(await importOriginal<typeof TenancyMode>()),
  get tenancy() {
    return mode.tenancy;
  },
}));
beforeEach(() => {
  mode.tenancy = "single";
});

const input = {
  organizationId: SINGLE_ORGANIZATION_ID,
  actorUserId: "admin",
  membershipId: "target",
};

function fixture(
  actor: { role: string; status: string; deniedPermissions?: string[] } | null,
  targetRole = "MEMBER",
) {
  const update = vi.fn(async () => ({
    id: "target",
    role: "VIEWER",
    status: "ACTIVE",
    deniedPermissions: [],
  }));
  const create = vi.fn();
  const findFirst = vi.fn(async () => ({
    id: "target",
    userId: "other-user",
    role: targetRole,
    status: "ACTIVE",
    deniedPermissions: [],
  }));
  const tx = {
    $executeRaw: vi.fn(async () => 1),
    $queryRaw: vi.fn(async () =>
      actor ? [{ deniedPermissions: [], ...actor }] : [],
    ),
    membership: { findFirst, update },
    invitation: { create },
    auditEvent: { create: vi.fn(async () => ({})) },
  } as unknown as Prisma.TransactionClient;
  return { tx, update, create, findFirst };
}

test.each(["OWNER", "ADMIN"])(
  "%s can administer a non-owner in the selected organization",
  async (role) => {
    const { tx, update, findFirst } = fixture({ role, status: "ACTIVE" });
    await updateMembershipAdministrationTx(tx, { ...input, role: "VIEWER" });
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "target", organizationId: SINGLE_ORGANIZATION_ID },
      }),
    );
    expect(update).toHaveBeenCalledOnce();
    expect(tx.$queryRaw).toHaveBeenCalledWith(
      expect.any(Array),
      SINGLE_ORGANIZATION_ID,
      "admin",
    );
  },
);

test.each([{ role: "OWNER" as const }, { status: "SUSPENDED" as const }])(
  "routine administration cannot alter an owner: %j",
  async (change) => {
    const { tx, update } = fixture(
      { role: "ADMIN", status: "ACTIVE" },
      "OWNER",
    );
    await expect(
      updateMembershipAdministrationTx(tx, { ...input, ...change }),
    ).rejects.toThrow(/Ownership/);
    expect(update).not.toHaveBeenCalled();
  },
);

test("ADMIN cannot grant OWNER to a non-owner", async () => {
  const { tx, update } = fixture({ role: "ADMIN", status: "ACTIVE" });
  await expect(
    updateMembershipAdministrationTx(tx, { ...input, role: "OWNER" }),
  ).rejects.toThrow(/Ownership/);
  expect(update).not.toHaveBeenCalled();
});

test.each([
  null,
  { role: "VIEWER", status: "ACTIVE" },
  { role: "ADMIN", status: "REVOKED" },
])(
  "missing, foreign, customer or revoked administrators cannot mutate: %j",
  async (actor) => {
    const { tx, update } = fixture(actor);
    await expect(
      updateMembershipAdministrationTx(tx, { ...input, status: "SUSPENDED" }),
    ).rejects.toThrow(/Administrator/);
    expect(update).not.toHaveBeenCalled();
  },
);

test("a permission revoked after access resolution is rechecked under the actor lock", async () => {
  const { tx, update } = fixture({
    role: "ADMIN",
    status: "ACTIVE",
    deniedPermissions: ["admin.membership:update"],
  });
  await expect(
    updateMembershipAdministrationTx(tx, {
      ...input,
      permission: "admin.membership:update",
      role: "VIEWER",
    }),
  ).rejects.toThrow(/permission/);
  expect(update).not.toHaveBeenCalled();
});

test("single tenancy rejects an arbitrary other organization before mutation", async () => {
  const { tx, update } = fixture({ role: "OWNER", status: "ACTIVE" });
  await expect(
    updateMembershipAdministrationTx(tx, {
      ...input,
      organizationId: "00000000-0000-4000-8000-000000000099",
      role: "VIEWER",
    }),
  ).rejects.toThrow(/Organization/);
  expect(update).not.toHaveBeenCalled();
});
