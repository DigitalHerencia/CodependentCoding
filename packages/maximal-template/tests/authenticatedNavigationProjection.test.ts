import { expect, test, vi } from "vitest";
import type { AccessContext } from "@/types/accessTypes";
import { buildTenantNavigation } from "@/lib/workflows/tenantWorkflows";
import { loadAuthenticatedUserMenuWorkflow } from "@/lib/workflows/authenticatedNavigationWorkflows";

vi.mock("@/lib/db/tenant", () => ({ withAuthenticatedRead: vi.fn() }));
const reads = vi.hoisted(() => ({
  profile: vi.fn(),
  switcher: vi.fn(),
  role: vi.fn(),
}));
vi.mock("@/lib/fetchers/onboardingFetchers", () => ({
  getOwnOnboardingProfile: reads.profile,
}));
vi.mock("@/lib/fetchers/organizationFetchers", () => ({
  getOrganizationSwitcher: reads.switcher,
  getActiveMembershipRole: reads.role,
}));

test.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
  "%s integration discovery matches the existing settings permission",
  (role) => {
    const access = {
      clerkUserId: "fixture",
      userId: "fixture",
      membershipId: "fixture",
      organizationId: "fixture",
      role,
    } satisfies AccessContext;
    const links = buildTenantNavigation(access, []).groups.flatMap(
      (group) => group.links,
    );
    expect(links.some((link) => link.href === "/settings/integrations")).toBe(
      role === "OWNER" || role === "ADMIN",
    );
    expect(links.some((link) => link.href === "/settings/profile")).toBe(true);
  },
);

test("account navigation reuses the authenticated own-profile and ACTIVE-membership switcher projections", async () => {
  const profile = {
    displayName: "Fixture",
    profileCompletedAt: "2026-01-01T00:00:00.000Z",
  };
  const switcher = {
    activeOrganizationId: "org_a",
    organizations: [
      { id: "org_a", name: "A" },
      { id: "org_b", name: "B" },
    ],
  };
  reads.profile.mockResolvedValueOnce(profile);
  reads.switcher.mockResolvedValueOnce(switcher);
  reads.role.mockResolvedValueOnce("MEMBER");
  expect(await loadAuthenticatedUserMenuWorkflow()).toEqual({
    profile,
    switcher,
    role: "MEMBER",
  });
  expect(reads.profile).toHaveBeenCalledExactlyOnceWith();
  expect(reads.switcher).toHaveBeenCalledExactlyOnceWith();
  expect(reads.role).toHaveBeenCalledExactlyOnceWith();
});
