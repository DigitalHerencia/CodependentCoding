import { organizationSettingsSchema } from "../../schemas/commonSchemas";

import { requireIdentity } from "../auth/auth";
import { assertPermission } from "../authz/permissions";
import { toOrganizationDTO } from "../db/dto/common.dto";
import { organizationOverviewSelect } from "../db/selects/common.selects";
import { withTenantTransaction } from "../db/tenant";

export async function updateOrganizationSettingsWorkflow(rawInput: unknown) {
  const input = organizationSettingsSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "organization:write");

    await tx.organizationSettings.upsert({
      where: {
        organizationId: access.organizationId,
      },
      update: {
        timezone: input.timezone,
        locale: input.locale,
        defaultCurrency: input.defaultCurrency,
      },
      create: {
        organizationId: access.organizationId,
        timezone: input.timezone,
        locale: input.locale,
        defaultCurrency: input.defaultCurrency,
      },
    });

    await tx.auditEvent.create({
      data: {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        action: "organization.settings.updated",
        resourceType: "Organization",
        resourceId: access.organizationId,
      },
    });

    const record = await tx.organization.findFirstOrThrow({
      where: {
        id: access.organizationId,
      },
      select: organizationOverviewSelect,
    });

    return toOrganizationDTO(record);
  });
}
