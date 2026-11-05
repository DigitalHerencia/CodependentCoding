import "server-only";

import { baseEnv, hasAnyValue, hasValues } from "@/lib/utils/env";
import { isProduction } from "@/lib/constants/mode";
import { installedModules } from "@/lib/modules/registry";
import type { IntegrationStatus } from "@/types/integrationTypes";

/** One row per installed add-on that wraps a provider (ModuleDefinition.integration). */
export function getProviderStatuses(): IntegrationStatus[] {
  return installedModules.flatMap(({ integration }) => {
    if (!integration) return [];
    const configured = hasValues(integration.env);
    const unconfiguredMode = isProduction ? "UNAVAILABLE" : "DEMO MODE";
    return [
      {
        name: integration.name,
        purpose: integration.purpose,
        state: configured ? "CONFIGURED" : "MISSING SECRET",
        mode: configured ? "LIVE" : unconfiguredMode,
      },
    ];
  });
}

/** Optional integrations may be absent, but selected production integrations must be complete. */
export function validateProductionIntegrations() {
  if (!isProduction) return;
  baseEnv.read();
  const incomplete = installedModules.flatMap(({ id, integration }) => {
    if (!integration) return [];
    if (
      ["inference", "ratelimit"].includes(id) &&
      !hasAnyValue(integration.env)
    )
      return [];
    return hasValues(integration.env) ? [] : [integration];
  });
  const authKeys = ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"];
  const missing = incomplete.flatMap(({ env }) =>
    env.filter((name) => !hasValues([name])),
  );
  missing.push(...authKeys.filter((name) => !hasValues([name])));
  if (missing.length)
    throw new Error(
      "Production configuration is incomplete. Set: " +
        [...new Set(missing)].join(", "),
    );
}
