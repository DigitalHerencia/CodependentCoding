/** Auth Webhook Workflow.test contracts for the owning application slice. */
import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { guardAuthEntryWorkflow } from "@/lib/workflows/authWorkflows";
import { POST as handleClerkWebhookWorkflow } from "@/app/api/clerk/webhooks/route";
import { WebhookIdentityConflictError } from "@/lib/db/transactions/webhookEventTx";
import type * as AuthzTxModule from "@/lib/db/selects/authzTx";
import type * as WebhookEventModule from "@/lib/db/transactions/webhookEventTx";

const mocks = vi.hoisted(() => ({
  verify: vi.fn(),
  identity: vi.fn(),
  redirect: vi.fn(),
  transaction: vi.fn(),
  claim: vi.fn(),
  complete: vi.fn(),
  fail: vi.fn(),
  provision: vi.fn(),
}));
vi.mock("@/lib/integrations/clerk/server", () => ({
  getIdentity: mocks.identity,
}));
vi.mock("@/lib/utils/authRedirects", () => ({
  redirectAfterAuth: mocks.redirect,
}));
vi.mock("@/lib/integrations/clerk/webhooks", () => ({
  verifyClerkWebhook: mocks.verify,
  resolveClerkWebhookUser: async (event: { type: string }) =>
    event.type === "user.deleted"
      ? null
      : {
          clerkUserId: "user_fixture",
          email: "fixture@example.test",
          verifiedEmail: "fixture@example.test",
          displayName: "Fixture",
          imageUrl: null,
          username: null,
        },
}));
vi.mock("@/lib/db/rls", () => ({
  withProviderTransaction: mocks.transaction,
  setRlsContext: vi.fn(async () => {}),
}));
vi.mock("@/lib/db/selects/authzTx", async (importOriginal) => ({
  ...(await importOriginal<typeof AuthzTxModule>()),
  provisionWorkspaceAccessTx: mocks.provision,
}));
vi.mock("@/lib/db/transactions/webhookEventTx", async (importOriginal) => ({
  ...(await importOriginal<typeof WebhookEventModule>()),
  claimWebhookEventTx: mocks.claim,
  completeWebhookEventTx: mocks.complete,
  failWebhookEventTx: mocks.fail,
}));

const tx = {
  $executeRaw: vi.fn(async () => 1),
  user: {
    upsert: vi.fn(async () => ({ id: "user_fixture" })),
    updateMany: vi.fn(),
  },
  membership: { findMany: vi.fn(), updateMany: vi.fn() },
  auditEvent: { create: vi.fn() },
};
function request(id: string | null = "msg_fixture") {
  return new NextRequest("https://example.test/api/clerk/webhooks", {
    method: "POST",
    body: "raw-provider-body",
    headers: id ? { "svix-id": id } : {},
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.verify.mockResolvedValue({ type: "user.created", data: {} });
  mocks.claim.mockResolvedValue("event_fixture");
  mocks.complete.mockResolvedValue({});
  mocks.provision.mockResolvedValue(true);
  mocks.transaction.mockImplementation(
    async (work: (client: Prisma.TransactionClient) => Promise<unknown>) =>
      work(tx as unknown as Prisma.TransactionClient),
  );
});

test("signature rejection happens before claiming or processing any event", async () => {
  mocks.verify.mockRejectedValueOnce(new Error("invalid fixture signature"));
  expect((await handleClerkWebhookWorkflow(request())).status).toBe(400);
  expect(mocks.transaction).not.toHaveBeenCalled();
  expect(tx.user.upsert).not.toHaveBeenCalled();
});

test("a verified delivery still requires a signed event identity", async () => {
  expect((await handleClerkWebhookWorkflow(request(null))).status).toBe(400);
  expect(mocks.claim).not.toHaveBeenCalled();
});

test("identity writes and event completion share the same processing transaction", async () => {
  const response = await handleClerkWebhookWorkflow(request());
  expect(await response.json()).toEqual({ received: true, duplicate: false });
  expect(mocks.claim).toHaveBeenCalledWith(tx, {
    provider: "clerk",
    eventId: "msg_fixture",
    type: "user.created",
    payload: "raw-provider-body",
  });
  expect(mocks.provision).toHaveBeenCalledWith(
    tx,
    { id: "user_fixture", displayName: "Fixture" },
    "fixture@example.test",
  );
  expect(mocks.complete).toHaveBeenCalledWith(tx, "event_fixture");
  expect(mocks.transaction).toHaveBeenCalledTimes(2);
});

test("a duplicate delivery acknowledges without resynchronizing identity", async () => {
  mocks.claim.mockResolvedValueOnce(null);
  expect(await (await handleClerkWebhookWorkflow(request())).json()).toEqual({
    received: true,
    duplicate: true,
  });
  expect(tx.user.upsert).not.toHaveBeenCalled();
  expect(mocks.complete).not.toHaveBeenCalled();
});

test("changed payload under the same event identity is rejected", async () => {
  mocks.claim.mockRejectedValueOnce(new WebhookIdentityConflictError());
  expect((await handleClerkWebhookWorkflow(request())).status).toBe(409);
  expect(tx.user.upsert).not.toHaveBeenCalled();
});

test("deletion suspends active memberships without reactivating revoked or suspended ones", async () => {
  mocks.verify.mockResolvedValueOnce({
    type: "user.deleted",
    data: { id: "user_fixture" },
  });
  tx.membership.findMany.mockResolvedValueOnce([
    { id: "active", organizationId: "org_fixture", status: "ACTIVE" },
    { id: "suspended", organizationId: "org_fixture", status: "SUSPENDED" },
    { id: "revoked", organizationId: "org_fixture", status: "REVOKED" },
  ]);
  expect((await handleClerkWebhookWorkflow(request())).status).toBe(200);
  expect(tx.membership.updateMany).toHaveBeenCalledExactlyOnceWith({
    where: {
      id: "active",
      userId: "user_fixture",
      organizationId: "org_fixture",
    },
    data: { status: "SUSPENDED" },
  });
  expect(tx.auditEvent.create).toHaveBeenCalledOnce();
  expect(tx.user.updateMany).toHaveBeenCalledWith({
    where: { id: "user_fixture" },
    data: {
      email: null,
      displayName: "Deleted user",
      imageUrl: null,
      username: null,
      firstName: null,
      lastName: null,
      bio: null,
      phoneNumber: null,
      profileCompletedAt: null,
    },
  });
});

test("processing errors record a retryable failure without leaking provider data", async () => {
  const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.provision.mockRejectedValueOnce(
    Object.assign(new Error("private fixture email"), { code: "P2002" }),
  );
  const response = await handleClerkWebhookWorkflow(request());
  expect(response.status).toBe(500);
  expect(await response.text()).not.toContain("private fixture");
  expect(mocks.complete).not.toHaveBeenCalled();
  expect(mocks.fail).toHaveBeenCalledWith(
    tx,
    "event_fixture",
    "processing_failed",
  );
  expect(diagnostic).toHaveBeenCalledExactlyOnceWith(
    "Clerk webhook processing failed",
  );
});

test("authenticated auth entries keep the accepted redirect gate", async () => {
  mocks.identity.mockResolvedValueOnce(null);
  await guardAuthEntryWorkflow();
  expect(mocks.redirect).not.toHaveBeenCalled();
  mocks.identity.mockResolvedValueOnce({ clerkUserId: "user_fixture" });
  await guardAuthEntryWorkflow();
  expect(mocks.redirect).toHaveBeenCalledOnce();
});
