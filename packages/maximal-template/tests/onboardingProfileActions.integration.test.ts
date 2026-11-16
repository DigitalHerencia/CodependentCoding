import { beforeEach, expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext } from "@/types/accessTypes";
import {
  completeOnboarding,
  updateOwnOnboardingProfile,
} from "@/lib/actions/onboardingActions";
import { getOwnOnboardingProfile } from "@/lib/fetchers/onboardingFetchers";

const mocks = vi.hoisted(() => ({
  identity: vi.fn(),
  email: vi.fn(),
  tenant: vi.fn(),
  identityTransaction: vi.fn(),
  read: vi.fn(),
  complete: vi.fn(),
  provision: vi.fn(),
  update: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/auth/auth", () => ({
  requireIdentity: mocks.identity,
  getVerifiedPrimaryEmail: mocks.email,
}));
vi.mock("@/lib/db/tenant", () => ({
  withTenantTransaction: mocks.tenant,
  withIdentityTransaction: mocks.identityTransaction,
  withAuthenticatedRead: mocks.read,
  TenantContextError: class extends Error {},
}));
vi.mock("@/lib/db/transactions/onboardingTx", () => ({
  completeOnboardingTx: mocks.complete,
  provisionWorkspaceAccessTx: mocks.provision,
  updateOwnOnboardingProfileTx: mocks.update,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));

const tx = {
  user: { findUniqueOrThrow: vi.fn() },
} as unknown as Prisma.TransactionClient;
const access = {
  userId: "user_fixture",
  organizationId: "org_fixture",
  membershipId: "member_fixture",
  clerkUserId: "user_fixture",
  role: "MEMBER",
} satisfies AccessContext;

beforeEach(() => {
  vi.clearAllMocks();
  mocks.identity.mockResolvedValue({ clerkUserId: "user_fixture" });
  mocks.email.mockResolvedValue("fixture@example.test");
  mocks.update.mockResolvedValue({ count: 1 });
  mocks.tenant.mockImplementation(
    async (
      _identity: unknown,
      work: (
        tx: Prisma.TransactionClient,
        access: AccessContext,
      ) => Promise<unknown>,
    ) => work(tx, access),
  );
  mocks.read.mockImplementation(
    async (
      work: (
        tx: Prisma.TransactionClient,
        access: AccessContext,
      ) => Promise<unknown>,
    ) => work(tx, access),
  );
  mocks.identityTransaction.mockImplementation(
    async (
      work: (
        tx: Prisma.TransactionClient,
        user: { id: string; displayName: string | null; email: string },
      ) => Promise<unknown>,
    ) =>
      work(tx, {
        id: "user_fixture",
        displayName: null,
        email: "fixture@example.test",
      }),
  );
});

test("initial completion retains independent verified-email provisioning", async () => {
  expect((await completeOnboarding({ name: "Fixture" })).ok).toBe(true);
  expect(mocks.complete).toHaveBeenCalledWith(tx, "user_fixture", "Fixture");
  expect(mocks.provision).toHaveBeenCalledWith(
    tx,
    { id: "user_fixture", displayName: "Fixture" },
    "fixture@example.test",
  );
  expect(mocks.update).not.toHaveBeenCalled();
});

test("editing derives identity from the active-member wrapper and never provisions memberships", async () => {
  expect(
    (await updateOwnOnboardingProfile({ name: "Updated fixture" })).ok,
  ).toBe(true);
  expect(mocks.tenant).toHaveBeenCalledWith(
    { clerkUserId: "user_fixture" },
    expect.any(Function),
  );
  expect(mocks.update).toHaveBeenCalledExactlyOnceWith(
    tx,
    "user_fixture",
    "Updated fixture",
  );
  expect(mocks.provision).not.toHaveBeenCalled();
  expect(mocks.complete).not.toHaveBeenCalled();
});

test.each(["SUSPENDED", "REVOKED", "NO_MEMBERSHIP", "INCOMPLETE_PROFILE"])(
  "%s cannot bypass the edit gate",
  async () => {
    mocks.tenant.mockRejectedValueOnce(
      Object.assign(new Error("fixture denied"), { code: "FORBIDDEN" }),
    );
    const result = await updateOwnOnboardingProfile({ name: "Denied fixture" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  },
);

test("a client cannot select another user or tenant for the profile update", async () => {
  const result = await updateOwnOnboardingProfile({
    name: "Fixture",
    userId: "other_user",
    organizationId: "other_org",
  });
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error.code).toBe("VALIDATION");
  expect(mocks.update).not.toHaveBeenCalled();
});

test("a disappeared or incomplete profile is not silently recreated during editing", async () => {
  mocks.update.mockResolvedValueOnce({ count: 0 });
  const result = await updateOwnOnboardingProfile({ name: "Fixture" });
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error.code).toBe("NOT_FOUND");
  expect(mocks.provision).not.toHaveBeenCalled();
  expect(mocks.revalidate).not.toHaveBeenCalled();
});

test("profile reads select only the active caller and serialize the DB completion authority", async () => {
  const completedAt = new Date("2026-01-01T00:00:00.000Z");
  const find = vi.mocked(tx.user.findUniqueOrThrow);
  find.mockResolvedValueOnce({
    displayName: "Fixture",
    profileCompletedAt: completedAt,
  } as Awaited<ReturnType<typeof tx.user.findUniqueOrThrow>>);
  expect(await getOwnOnboardingProfile()).toEqual({
    displayName: "Fixture",
    profileCompletedAt: completedAt.toISOString(),
  });
  expect(find).toHaveBeenCalledWith({
    where: { id: "user_fixture" },
    select: { displayName: true, profileCompletedAt: true },
  });
});
