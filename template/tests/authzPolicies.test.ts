// Why: pins the record checks (ABAC) that run after the role check (RBAC).
import { expect, test } from "vitest";

import { hasPermission } from "@/lib/authz/permissions";
import {
  canManageOwnedOrAssignedResource,
  canReadResource,
} from "@/lib/authz/policies";
import { hasRoleAtLeast } from "@/lib/authz/roles";
import type {
  AccessContext,
  AppRole,
  ResourceAccessDescriptor,
} from "@/types/accessTypes";

const as = (role: AppRole): AccessContext => ({
  clerkUserId: "clerk_1",
  userId: "user_1",
  organizationId: "org_a",
  membershipId: "mem_1",
  role,
});

const record = (
  extra: Partial<ResourceAccessDescriptor> = {},
): ResourceAccessDescriptor => ({
  kind: "support.ticket",
  organizationId: "org_a",
  ownerMembershipId: "mem_2",
  ...extra,
});

test("roles rank OWNER > ADMIN > MEMBER > VIEWER", () => {
  expect(hasRoleAtLeast("OWNER", "ADMIN")).toBe(true);
  expect(hasRoleAtLeast("MEMBER", "MEMBER")).toBe(true);
  expect(hasRoleAtLeast("VIEWER", "MEMBER")).toBe(false);
});

test("nobody reads or manages another organization's record", () => {
  const foreign = record({ organizationId: "org_b", clientVisible: true });
  for (const role of ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const) {
    expect(canReadResource(as(role), foreign)).toBe(false);
    expect(canManageOwnedOrAssignedResource(as(role), foreign)).toBe(false);
  }
});

test("staff read every record in the organization; viewers only shared or their own", () => {
  expect(canReadResource(as("MEMBER"), record())).toBe(true);
  expect(canReadResource(as("VIEWER"), record())).toBe(false);
  expect(canReadResource(as("VIEWER"), record({ clientVisible: true }))).toBe(
    true,
  );
  expect(
    canReadResource(as("VIEWER"), record({ requesterUserId: "user_1" })),
  ).toBe(true);
});

test("members manage what they own or are assigned; viewers what they requested; admins anything", () => {
  expect(canManageOwnedOrAssignedResource(as("ADMIN"), record())).toBe(true);
  expect(canManageOwnedOrAssignedResource(as("MEMBER"), record())).toBe(false);
  expect(
    canManageOwnedOrAssignedResource(
      as("MEMBER"),
      record({ assigneeMembershipId: "mem_1" }),
    ),
  ).toBe(true);
  expect(
    canManageOwnedOrAssignedResource(
      as("MEMBER"),
      record({ requesterUserId: "user_1" }),
    ),
  ).toBe(false);
  expect(
    canManageOwnedOrAssignedResource(
      as("VIEWER"),
      record({ requesterUserId: "user_1" }),
    ),
  ).toBe(true);
});

test("the role check comes first: viewers cannot write staff resources at all", () => {
  expect(hasPermission(as("VIEWER"), "crm.contact:read")).toBe(false);
  expect(hasPermission(as("VIEWER"), "support.ticket:create")).toBe(true);
  expect(hasPermission(as("VIEWER"), "support.article:create")).toBe(false);
  expect(hasPermission(as("MEMBER"), "admin.membership:update")).toBe(false);
});
