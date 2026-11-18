/** Authenticated Navigation Projection.test contracts for the owning application slice. */
import { expect, test, vi } from "vitest";
import type { AccessContext } from "@/types/authzTypes";
import { buildTenantNavigation } from "@/lib/workflows/tenantWorkflows";
import { loadAuthenticatedUserMenuWorkflow } from "@/lib/workflows/authenticatedNavigationWorkflows";

vi.mock("@/lib/db/tenancy", () => ({ withAuthenticatedRead: vi.fn() }));
const reads = vi.hoisted(() => ({
  switcher: vi.fn(),
  role: vi.fn(),
}));
vi.mock("@/lib/fetchers/authzFetchers", () => ({
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
    expect(links.some((link) => link.href === "/settings/profile")).toBe(false);
  },
);

test("account navigation reuses the ACTIVE-membership switcher and role projections", async () => {
  const switcher = {
    activeOrganizationId: "org_a",
    organizations: [
      { id: "org_a", name: "A" },
      { id: "org_b", name: "B" },
    ],
  };
  reads.switcher.mockResolvedValueOnce(switcher);
  reads.role.mockResolvedValueOnce("MEMBER");
  expect(await loadAuthenticatedUserMenuWorkflow()).toEqual({
    switcher,
    role: "MEMBER",
  });
  expect(reads.switcher).toHaveBeenCalledExactlyOnceWith();
  expect(reads.role).toHaveBeenCalledExactlyOnceWith();
});
