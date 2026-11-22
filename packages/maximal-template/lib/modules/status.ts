import "server-only";

import { baseEnv, hasAnyValue, hasValues } from "@/lib/utils/env";
import { isProduction } from "@/lib/constants/mode";
import { installedModules } from "@/lib/modules/registry";
import type { IntegrationStatus } from "@/types/integrationTypes";

/** Project only display metadata and environment presence for installed providers. */
export function getProviderStatuses(): IntegrationStatus[] {
  return installedModules.flatMap(({ integration }) =>
    integration
      ? [
          {
            name: integration.name,
            purpose: integration.purpose,
            configuration: hasValues(integration.env) ? "present" : "missing",
          },
        ]
      : [],
  );
}

/** Read one installed module's configuration presence without constructing a provider client. */
export function getProviderConfiguration(
  moduleId: string,
): IntegrationStatus["configuration"] | "unavailable" {
  const integration = installedModules.find(
    ({ id }) => id === moduleId,
  )?.integration;
  if (!integration) return "unavailable";
  return hasValues(integration.env) ? "present" : "missing";
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
