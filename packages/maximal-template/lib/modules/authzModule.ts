/** Authorization owns organization membership, settings, and tenant discovery. */
import type { ModuleDefinition } from "@/types/moduleTypes";

/** Organization permissions and settings contributed by the authorization domain. */
export const authzModule = {
  id: "authz",
  settings: [{ label: "Members", href: "/settings/members" }],
  permissions: {
    resources: ["base.organization", "base.membership", "base.settings"],
    grants: { MEMBER: ["read"], VIEWER: ["read"] },
  },
} satisfies ModuleDefinition;
