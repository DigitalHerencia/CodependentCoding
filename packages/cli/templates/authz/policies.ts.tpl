import "server-only";

import type {
  AccessContext,
  Permission,
  ResourceAccessDescriptor,
} from "@/types/accessTypes";

import { assertPermission } from "./permissions";

/**
 * RBAC only (`hipster-stack new --access rbac`): the role's permissions
 * decide, and the one record rule left is the organization boundary. Viewers
 * reach every record in their organization. Same exports as the ABAC
 * policies, so fetchers and actions do not change.
 */

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

/** RBAC only: nobody is limited to their own records. */
export function limitedToOwnRecords(_context: AccessContext): boolean {
  return false;
}

export function canReadResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  return isSameTenant(context, resource);
}

export function canManageOwnedOrAssignedResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  return isSameTenant(context, resource);
}

/** RBAC, then the organization boundary, for a write to one record. */
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
