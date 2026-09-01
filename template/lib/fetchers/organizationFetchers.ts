import "server-only";

import { assertPermission } from "../authz/permissions";
import { withAuthenticatedRead } from "../db/tenant";
import { toOrganizationDTO } from "../db/dto/organization.dto";
import { organizationOverviewSelect } from "../db/selects/organization.selects";

export async function getCurrentOrganization() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "organization:read");

    const record = await tx.organization.findFirstOrThrow({
      where: {
        id: access.organizationId,
      },
      select: organizationOverviewSelect,
    });

    return toOrganizationDTO(record);
  });
}
