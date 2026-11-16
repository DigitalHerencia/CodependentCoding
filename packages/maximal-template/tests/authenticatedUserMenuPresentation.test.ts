import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { AuthenticatedUserMenu } from "@/components/nav/authenticated-user-menu";
import { AuthenticatedMobileNavigation } from "@/components/nav/authenticated-mobile-navigation";

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: true,
    user: {
      imageUrl: "https://example.test/avatar.png",
      primaryEmailAddress: { emailAddress: "member@example.test" },
    },
  }),
}));
vi.mock("@/lib/workflows/pwaClientWorkflows", () => ({
  usePwaAccountMenuWorkflow: () => ({
    onManageAccount: vi.fn(),
    onSignOut: vi.fn(),
  }),
}));
vi.mock("@/features/settings/organization-switcher-feature.client", () => ({
  OrganizationSwitcherFeatureClient: () =>
    createElement("select", { "aria-label": "Organization fixture" }),
}));

const profile = {
  displayName: "Fixture name",
  profileCompletedAt: "2026-01-01T00:00:00.000Z",
};
const orgA = { id: "org_a", name: "A" };
const orgB = { id: "org_b", name: "B" };

test.each([1, 2])(
  "account panel shows an organization picker only for multiple active memberships (%s)",
  (count) => {
    const html = renderToStaticMarkup(
      createElement(AuthenticatedUserMenu, {
        profile,
        role: "MEMBER",
        presentation: "panel",
        switcher: {
          activeOrganizationId: orgA.id,
          organizations: count === 1 ? [orgA] : [orgA, orgB],
        },
      }),
    );
    expect(html.includes("Organization fixture")).toBe(count > 1);
    expect(html).toContain("Fixture name");
    expect(html).toContain("MEMBER");
    expect(html).toContain("<dd>A</dd>");
    expect(html).toContain("member@example.test");
    expect(html).toContain('href="/onboarding/profile"');
    expect(html).toContain("Manage account");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Ownership");
  },
);

test("the responsive trigger announces a dialog and starts closed without a second navigation", () => {
  const html = renderToStaticMarkup(
    createElement(
      AuthenticatedMobileNavigation,
      { title: "Fixture navigation" },
      null,
    ),
  );
  expect(html).toContain('aria-label="Open navigation"');
  expect(html).toContain('aria-haspopup="dialog"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="dialog"');
});
