"use server";

import { randomUUID } from "node:crypto";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { withTenantTransaction } from "@/lib/db/tenant";
import { uploadBlob } from "@/lib/integrations/vercel-blob/upload";
import { deleteBlob } from "@/lib/integrations/vercel-blob/delete";
import { toUploadedAssetDTO } from "@/lib/db/dtos/uploadsDtos";
import { uploadDomainSchema, uploadFileSchema } from "@/schema/uploadsSchemas";

export async function uploadWorkspaceAsset(formData: FormData) {
  const identity = await requireIdentity();
  if (!(formData instanceof FormData)) throw new Error("Invalid upload.");
  const domain = uploadDomainSchema.parse(formData.get("domain"));
  const access = await withTenantTransaction(identity, async (_tx, access) => {
    assertPermission(
      access,
      domain === "portal" ? "portal.document:create" : "social.media:create",
    );
    return access;
  });
  const file = uploadFileSchema.parse(formData.get("file"));
  const filename = file.name.replace(/[\\/\r\n]/g, "_").slice(0, 255) || "file";
  const blob = await uploadBlob(
    `${access.organizationId}/${randomUUID()}`,
    file,
    file.type || "application/octet-stream",
  );
  try {
    return await withTenantTransaction(identity, async (tx, current) => {
      assertPermission(
        current,
        domain === "portal" ? "portal.document:create" : "social.media:create",
      );
      if (current.organizationId !== access.organizationId)
        throw new Error("Workspace changed during upload.");
      const asset = await tx.asset.create({
        data: {
          organizationId: current.organizationId,
          createdByMembershipId: current.membershipId,
          storageProvider: "vercel-blob",
          storageKey: blob.pathname,
          filename,
          contentType: file.type || "application/octet-stream",
          byteSize: BigInt(file.size),
        },
        select: { id: true, filename: true },
      });
      return toUploadedAssetDTO(asset);
    });
  } catch (cause) {
    try {
      await deleteBlob(blob.pathname);
    } catch {
      throw new Error(
        "File metadata could not be saved and storage cleanup failed. Contact the workspace administrator.",
      );
    }
    throw cause;
  }
}
