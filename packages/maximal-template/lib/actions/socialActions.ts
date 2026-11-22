"use server";

import { requireIdentity } from "@/lib/integrations/clerk/server";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidatePaths } from "@/lib/cache/invalidate";
import {
  isSocialMediaPreviewable,
  SOCIAL_MEDIA_MAX_BYTES,
} from "@/lib/constants/social";
import {
  approveSocialPostTx,
  createSocialPostTx,
  scheduleSocialPostTx,
} from "@/lib/db/selects/socialTx";
import { withTenantTransaction } from "@/lib/db/tenancy";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { readPrivateBlobBytes } from "@/lib/integrations/vercel-blob/download";
import { toActionResult } from "@/lib/utils/actionResult";
import {
  approveSocialPostSchema,
  createSocialPostSchema,
  scheduleSocialPostSchema,
  socialAssetIdSchema,
} from "@/schemas/socialSchemas";

/** Refresh the persisted post projections after their transaction commits. */
function invalidateSocialPosts() {
  invalidatePaths(["/social/calendar", "/social/compose", "/dashboard"]);
}

/** Save a tenant-scoped draft and its account variants. */
export async function createSocialPost(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "social.post:create");
      return createSocialPostTx(
        tx,
        access,
        createSocialPostSchema.parse(rawInput),
      );
    });
    invalidateSocialPosts();
    return saved;
  });
}

/** Save publication timing intent and audit the committed schedule. */
export async function scheduleSocialPost(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "social.post:update");
      const input = scheduleSocialPostSchema.parse(rawInput);
      const record = await scheduleSocialPostTx(tx, {
        ...input,
        organizationId: access.organizationId,
      });
      await tx.auditEvent.create({
        data: {
          organizationId: access.organizationId,
          actorUserId: access.userId,
          action: "social.post.scheduled",
          resourceType: "SocialPost",
          resourceId: record.id,
          metadata: {
            scheduledAt: input.scheduledAt.toISOString(),
            previousVersion: input.expectedVersion,
          },
        },
      });
      return record;
    });
    invalidateSocialPosts();
    return saved;
  });
}

/** Record a membership's approval of the expected draft revision and audit it atomically. */
export async function approveSocialPost(rawInput: unknown) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "social.post:update");
      const input = approveSocialPostSchema.parse(rawInput);
      const record = await approveSocialPostTx(tx, {
        ...input,
        organizationId: access.organizationId,
        approverMembershipId: access.membershipId,
      });
      await tx.auditEvent.create({
        data: {
          organizationId: access.organizationId,
          actorUserId: access.userId,
          action: "social.post.approved",
          resourceType: "SocialPost",
          resourceId: record.id,
          metadata: {
            membershipId: access.membershipId,
            reviewedVersion: input.expectedVersion,
          },
        },
      });
      return record;
    });
    invalidateSocialPosts();
    return saved;
  });
}

/** Resolve an authorized uploads asset before transferring its bounded private content. */
export async function downloadSocialMedia(rawInput: unknown, preview = false) {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const asset = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "social.media:read");
      const assetId = socialAssetIdSchema.parse(rawInput);
      const asset = await tx.asset.findFirst({
        where: { id: assetId, organizationId: access.organizationId },
        select: {
          storageProvider: true,
          storageKey: true,
          filename: true,
          contentType: true,
          byteSize: true,
        },
      });
      if (
        !asset ||
        asset.byteSize > BigInt(SOCIAL_MEDIA_MAX_BYTES) ||
        asset.storageProvider !== "vercel-blob" ||
        (preview && !isSocialMediaPreviewable(asset.contentType))
      ) {
        throw new ResourceNotFoundError("Available media asset");
      }
      return asset;
    });
    return {
      filename: asset.filename,
      contentType: asset.contentType,
      bytes: await readPrivateBlobBytes(
        asset.storageKey,
        SOCIAL_MEDIA_MAX_BYTES,
      ),
    };
  });
}
