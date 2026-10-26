// Why: pins the Maximal Template's own module set (grants, dashboard, sidebar).
// Generated apps hold a subset, so the CLI does not copy tests/template/.
import { expect, test } from "vitest";

import { grants, permissions } from "@/lib/authz/permissions";
import { installedModules } from "@/lib/modules/registry";

// Who can do what after the four-role migration (DEC-065): OWNER and ADMIN hold
// every permission; MEMBER is staff; VIEWER is an outside person (client) whose
// records policies limit to shared or their own.
const all = (resources: string[], actions: string[]) =>
  resources.flatMap((resource) =>
    actions.map((action) => `${resource}:${action}`),
  );
const staff = ["read", "create", "update"];

const expectedMember = [
  ...all(["base.organization", "base.membership", "base.settings"], ["read"]),
  ...all(["crm.contact", "crm.account", "crm.deal"], [...staff, "delete"]),
  ...all(["projects.project", "projects.task"], staff),
  ...all(["support.ticket", "support.article"], staff),
  ...all(["marketing.campaign", "marketing.audience"], staff),
  ...all(["invoicing.invoice", "invoicing.expense"], staff),
  ...all(["social.post", "social.account", "social.media"], staff),
  ...all(["ai.generation"], staff),
  ...all(["portal.document", "portal.billing"], staff),
  "billing.subscription:read",
];

const expectedViewer = [
  ...all(["base.organization", "base.membership", "base.settings"], ["read"]),
  "support.ticket:read",
  "support.ticket:create",
  "support.ticket:update",
  "support.article:read",
  "portal.document:read",
];

test("assembled grants match the four-role model", () => {
  const sorted = (list: Iterable<string>) => [...list].sort();
  expect(Object.keys(grants)).toEqual(["OWNER", "ADMIN", "MEMBER", "VIEWER"]);
  expect(sorted(grants.OWNER)).toEqual(sorted(permissions));
  expect(sorted(grants.ADMIN)).toEqual(sorted(permissions));
  expect(sorted(grants.MEMBER)).toEqual(sorted(expectedMember));
  expect(sorted(grants.VIEWER)).toEqual(sorted(expectedViewer));
  expect(permissions).toHaveLength(5 * 24);
  expect(grants.MEMBER.has("admin.membership:read")).toBe(false);
  expect(grants.MEMBER.has("base.settings:update")).toBe(false);
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
