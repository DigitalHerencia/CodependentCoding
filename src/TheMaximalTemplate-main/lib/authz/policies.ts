import type { AccessContext } from "../../types/access";

import type { ResourceAccessDescriptor } from "./resources";
import { isPrivilegedRole } from "./roles";

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

export function canReadResource(
  context: AccessContext,
  resource: ResourceAccessDescriptor,
): boolean {
  if (!isSameTenant(context, resource)) {
    return false;
  }

  if (context.role !== "CLIENT") {
    return true;
  }

  return (
    resource.clientVisible === true ||
    ownsResource(context, resource) ||
    isAssignedResource(context, resource)
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
    isPrivilegedRole(context.role) ||
    context.role === "MANAGER" ||
    ownsResource(context, resource) ||
    isAssignedResource(context, resource)
  );
}
