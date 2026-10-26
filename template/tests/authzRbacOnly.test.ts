// Why: with accessControl "rbac" the record rules step aside and only the
// organization boundary remains; the role's permissions alone decide.
import { expect, test, vi } from "vitest";

import {
  canManageOwnedOrAssignedResource,
  canReadResource,
  limitedToOwnRecords,
} from "@/lib/authz/policies";
import type * as AccessConstants from "@/lib/constants/access";
import type { AccessContext, AppRole } from "@/types/accessTypes";

vi.mock("@/lib/constants/access", async (load) => ({
  ...(await load<typeof AccessConstants>()),
  accessControl: "rbac",
}));

const as = (role: AppRole): AccessContext => ({
  clerkUserId: "clerk_1",
  userId: "user_1",
  organizationId: "org_a",
  membershipId: "mem_1",
  role,
});

const record = { kind: "support.ticket", ownerMembershipId: "mem_2" } as const;

test("viewers and members reach any record in their organization", () => {
  const ours = { ...record, organizationId: "org_a" };
  expect(limitedToOwnRecords(as("VIEWER"))).toBe(false);
  expect(canReadResource(as("VIEWER"), ours)).toBe(true);
  expect(canManageOwnedOrAssignedResource(as("MEMBER"), ours)).toBe(true);
});

test("the organization boundary still holds", () => {
  const foreign = { ...record, organizationId: "org_b" };
  expect(canReadResource(as("OWNER"), foreign)).toBe(false);
  expect(canManageOwnedOrAssignedResource(as("OWNER"), foreign)).toBe(false);
});
