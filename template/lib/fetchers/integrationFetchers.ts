import "server-only";

import { getProviderStatuses } from "../integrations/status";

export function getIntegrationStatuses() {
  return getProviderStatuses();
}
