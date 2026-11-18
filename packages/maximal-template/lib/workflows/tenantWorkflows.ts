/** Tenant Workflows contracts and composition for the owning application slice. */
import "server-only";

import { hasPermission } from "@/lib/authz/permissions";
import { isPrivilegedRole } from "@/lib/authz/roles";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import { moduleNavigation, settingsNavigation } from "@/lib/modules/navigation";
import { installedModules } from "@/lib/modules/registry";
import { tenantMobileItems, tenantCopy } from "@/content/tenant";
import { tenantNavigationSchema } from "@/schemas/tenantSchemas";
import type { AccessContext } from "@/types/authzTypes";
import type { ModuleDefinition } from "@/types/moduleTypes";
import type { TenantNavigationDTO } from "@/types/tenantTypes";

// ============================================================================
// AUTHORIZED NAVIGATION PROJECTION
// ============================================================================

/**
 * Prepare serializable navigation using current application permissions.
 *
 * @remarks
 * This is UI discovery only: the route and action authorization checks remain
 * mandatory, regardless of whether a destination appears in navigation.
 */
export function buildTenantNavigation(
  access: AccessContext,
  modules: readonly ModuleDefinition[] = installedModules,
): TenantNavigationDTO {
  const visibleModules = modules.filter((module) => {
    if (!module.nav && !module.settings?.length) return false;
    if (isPrivilegedRole(access.role)) return true;
    return (module.permissions?.resources ?? []).some((resource) =>
      hasPermission(access, `${resource}:read`),
    );
  });

  const groups = [
    ...moduleNavigation(visibleModules).map(({ id, label, icon, links }) => ({
      id,
      label,
      icon,
      links,
    })),
    {
      id: "settings",
      label: tenantCopy.settings,
      icon: "settings" as const,
      // Match the existing integrations route's server permission; discovery is
      // still separate from the unchanged route/action authorization checks.
      links: settingsNavigation(visibleModules).filter(
        (link) =>
          link.href !== "/settings/integrations" ||
          hasPermission(access, "base.settings:update"),
      ),
    },
  ];

  return tenantNavigationSchema.parse({
    groups,
    mobile: tenantMobileItems,
  });
}

/** Read current membership authorization and assemble shared tenant navigation. */
export async function loadTenantNavigationWorkflow(): Promise<TenantNavigationDTO> {
  return withAuthenticatedRead(async (_tx, access) =>
    buildTenantNavigation(access),
  );
}
