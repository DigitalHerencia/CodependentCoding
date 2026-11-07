// Why: pins RBAC (the default; `--access abac` swaps in record rules): the record rules
// are absent, only the organization boundary remains, and the role's
// permissions alone decide.
import { expect, test } from "vitest";

import {
  canManageOwnedOrAssignedResource,
  canReadResource,
  limitedToOwnRecords,
} from "@/lib/authz/policies";
import { hasRoleAtLeast } from "@/lib/authz/roles";
import type { AccessContext, AppRole } from "@/types/accessTypes";

const as = (role: AppRole): AccessContext => ({
  clerkUserId: "clerk_1",
  userId: "user_1",
  organizationId: "org_a",
  membershipId: "mem_1",
  role,
});

const record = { kind: "base.settings", ownerMembershipId: "mem_2" } as const;

test("roles rank OWNER > ADMIN > MEMBER > VIEWER", () => {
  expect(hasRoleAtLeast("OWNER", "ADMIN")).toBe(true);
  expect(hasRoleAtLeast("MEMBER", "MEMBER")).toBe(true);
  expect(hasRoleAtLeast("VIEWER", "MEMBER")).toBe(false);
});

test("viewers and members reach any record in their organization", () => {
  const ours = { ...record, organizationId: "org_a" };
  expect(limitedToOwnRecords(as("VIEWER"))).toBe(false);
  expect(canReadResource(as("VIEWER"), ours)).toBe(true);
  expect(canManageOwnedOrAssignedResource(as("MEMBER"), ours)).toBe(true);
});

test("the organization boundary still holds", () => {
  const foreign = { ...record, organizationId: "org_b" };
  for (const role of ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const) {
    expect(canReadResource(as(role), foreign)).toBe(false);
    expect(canManageOwnedOrAssignedResource(as(role), foreign)).toBe(false);
  }
});
