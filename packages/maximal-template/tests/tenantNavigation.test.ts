import { describe, expect, it, vi } from "vitest";

// Pure navigation tests must not open a real database or import its adapter.
vi.mock("@/lib/db/tenant", () => ({
  withAuthenticatedRead: vi.fn(),
}));

import { buildTenantNavigation } from "@/lib/workflows/tenantWorkflows";
import { tenantNavigationSchema } from "@/schemas/tenantSchemas";
import type { AccessContext, AppRole } from "@/types/accessTypes";
import type { ModuleDefinition } from "@/types/moduleTypes";

function access(role: AppRole): AccessContext {
  return {
    clerkUserId: "user_test",
    userId: "user_test",
    organizationId: "org_test",
    membershipId: "membership_test",
    role,
  };
}

const modules = [
  {
    id: "crm",
    nav: {
      label: "CRM",
      icon: "users",
      links: [{ label: "Contacts", href: "/crm/contacts" }],
    },
    permissions: {
      resources: ["crm.contact"],
      grants: { MEMBER: ["read"] },
    },
  },
  {
    id: "admin",
    nav: {
      label: "Admin",
      icon: "building",
      links: [{ label: "Audit", href: "/admin/audit" }],
    },
    permissions: {
      resources: ["admin.audit-event"],
      grants: {},
    },
  },
] satisfies readonly ModuleDefinition[];

describe("tenant navigation projection", () => {
  it("shows privileged modules only to privileged roles", () => {
    const owner = buildTenantNavigation(access("OWNER"), modules);
    expect(owner.groups.map((group) => group.id)).toEqual([
      "crm",
      "admin",
      "settings",
    ]);
    expect(owner.groups[0]?.links[0]?.href).toBe("/crm/contacts");
  });

  it("filters domains using existing permission grants", () => {
    const member = buildTenantNavigation(access("MEMBER"), modules);
    expect(member.groups.map((group) => group.id)).toEqual([
      "crm",
      "settings",
    ]);

    const viewer = buildTenantNavigation(access("VIEWER"), modules);
    expect(viewer.groups.map((group) => group.id)).toEqual(["settings"]);
    expect(viewer.groups[0]?.links.some((link) => link.href === "/settings/profile")).toBe(true);
  });

  it("retains stable, local bottom navigation", () => {
    const navigation = buildTenantNavigation(access("VIEWER"), modules);
    expect(navigation.mobile.map((item) => item.href)).toEqual([
      "/dashboard",
      "/settings/profile",
      "/settings/members",
      "/onboarding",
    ]);
  });
});

describe("tenant navigation schema", () => {
  it("rejects external and protocol-relative destinations", () => {
    const group = {
      id: "untrusted",
      label: "Untrusted",
      icon: "settings",
      links: [{ label: "Offsite", href: "https://example.test" }],
    };
    expect(() => tenantNavigationSchema.parse({ groups: [group], mobile: [] })).toThrow();
    expect(() => tenantNavigationSchema.parse({
      groups: [{ ...group, links: [{ label: "Offsite", href: "//example.test" }] }],
      mobile: [],
    })).toThrow();
  });

  it("rejects unknown fields in the navigation DTO", () => {
    expect(() => tenantNavigationSchema.parse({
      groups: [],
      mobile: [],
      organizationId: "forged",
    })).toThrow();
  });
});
