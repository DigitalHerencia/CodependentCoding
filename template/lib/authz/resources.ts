import "server-only";

import { installedModules } from "@/lib/modules/registry";

export type {
  ResourceAccessDescriptor,
  ResourceKind,
} from "@/types/accessTypes";

/** Resource kinds known to authz: base plus each installed module's. */
export const resourceKinds: readonly string[] = [
  "organization",
  ...installedModules.flatMap((entry) => entry.permissions?.resources ?? []),
];
