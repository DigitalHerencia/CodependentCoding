import "server-only";

import { assertPermission } from "../authz/permissions";
import { toOrganizationDTO } from "../db/dto/common.dto";
import { organizationOverviewSelect } from "../db/selects/common.selects";
import { withTemplateReadTransaction } from "../db/tenant";

export async function getCurrentOrganization() {
  return withTemplateReadTransaction(async (tx, access) => {
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
