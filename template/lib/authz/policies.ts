import "server-only";

import type {
  AccessContext,
  Permission,
  ResourceAccessDescriptor,
} from "@/types/accessTypes";
import { accessControl } from "@/lib/constants/access";

import { isOutsideRole, isPrivilegedRole } from "./roles";
import { assertPermission } from "./permissions";

/**
 * ABAC: record-level rules that run after the RBAC permission check. They
 * read attributes of the caller (organization, membership, role) and of the
 * record (organization, owner, assignee, requester, shared flag).
 * With `accessControl` "rbac" only the organization boundary applies here:
 * the role's permissions alone decide.
 */
const recordRules = (): boolean => accessControl === "abac";

export class ResourceAuthorizationError extends Error {
  readonly code = "FORBIDDEN";

  constructor(resource: ResourceAccessDescriptor) {
    super(`Access denied for ${resource.kind} in the active organization.`);
    this.name = "ResourceAuthorizationError";
  }
}

export function isSameTenant(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  return context.organizationId === resource.organizationId;
}

export function ownsResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  return resource.ownerMembershipId === context.membershipId;
}

export function isAssignedResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  return resource.assigneeMembershipId === context.membershipId;
}

export function requestedResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  return resource.requesterUserId === context.userId;
}

/** Outside viewers (clients) see only what is shared with them or theirs; staff see the whole organization. */
export function limitedToOwnRecords(context: AccessContext): boolean {
  return recordRules() && isOutsideRole(context.role);
}

export function canReadResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  if (!isSameTenant(context, resource)) {
    return false;
  }

  if (!limitedToOwnRecords(context)) {
    return true;
  }

  return (
    resource.clientVisible === true ||
    ownsResource(context, resource) ||
    isAssignedResource(context, resource) ||
    requestedResource(context, resource)
  );
}

export function canManageOwnedOrAssignedResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  if (!isSameTenant(context, resource)) {
    return false;
  }

  return (
    !recordRules() ||
    isPrivilegedRole(context.role) ||
    ownsResource(context, resource) ||
    isAssignedResource(context, resource) ||
    (limitedToOwnRecords(context) && requestedResource(context, resource))
  );
}

/** RBAC then ABAC for a write to one record. */
export function authorizeOwnedOrAssignedWrite(
  context: AccessContext,
  permission: Permission,
  resource: ResourceAccessDescriptor,
): void {
  assertPermission(context, permission);
  if (!canManageOwnedOrAssignedResource(context, resource)) {
    throw new ResourceAuthorizationError(resource);
  }
}
