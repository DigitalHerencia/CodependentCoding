import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/auth", () => ({
  requireIdentity: vi.fn(async () => ({ userId: "user-1" })),
}));
vi.mock("@/lib/authz/permissions", () => ({ assertPermission: vi.fn() }));
vi.mock("@/lib/cache/invalidate", () => ({ invalidatePaths: vi.fn() }));
vi.mock("@/lib/db/dtos/crmDtos", () => ({
  toCrmAccountDTO: (record: { id: string }) => ({ id: record.id }),
  toCrmContactDTO: vi.fn(),
  toCrmDealDTO: vi.fn(),
}));
vi.mock("@/lib/db/tenant", () => ({
  withTenantTransaction: vi.fn(async (
    _: unknown,
    callback: (tx: unknown, access: unknown) => Promise<unknown>,
  ) => callback({
    crmAccount: { create: vi.fn(async () => ({ id: "account-1" })) },
    auditEvent: { create: vi.fn(async () => ({ id: "audit-1" })) },
  }, {
    organizationId: "organization-1",
    userId: "user-1",
    membershipId: "membership-1",
  })),
}));

import { invalidatePaths } from "@/lib/cache/invalidate";
import { createCrmAccount } from "@/lib/actions/crmActions";

describe("CRM write cache coherence", () => {
  beforeEach(() => vi.clearAllMocks());

  it("invalidates CRM views after the authorized write succeeds", async () => {
    const result = await createCrmAccount({
      name: "Acme", website: "", industry: "", notes: "",
    });
    expect(result.ok).toBe(true);
    expect(invalidatePaths).toHaveBeenCalledOnce();
    expect(vi.mocked(invalidatePaths).mock.calls[0]?.[0]).toContain("/crm/accounts");
  });

  it("does not invalidate when validation fails", async () => {
    const result = await createCrmAccount({
      name: "", website: "", industry: "", notes: "",
    });
    expect(result.ok).toBe(false);
    expect(invalidatePaths).not.toHaveBeenCalled();
  });
});
