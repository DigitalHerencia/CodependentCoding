"use server";

import {
  organizationSettingsSchema,
  switchOrganizationSchema,
} from "@/schemas/commonSchemas";
import type { ActionResult } from "@/types/actionTypes";
import { setActiveOrganizationPreference } from "@/lib/authz/tenancy";
import { requireIdentity } from "@/lib/auth/auth";
import { activeMembershipScope } from "@/lib/authz/mode";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidateAllPaths } from "@/lib/cache/invalidate";
import { toOrganizationDTO } from "@/lib/db/dtos/organizationDtos";
import { organizationOverviewSelect } from "@/lib/db/selects/organizationSelects";
import {
  withIdentityTransaction,
  withTenantTransaction,
} from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { toActionResult } from "@/lib/utils/actionResult";

export async function updateOrganizationSettings(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    return withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "base.settings:update");
      const input = organizationSettingsSchema.parse(rawInput);
      await tx.organizationSettings.upsert({
        where: { organizationId: access.organizationId },
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
        where: { id: access.organizationId },
        select: organizationOverviewSelect,
      });
      return toOrganizationDTO(record);
    });
  });
}

/**
 * Makes another of the caller's organizations the active one. The cookie is
 * set only after an ACTIVE membership there is confirmed; the tenancy wrapper
 * re-checks it on every request anyway.
 */
export async function switchOrganization(
  rawInput: unknown,
): Promise<ActionResult<{ organizationId: string }>> {
  return toActionResult(async () => {
    const organizationId = await withIdentityTransaction(async (tx, user) => {
      const { organizationId } = switchOrganizationSchema.parse(rawInput);
      const membership = await tx.membership.findFirst({
        where: { organizationId, ...activeMembershipScope(user.id) },
        select: { id: true },
      });
      if (!membership) throw new ResourceNotFoundError("Organization");
      return organizationId;
    });
    await setActiveOrganizationPreference(organizationId);
    invalidateAllPaths();
    return { organizationId };
  });
}
