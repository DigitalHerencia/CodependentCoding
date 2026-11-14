import { describe, expect, it, vi } from "vitest";

import type { Prisma } from "@/generated/prisma/client";
import { saveDashboardPreferencesTx } from "@/lib/db/transactions/dashboardSavePreferencesTx";
import {
  defaultDashboardPreferences,
  toDashboardPreferencesDTO,
} from "@/lib/db/dtos/dashboardDtos";
import { dashboardPreferencesSchema } from "@/schemas/dashboardSchemas";

describe("dashboard preference validation", () => {
  it("accepts the exact boolean contract", () => {
    const input = {
      showWorkspaces: true,
      showActivity: false,
      compactView: true,
    };
    expect(dashboardPreferencesSchema.parse(input)).toEqual(input);
  });

  it("rejects tenant identifiers and unexpected fields", () => {
    expect(() => dashboardPreferencesSchema.parse({
      ...defaultDashboardPreferences,
      organizationId: "forged",
    })).toThrow();
    expect(() => dashboardPreferencesSchema.parse({
      ...defaultDashboardPreferences,
      compactView: "true",
    })).toThrow();
  });

  it("produces defaults without exposing a persistence identity", () => {
    expect(toDashboardPreferencesDTO(null)).toEqual(defaultDashboardPreferences);
  });
});

describe("dashboard preference transaction helper", () => {
  it("upserts the authenticated membership and audits the result", async () => {
    const upsert = vi.fn().mockResolvedValue({
      id: "preference-id",
      ...defaultDashboardPreferences,
      compactView: true,
    });
    const create = vi.fn().mockResolvedValue({ id: "audit-id" });
    const tx = {
      dashboardPreference: { upsert },
      auditEvent: { create },
    } as unknown as Prisma.TransactionClient;

    const result = await saveDashboardPreferencesTx(tx, {
      organizationId: "organization-id",
      membershipId: "membership-id",
      actorUserId: "user-id",
      preferences: { ...defaultDashboardPreferences, compactView: true },
    });

    expect(result.compactView).toBe(true);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { membershipId: "membership-id" },
        create: expect.objectContaining({
          organizationId: "organization-id",
          membershipId: "membership-id",
          compactView: true,
        }),
      }),
    );
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organizationId: "organization-id",
          actorUserId: "user-id",
          resourceId: "preference-id",
        }),
      }),
    );
  });

  it("propagates audit failure to the transaction caller", async () => {
    const tx = {
      dashboardPreference: {
        upsert: vi.fn().mockResolvedValue({
          id: "preference-id",
          ...defaultDashboardPreferences,
        }),
      },
      auditEvent: { create: vi.fn().mockRejectedValue(new Error("audit rejected")) },
    } as unknown as Prisma.TransactionClient;
    await expect(saveDashboardPreferencesTx(tx, {
      organizationId: "organization-id",
      membershipId: "membership-id",
      actorUserId: "user-id",
      preferences: defaultDashboardPreferences,
    })).rejects.toThrow("audit rejected");
  });
});
