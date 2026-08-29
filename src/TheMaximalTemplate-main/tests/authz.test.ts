import assert from "node:assert/strict";
import test from "node:test";

import {
  authorizeOwnedOrAssignedWrite,
  authorizeResourceRead,
  ResourceAuthorizationError,
} from "../lib/authz/authorize";
import { AuthorizationError } from "../lib/authz/permissions";
import type { AccessContext } from "../types/access";

const member: AccessContext = {
  clerkUserId: "user_member",
  userId: "user-internal",
  organizationId: "org-internal-one",
  membershipId: "membership-member",
  role: "MEMBER",
};

test("rejects access to a resource in another tenant", () => {
  assert.throws(
    () =>
      authorizeResourceRead(member, "projects:read", {
        kind: "project",
        organizationId: "org-internal-two",
      }),
    ResourceAuthorizationError,
  );
});

test("permits an assigned member to update a project resource", () => {
  assert.doesNotThrow(() =>
    authorizeOwnedOrAssignedWrite(member, "projects:write", {
      kind: "task",
      organizationId: member.organizationId,
      assigneeMembershipId: member.membershipId,
    }),
  );
});

test("rejects a viewer before resource policy evaluation", () => {
  assert.throws(
    () =>
      authorizeOwnedOrAssignedWrite(
        { ...member, role: "VIEWER" },
        "projects:write",
        {
          kind: "project",
          organizationId: member.organizationId,
          ownerMembershipId: member.membershipId,
        },
      ),
    AuthorizationError,
  );
});

test("limits client reads to client-visible or related resources", () => {
  const client: AccessContext = { ...member, role: "CLIENT" };

  assert.throws(
    () =>
      authorizeResourceRead(client, "portal:read", {
        kind: "portal-document",
        organizationId: client.organizationId,
        clientVisible: false,
      }),
    ResourceAuthorizationError,
  );

  assert.doesNotThrow(() =>
    authorizeResourceRead(client, "portal:read", {
      kind: "portal-document",
      organizationId: client.organizationId,
      clientVisible: true,
    }),
  );
});
