import { expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import {
  completeOnboardingTx,
  updateOwnOnboardingProfileTx,
} from "@/lib/db/transactions/onboardingTx";
import { onboardingSchema } from "@/schemas/onboardingSchemas";

vi.mock("@/lib/db/rls", () => ({ setRlsContext: vi.fn() }));

test("profile completion records a DB timestamp only once", async () => {
  const profile = { displayName: "Original", completedAt: null as Date | null };
  const updateMany = vi.fn(
    async ({
      where,
      data,
    }: {
      where: { id: string; profileCompletedAt: null };
      data: { displayName: string; profileCompletedAt: Date };
    }) => {
      expect(where).toEqual({ id: "user_fixture", profileCompletedAt: null });
      if (profile.completedAt) return { count: 0 };
      profile.displayName = data.displayName;
      profile.completedAt = data.profileCompletedAt;
      return { count: 1 };
    },
  );
  const tx = { user: { updateMany } } as unknown as Prisma.TransactionClient;
  await completeOnboardingTx(tx, "user_fixture", "Reviewed name");
  const completedAt = profile.completedAt;
  await completeOnboardingTx(tx, "user_fixture", "Unexpected overwrite");
  expect(profile).toEqual({ displayName: "Reviewed name", completedAt });
  expect(completedAt).toBeInstanceOf(Date);
});

test("editing targets only the caller's completed profile and never rewrites completion", async () => {
  const updateMany = vi.fn(async () => ({ count: 1 }));
  const tx = { user: { updateMany } } as unknown as Prisma.TransactionClient;
  await updateOwnOnboardingProfileTx(tx, "user_fixture", "Updated name");
  expect(updateMany).toHaveBeenCalledExactlyOnceWith({
    where: { id: "user_fixture", profileCompletedAt: { not: null } },
    data: { displayName: "Updated name" },
  });
});

test("profile schema remains trimmed, bounded and rejects authorization/identity injection", () => {
  expect(onboardingSchema.parse({ name: "  Fixture  " })).toEqual({
    name: "Fixture",
  });
  expect(onboardingSchema.safeParse({ name: " " }).success).toBe(false);
  expect(onboardingSchema.safeParse({ name: "x".repeat(101) }).success).toBe(
    false,
  );
  for (const key of [
    "userId",
    "organizationId",
    "role",
    "profileCompletedAt",
    "permissions",
  ])
    expect(
      onboardingSchema.safeParse({ name: "Fixture", [key]: "spoofed" }).success,
    ).toBe(false);
});
