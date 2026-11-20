"use server";
/** Each mutation independently validates identity, permission, ownership and concurrency. */
import { toActionResult } from "@/lib/utils/actionResult";
import {
  audienceFormSchema,
  audienceDefinitionSchema,
  updateAudienceSchema,
  updateCampaignSchema,
  createCampaignSchema,
  updateCampaignStatusSchema,
  futureCampaignScheduleSchema,
  permittedCampaignTransitionSchema,
} from "@/schemas/marketingSchemas";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { authorizeOwnedOrAssignedWrite } from "@/lib/authz/policies";
import { invalidatePaths } from "@/lib/cache/invalidate";
import {
  toAudienceMutationDTO,
  toCampaignMutationDTO,
} from "@/lib/db/dtos/marketingDtos";
import { campaignSelect } from "@/lib/db/selects/marketingSelects";
import {
  auditMarketingTx,
  assertCampaignRelationsTx,
} from "@/lib/db/selects/marketingTx";
import { withTenantTransaction } from "@/lib/db/tenancy";
import {
  ConcurrencyConflictError,
  InvariantViolationError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";

/** Invalidate dependent planning views only after the complete transaction commits. */
async function mutateMarketing<T extends { id: string }>(
  kind: "campaigns" | "audiences",
  write: () => Promise<T>,
) {
  return toActionResult(async () => {
    const saved = await write();
    invalidatePaths([
      "/marketing/campaigns",
      "/marketing/audiences",
      "/marketing/analytics",
      "/dashboard",
      `/marketing/${kind}/${saved.id}`,
      `/marketing/${kind}/${saved.id}/edit`,
    ]);
    return saved;
  });
}

/** Create a tenant-owned plan and audit its creation atomically without delivery. */
export async function createCampaign(rawInput: unknown) {
  return mutateMarketing("campaigns", async () =>
    withTenantTransaction(await requireIdentity(), async (tx, access) => {
      assertPermission(access, "marketing.campaign:create");
      const input = createCampaignSchema.parse(rawInput);
      if (input.scheduledAt)
        futureCampaignScheduleSchema.parse({ scheduledAt: input.scheduledAt });
      await assertCampaignRelationsTx(
        tx,
        access.organizationId,
        input.audienceId,
        access.membershipId,
      );
      const record = await tx.campaign.create({
        data: {
          organizationId: access.organizationId,
          ownerMembershipId: access.membershipId,
          audienceId: input.audienceId ?? null,
          name: input.name,
          description: input.description ?? null,
          scheduledAt: input.scheduledAt ?? null,
          status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
        },
        select: { id: true, version: true },
      });
      await auditMarketingTx(tx, access, "Campaign", record.id, "created");
      return toCampaignMutationDTO(record);
    }),
  );
}

/** Planning transitions update timestamps only; no provider or delivery is called. */
export async function updateCampaignStatus(rawInput: unknown) {
  return mutateMarketing("campaigns", async () =>
    withTenantTransaction(await requireIdentity(), async (tx, access) => {
      assertPermission(access, "marketing.campaign:update");
      const input = updateCampaignStatusSchema.parse(rawInput);
      const existing = await tx.campaign.findFirst({
        where: { id: input.campaignId, organizationId: access.organizationId },
        select: { ...campaignSelect, ownerMembershipId: true },
      });
      if (!existing) throw new ResourceNotFoundError("Campaign");
      authorizeOwnedOrAssignedWrite(access, "marketing.campaign:update", {
        kind: "marketing.campaign",
        organizationId: access.organizationId,
        ownerMembershipId: existing.ownerMembershipId,
      });
      if (existing.version !== input.expectedVersion)
        throw new ConcurrencyConflictError("Campaign");
      permittedCampaignTransitionSchema.parse({
        from: existing.status,
        status: input.status,
      });
      const now = new Date();
      if (
        input.status === "SCHEDULED" &&
        (!existing.scheduledAt || existing.scheduledAt <= now)
      )
        throw new InvariantViolationError(
          "Scheduling requires a future UTC instant.",
        );
      await assertCampaignRelationsTx(
        tx,
        access.organizationId,
        existing.audience?.id,
        existing.ownerMembershipId,
      );
      const result = await tx.campaign.updateMany({
        where: {
          id: existing.id,
          organizationId: access.organizationId,
          version: input.expectedVersion,
          status: existing.status,
        },
        data: {
          status: input.status,
          version: { increment: 1 },
          ...(input.status === "DRAFT"
            ? {
                scheduledAt: null,
                startedAt: null,
                completedAt: null,
                canceledAt: null,
              }
            : {}),
          ...(input.status === "ACTIVE"
            ? {
                startedAt: existing.startedAt ?? now,
                completedAt: null,
                canceledAt: null,
              }
            : {}),
          ...(input.status === "COMPLETED"
            ? { completedAt: now, canceledAt: null }
            : {}),
          ...(input.status === "CANCELED"
            ? { canceledAt: now, completedAt: null }
            : {}),
        },
      });
      if (result.count !== 1) throw new ConcurrencyConflictError("Campaign");
      await auditMarketingTx(
        tx,
        access,
        "Campaign",
        existing.id,
        "status-changed",
      );
      return toCampaignMutationDTO(
        await tx.campaign.findFirstOrThrow({
          where: { id: existing.id, organizationId: access.organizationId },
          select: { id: true, version: true },
        }),
      );
    }),
  );
}

/** Update one current editable plan while preserving optimistic version checks. */
export async function updateCampaign(rawInput: unknown) {
  return mutateMarketing("campaigns", async () =>
    withTenantTransaction(await requireIdentity(), async (tx, access) => {
      assertPermission(access, "marketing.campaign:update");
      const input = updateCampaignSchema.parse(rawInput);
      const existing = await tx.campaign.findFirst({
        where: { id: input.campaignId, organizationId: access.organizationId },
        select: { ...campaignSelect, ownerMembershipId: true },
      });
      if (!existing) throw new ResourceNotFoundError("Campaign");
      authorizeOwnedOrAssignedWrite(access, "marketing.campaign:update", {
        kind: "marketing.campaign",
        organizationId: access.organizationId,
        ownerMembershipId: existing.ownerMembershipId,
      });
      if (existing.version !== input.expectedVersion)
        throw new ConcurrencyConflictError("Campaign");
      if (!["DRAFT", "SCHEDULED", "PAUSED"].includes(existing.status))
        throw new InvariantViolationError(
          "This campaign cannot be edited in its current state.",
        );
      if (
        input.scheduledAt &&
        input.scheduledAt.getTime() !== existing.scheduledAt?.getTime()
      )
        futureCampaignScheduleSchema.parse({ scheduledAt: input.scheduledAt });
      await assertCampaignRelationsTx(
        tx,
        access.organizationId,
        input.audienceId,
        existing.ownerMembershipId,
      );
      const result = await tx.campaign.updateMany({
        where: {
          id: existing.id,
          organizationId: access.organizationId,
          version: input.expectedVersion,
          status: existing.status,
        },
        data: {
          name: input.name,
          description: input.description ?? null,
          audienceId: input.audienceId ?? null,
          scheduledAt: input.scheduledAt ?? null,
          status:
            existing.status === "PAUSED"
              ? "PAUSED"
              : input.scheduledAt
                ? "SCHEDULED"
                : "DRAFT",
          version: { increment: 1 },
        },
      });
      if (result.count !== 1) throw new ConcurrencyConflictError("Campaign");
      await auditMarketingTx(tx, access, "Campaign", existing.id, "updated");
      return toCampaignMutationDTO(
        await tx.campaign.findFirstOrThrow({
          where: { id: existing.id, organizationId: access.organizationId },
          select: { id: true, version: true },
        }),
      );
    }),
  );
}

/** Persist a structured audience definition and its audit event in one transaction. */
export async function createAudience(rawInput: unknown) {
  return mutateMarketing("audiences", async () =>
    withTenantTransaction(await requireIdentity(), async (tx, access) => {
      assertPermission(access, "marketing.audience:create");
      const input = audienceFormSchema.parse(rawInput);
      const record = await tx.audience.create({
        data: { ...input, organizationId: access.organizationId },
        select: { id: true, updatedAt: true },
      });
      await auditMarketingTx(tx, access, "Audience", record.id, "created");
      return toAudienceMutationDTO(record);
    }),
  );
}

/** Omitting definition preserves rules that this editor cannot safely represent. */
export async function updateAudience(rawInput: unknown) {
  return mutateMarketing("audiences", async () =>
    withTenantTransaction(await requireIdentity(), async (tx, access) => {
      assertPermission(access, "marketing.audience:update");
      const input = updateAudienceSchema.parse(rawInput);
      const existing = await tx.audience.findFirst({
        where: { id: input.audienceId, organizationId: access.organizationId },
        select: { id: true, updatedAt: true, definition: true },
      });
      if (!existing) throw new ResourceNotFoundError("Audience");
      authorizeOwnedOrAssignedWrite(access, "marketing.audience:update", {
        kind: "marketing.audience",
        organizationId: access.organizationId,
      });
      if (existing.updatedAt.getTime() !== input.expectedUpdatedAt.getTime())
        throw new ConcurrencyConflictError("Audience");
      if (
        input.definition !== undefined &&
        !audienceDefinitionSchema.safeParse(existing.definition).success
      )
        throw new InvariantViolationError(
          "This persisted definition cannot be replaced by the current editor.",
        );
      // A monotonic millisecond timestamp prevents same-tick writes from sharing an editor token.
      const updatedAt = new Date(
        Math.max(Date.now(), existing.updatedAt.getTime() + 1),
      );
      // PostgreSQL may retain microseconds; browser tokens represent milliseconds.
      // The monotonic replacement timestamp makes this narrow interval safe for CAS.
      const result = await tx.audience.updateMany({
        where: {
          id: existing.id,
          organizationId: access.organizationId,
          updatedAt: {
            gte: input.expectedUpdatedAt,
            lt: new Date(input.expectedUpdatedAt.getTime() + 1),
          },
        },
        data: {
          name: input.name,
          status: input.status,
          updatedAt,
          ...(input.definition === undefined
            ? {}
            : { definition: input.definition }),
        },
      });
      if (result.count !== 1) throw new ConcurrencyConflictError("Audience");
      await auditMarketingTx(tx, access, "Audience", existing.id, "updated");
      return toAudienceMutationDTO(
        await tx.audience.findFirstOrThrow({
          where: { id: existing.id, organizationId: access.organizationId },
          select: { id: true, updatedAt: true },
        }),
      );
    }),
  );
}
