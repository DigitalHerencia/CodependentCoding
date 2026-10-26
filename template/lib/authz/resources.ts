import "server-only";

import { installedModules } from "@/lib/modules/registry";
import type { ResourceKind } from "@/types/accessTypes";
import type { PermissionAction } from "@/types/moduleTypes";

export type {
  ResourceAccessDescriptor,
  ResourceKind,
} from "@/types/accessTypes";

export const permissionActions = [
  "read",
  "create",
  "update",
  "delete",
  "manage",
] as const satisfies readonly PermissionAction[];

/** Resources every app has (AUTH.md §5.2); billing joins when its module is installed. */
export const baseResources = [
  "base.organization",
  "base.membership",
  "base.settings",
] as const satisfies readonly ResourceKind[];

/** Resources known to authz: base plus each installed module's. */
export const resourceKinds: readonly ResourceKind[] = [
  ...baseResources,
  ...installedModules.flatMap((entry) => entry.permissions?.resources ?? []),
];
