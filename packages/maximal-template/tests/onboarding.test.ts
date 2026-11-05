import assert from "node:assert/strict";
import { test } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import { completeOnboardingTx } from "@/lib/db/transactions/onboardingTx";
import { onboardingSchema } from "@/schemas/commonSchemas";

test("profile onboarding stays identity-scoped before a tenant membership exists", async () => {
  const profile = {
    id: "user_pending",
    name: null as string | null,
    completedAt: null as Date | null,
  };
  const tx = {
    user: {
      updateMany: async ({
        where,
        data,
      }: {
        where: { id: string; profileCompletedAt: null };
        data: { displayName: string; profileCompletedAt: Date };
      }) => {
        assert.equal(where.id, profile.id);
        assert.equal(where.profileCompletedAt, null);
        if (profile.completedAt) return { count: 0 };
        profile.name = data.displayName;
        profile.completedAt = data.profileCompletedAt;
        return { count: 1 };
      },
    },
  } as unknown as Prisma.TransactionClient;
  await completeOnboardingTx(tx, profile.id, "Ada");
  await completeOnboardingTx(tx, profile.id, "Unexpected overwrite");
  assert.equal(profile.name, "Ada");
  assert.ok(profile.completedAt instanceof Date);
});
test("onboarding rejects empty names and client supplied authorization fields", () => {
  assert.equal(onboardingSchema.safeParse({ name: "   " }).success, false);
  for (const field of ["organizationId", "role", "permissions"])
    assert.equal(
      onboardingSchema.safeParse({ name: "Valid", [field]: "other" }).success,
      false,
    );
  assert.equal(onboardingSchema.parse({ name: "  Valid  " }).name, "Valid");
});
