import type { AccessContext, Permission } from "@/types/authzTypes";
import type { ModuleDefinition } from "@/types/moduleTypes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({
  access: {
    clerkUserId: "user-1",
    userId: "user-1",
    organizationId: "00000000-0000-4000-8000-000000000010",
    membershipId: "00000000-0000-4000-8000-000000000011",
    role: "ADMIN" as const,
    deniedPermissions: [] as string[],
  },
  aiGenerations: vi.fn(async (_args: unknown) => 4),
  aiUsage: vi.fn(async (_args: unknown) => 3),
  ordinary: vi.fn(async (_args: unknown) => 20),
  assertPermission: vi.fn((access: AccessContext, permission: Permission) => {
    if (access.deniedPermissions?.includes(permission))
      throw Object.assign(new Error("forbidden"), { code: "FORBIDDEN" });
  }),
  hasPermission: vi.fn(
    (access: AccessContext, permission: Permission) =>
      !access.deniedPermissions?.includes(permission),
  ),
}));

vi.mock("@/lib/modules/registry", async () => {
  const { aiModule } = await import("@/lib/modules/aiModule");
  return {
    installedModules: [
      aiModule,
      {
        id: "example",
        records: [{ label: "Example events", model: "auditEvent" }],
      },
    ] satisfies ModuleDefinition[],
  };
});
vi.mock("@/lib/db/tenancy", () => ({
  withAuthenticatedRead: vi.fn(
    async (read: (tx: unknown, access: AccessContext) => Promise<unknown>) =>
      read(
        {
          aiGeneration: { count: fixture.aiGenerations },
          aiUsageLedger: { count: fixture.aiUsage },
          auditEvent: { count: fixture.ordinary },
        },
        fixture.access,
      ),
  ),
}));
vi.mock("@/lib/authz/permissions", () => ({
  assertPermission: fixture.assertPermission,
  hasPermission: fixture.hasPermission,
}));

import { getAdminRecordSummary } from "@/lib/fetchers/adminFetchers";

/** Domain-owned AI registration governs every shared counter read, including explicit administrator denials. */
describe("AI record registration in shared summaries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fixture.access.deniedPermissions = [];
  });

  it("still requires the shared admin record permission before counting any registered model", async () => {
    fixture.access.deniedPermissions = ["admin.record:read"];
    await expect(getAdminRecordSummary()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(fixture.assertPermission).toHaveBeenCalledWith(
      fixture.access,
      "admin.record:read",
    );
    expect(fixture.aiGenerations).not.toHaveBeenCalled();
    expect(fixture.aiUsage).not.toHaveBeenCalled();
    expect(fixture.ordinary).not.toHaveBeenCalled();
  });

  it("excludes both AI delegates when an administrator has an explicit AI read denial", async () => {
    fixture.access.deniedPermissions = ["ai.generation:read"];
    const summary = await getAdminRecordSummary();
    expect(fixture.hasPermission).toHaveBeenCalledWith(
      fixture.access,
      "ai.generation:read",
    );
    expect(fixture.aiGenerations).not.toHaveBeenCalled();
    expect(fixture.aiUsage).not.toHaveBeenCalled();
    expect(summary).toEqual([
      { id: "auditEvent", resource: "Example events", count: 20 },
    ]);
    expect(fixture.ordinary).toHaveBeenCalledWith({
      where: { organizationId: fixture.access.organizationId },
    });
  });

  it("counts authorized AI records by tenant and requester while retaining ordinary tenant-only contributions", async () => {
    const summary = await getAdminRecordSummary();
    const personalWhere = {
      organizationId: fixture.access.organizationId,
      userId: fixture.access.userId,
    };
    expect(fixture.aiGenerations).toHaveBeenCalledWith({
      where: personalWhere,
    });
    expect(fixture.aiUsage).toHaveBeenCalledWith({ where: personalWhere });
    expect(fixture.ordinary).toHaveBeenCalledWith({
      where: { organizationId: fixture.access.organizationId },
    });
    expect(summary).toEqual([
      { id: "aiGeneration", resource: "Your AI generations", count: 4 },
      { id: "aiUsageLedger", resource: "Your AI usage", count: 3 },
      { id: "auditEvent", resource: "Example events", count: 20 },
    ]);
  });
});
