// RBAC staff grants and mandatory customer relationships; generator ABAC replaces this file.
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

test("customers need a relationship while staff retain RBAC tenant access", () => {
  const ours = { ...record, organizationId: "org_a" };
  expect(limitedToOwnRecords(as("VIEWER"))).toBe(true);
  expect(canReadResource(as("VIEWER"), ours)).toBe(false);
  expect(canReadResource(as("VIEWER"), { ...ours, ownerMembershipId: "mem_1" })).toBe(true);
  expect(canReadResource(as("VIEWER"), { ...ours, clientVisible: true })).toBe(false);
  expect(canManageOwnedOrAssignedResource(as("MEMBER"), ours)).toBe(true);
});

test("CRM keeps its existing tenant-scoped policy semantics", () => {
  const crm = { kind: "crm.account", organizationId: "org_a" } as const;
  expect(canManageOwnedOrAssignedResource(as("MEMBER"), crm)).toBe(true);
  expect(canReadResource(as("VIEWER"), crm)).toBe(true);
});

test("the organization boundary still holds", () => {
  const foreign = { ...record, organizationId: "org_b" };
  for (const role of ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const) {
    expect(canReadResource(as(role), foreign)).toBe(false);
    expect(canManageOwnedOrAssignedResource(as(role), foreign)).toBe(false);
  }
});
