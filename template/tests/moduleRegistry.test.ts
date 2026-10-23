import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { grants, permissions } from "@/lib/authz/permissions";
import { installedModules } from "@/lib/modules/registry";
import { listFiles } from "@/scripts/ownership.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(`${root}/hipster.modules.json`, "utf8"),
) as { modules: { id: string; kind: string; env?: { name: string }[] }[] };

test("the registry lists every manifest module once, in manifest order", () => {
  expect(installedModules.map(({ id }) => id)).toEqual(
    manifest.modules.map(({ id }) => id),
  );
});

test("module permissions use the module id as prefix", () => {
  for (const { id, permissions: own } of installedModules) {
    for (const permission of own?.catalog ?? []) {
      expect(permission.startsWith(`${id}:`)).toBe(true);
    }
    for (const granted of Object.values(own?.grants ?? {})) {
      for (const permission of granted) {
        expect(own?.catalog).toContain(permission);
      }
    }
  }
});

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

test("every permission checked in code is in the catalog", () => {
  const checked = new Set<string>();
  const call =
    /(?:assertPermission|hasPermission|authorizeOwnedOrAssignedWrite)\(\s*[\w.]+,\s*"([^"]+)"/g;
  for (const path of listFiles(root)) {
    if (!/^(app|features|lib)\/.*\.tsx?$/.test(path)) continue;
    const source = readFileSync(`${root}/${path}`, "utf8");
    for (const match of source.matchAll(call)) checked.add(match[1] ?? "");
  }
  expect(checked.size).toBeGreaterThan(10);
  expect([...checked].filter((p) => !permissions.includes(p as never))).toEqual(
    [],
  );
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

test("each provider add-on reports its own manifest env in Settings > Integrations", () => {
  const addons = manifest.modules.filter(({ kind }) => kind === "addon");
  for (const { id, env } of addons) {
    const integration = installedModules.find(
      (entry) => entry.id === id,
    )?.integration;
    expect(integration, id).toBeDefined();
    const declared = (env ?? []).map(({ name }) => name);
    for (const name of integration?.env ?? []) {
      expect(declared, `${id}: ${name}`).toContain(name);
    }
  }
});
