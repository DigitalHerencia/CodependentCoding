import { expect, test, vi } from "vitest";
import type { Prisma } from "@/generated/prisma/client";
import { projectClerkUser } from "@/lib/auth/clerkWebhooks";
import { syncClerkUserTx } from "@/lib/workflows/authWorkflows";
import { provisionWorkspaceAccessTx } from "@/lib/db/transactions/onboardingTx";

vi.mock("@/lib/db/transactions/onboardingTx", () => ({
  provisionWorkspaceAccessTx: vi.fn(async () => true),
}));

const user = {
  id: "user_verified_provider_identity",
  primary_email_address_id: "primary",
  first_name: null,
  last_name: null,
  image_url: "",
  username: null,
};

test("only the provider-verified primary email may match signup invitations", () => {
  for (const status of ["unverified", "verified"]) {
    const projection = projectClerkUser({
      ...user,
      email_addresses: [
        {
          id: "secondary",
          email_address: "other@example.test",
          verification: { status: "verified" },
        },
        {
          id: "primary",
          email_address: "Primary@Example.test",
          verification: { status },
        },
      ],
    });
    expect(projection.verifiedEmail).toBe(
      status === "verified" ? "primary@example.test" : null,
    );
    expect(projection.clerkUserId).toBe(user.id);
  }
});

test("identity synchronization provisions signup access without profile completion", async () => {
  const projection = projectClerkUser({ ...user, email_addresses: [] });
  const tx = {
    $executeRaw: vi.fn(async () => 1),
    user: { upsert: vi.fn(async () => ({ id: user.id })) },
  } as unknown as Prisma.TransactionClient;
  await syncClerkUserTx(tx, projection);
  expect(provisionWorkspaceAccessTx).toHaveBeenCalledWith(
    tx,
    { id: user.id, displayName: null },
    null,
  );
});
