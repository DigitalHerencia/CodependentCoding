import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { DashboardPreferencesDTO } from "@/types/dashboardTypes";
import { toDashboardPreferencesDTO } from "@/lib/db/dtos/dashboardDtos";
import { dashboardPreferenceSelect } from "@/lib/db/selects/dashboardSelects";

/** Trusted, server-derived context for one dashboard preference write. */
export type DashboardPreferenceWriteContext = {
  organizationId: string;
  membershipId: string;
  actorUserId: string;
  preferences: DashboardPreferencesDTO;
};

/**
 * Atomically upsert preferences and append the corresponding audit event.
 *
 * @remarks
 * The caller supplies an already authorized tenant transaction. No provider or
 * network calls occur here. A failed audit insertion rolls back the upsert.
 */
export async function saveDashboardPreferencesTx(
  tx: Prisma.TransactionClient,
  input: DashboardPreferenceWriteContext,
): Promise<DashboardPreferencesDTO> {
  const record = await tx.dashboardPreference.upsert({
    where: { membershipId: input.membershipId },
    create: {
      organizationId: input.organizationId,
      membershipId: input.membershipId,
      ...input.preferences,
    },
    update: { ...input.preferences },
    select: dashboardPreferenceSelect,
  });

  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "dashboard.preferences.updated",
      resourceType: "DashboardPreference",
      resourceId: record.id,
      metadata: { ...input.preferences },
    },
  });

  return toDashboardPreferencesDTO(record);
}
