import "server-only";

import { hasValues } from "@/lib/env/base";
import { installedModules } from "@/lib/modules/registry";
import type { IntegrationStatus } from "@/types/integrationTypes";

/** One row per installed add-on that wraps a provider (ModuleDefinition.integration). */
export function getProviderStatuses(): IntegrationStatus[] {
  return installedModules.flatMap(({ integration }) => {
    if (!integration) return [];
    const configured = hasValues(integration.env);
    return [
      {
        name: integration.name,
        purpose: integration.purpose,
        state: configured ? "CONFIGURED" : "MISSING SECRET",
        mode: configured ? "LIVE" : "DEMO MODE",
      },
    ];
  });
}
