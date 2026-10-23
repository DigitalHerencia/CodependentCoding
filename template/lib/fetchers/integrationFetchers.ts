import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { getProviderStatuses } from "@/lib/integrations/status";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getIntegrationStatuses() {
  return withAuthenticatedRead(async (_tx, access) => {
    assertPermission(access, "organization:read");
    return getProviderStatuses();
  });
}
