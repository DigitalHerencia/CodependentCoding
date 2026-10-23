// Why: pins the Maximal Template's own module set (grants, dashboard, sidebar).
// Generated apps hold a subset, so the CLI does not copy tests/template/.
import { expect, test } from "vitest";

import { grants } from "@/lib/authz/permissions";
import { installedModules } from "@/lib/modules/registry";

// The role grants before the registry existed (CC-021); assembling them from
// modules must not change who can do what.
const legacyGrants: Record<string, string[]> = {
  OWNER: [
    "organization:read",
    "organization:write",
    "crm:read",
    "crm:write",
    "projects:read",
    "projects:write",
    "support:read",
    "support:write",
    "marketing:read",
    "marketing:write",
    "invoicing:read",
    "invoicing:write",
    "social:read",
    "social:write",
    "ai:read",
    "ai:write",
    "portal:read",
    "portal:write",
    "portal:billing",
    "admin:audit",
    "admin:records",
    "admin:users",
    "admin:bulk",
  ],
  ADMIN: [
    "organization:read",
    "organization:write",
    "crm:read",
    "crm:write",
    "projects:read",
    "projects:write",
    "support:read",
    "support:write",
    "marketing:read",
    "marketing:write",
    "invoicing:read",
    "invoicing:write",
    "social:read",
    "social:write",
    "ai:read",
    "ai:write",
    "portal:read",
    "portal:write",
    "portal:billing",
    "admin:audit",
    "admin:records",
    "admin:users",
    "admin:bulk",
  ],
  MANAGER: [
    "organization:read",
    "crm:read",
    "crm:write",
    "projects:read",
    "projects:write",
    "support:read",
    "support:write",
    "marketing:read",
    "marketing:write",
    "invoicing:read",
    "social:read",
    "social:write",
    "ai:read",
    "ai:write",
    "portal:read",
    "portal:write",
  ],
  MEMBER: [
    "organization:read",
    "crm:read",
    "crm:write",
    "projects:read",
    "projects:write",
    "support:read",
    "support:write",
    "marketing:read",
    "social:read",
    "social:write",
    "ai:read",
    "ai:write",
    "portal:read",
  ],
  BILLING: [
    "organization:read",
    "invoicing:read",
    "invoicing:write",
    "portal:read",
    "portal:billing",
  ],
  SUPPORT: [
    "organization:read",
    "support:read",
    "support:write",
    "crm:read",
    "portal:read",
  ],
  CLIENT: ["organization:read", "support:read", "support:write", "portal:read"],
  VIEWER: [
    "organization:read",
    "crm:read",
    "projects:read",
    "support:read",
    "marketing:read",
    "invoicing:read",
    "social:read",
    "ai:read",
    "portal:read",
  ],
};

// Grants added since: billing:read guards Settings > Billing (CC-024), held by
// the same roles that held portal:billing, which guarded it before.
const addedGrants: Record<string, string[]> = {
  OWNER: ["billing:read"],
  ADMIN: ["billing:read"],
  BILLING: ["billing:read"],
};

test("assembled grants match the pre-registry grants", () => {
  const assembled = Object.fromEntries(
    Object.entries(grants).map(([role, set]) => [role, [...set].sort()]),
  );
  const expected = Object.fromEntries(
    Object.entries(legacyGrants).map(([role, list]) => [
      role,
      [...list, ...(addedGrants[role] ?? [])].sort(),
    ]),
  );
  expect(assembled).toEqual(expected);
});

test("the dashboard renders one workspace link per registry entry", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { SharedDashboardTemplate } =
    await import("@/components/templates/sharedDashboardTemplate");
  const workspaces = installedModules.flatMap(
    ({ dashboard }) => dashboard ?? [],
  );
  const html = renderToStaticMarkup(
    createElement(SharedDashboardTemplate, {
      organization: {
        id: "org",
        name: "Acme",
        memberCount: 3,
        timezone: "UTC",
      } as never,
      workspaces,
    }),
  );
  expect(workspaces.length).toBeGreaterThan(5);
  for (const { href, title } of workspaces) {
    expect(html).toContain(`href="${href}"`);
    expect(html).toContain(title);
  }
});

test("the sidebar groups come from the registry", async () => {
  const { moduleNavigation, settingsNavigation } =
    await import("@/lib/modules/navigation");
  expect(moduleNavigation().map(({ id }) => id)).toEqual([
    "crm",
    "projects",
    "support",
    "marketing",
    "invoicing",
    "social",
    "ai",
    "portal",
    "admin",
  ]);
  expect(settingsNavigation().map(({ href }) => href)).toEqual([
    "/settings/profile",
    "/settings/members",
    "/settings/integrations",
    "/settings/billing",
    "/onboarding",
  ]);
  expect(moduleNavigation([])).toEqual([]);
  expect(settingsNavigation([]).map(({ href }) => href)).not.toContain(
    "/settings/billing",
  );
});
