import type { AccessContext, Permission } from "../../types/access";

import { assertPermission, AuthorizationError } from "./permissions";
import {
  canManageOwnedOrAssignedResource,
  canReadResource,
  isSameTenant,
} from "./policies";
import type { ResourceAccessDescriptor } from "./resources";

export class ResourceAuthorizationError extends Error {
  constructor(resource: ResourceAccessDescriptor) {
    super(`Access denied for ${resource.kind} in the active organization.`);
    this.name = "ResourceAuthorizationError";
  }
}

export function authorize(
  context: AccessContext,
  permission: Permission,
  resource?: ResourceAccessDescriptor,
): void {
  assertPermission(context, permission);

  if (resource && !isSameTenant(context, resource)) {
    throw new ResourceAuthorizationError(resource);
  }
}

export function authorizeResourceRead(
  context: AccessContext,
  permission: Permission,
  resource: ResourceAccessDescriptor,
): void {
  assertPermission(context, permission);

  if (!canReadResource(context, resource)) {
    throw new ResourceAuthorizationError(resource);
  }
}

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

export { AuthorizationError };
