import "server-only"

import { requireTenantContext } from "@/lib/auth/session"
import { assertCapability } from "@/lib/authz/assertions"
import { createLocationTx, recordMediaAssetTx } from "@/lib/db/transactions/capabilityTransactions"
import { withTenantContext } from "@/lib/db/withTenantContext"
import { runHuggingFaceInference } from "@/lib/integrations/huggingface/inference"
import { geocodeLocation } from "@/lib/integrations/mapbox/geocoding"
import { uploadToCloudinary } from "@/lib/integrations/cloudinary/uploads"
import {
  inferenceSchema,
  locationSearchSchema,
  mediaUploadSchema,
  saveLocationSchema,
} from "@/schemas/capabilitySchemas"

export async function uploadMediaWorkflow(input: unknown) {
  const parsed = mediaUploadSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "media.manage")
  const uploaded = await uploadToCloudinary(parsed.file)
  return withTenantContext(context.organization.id, (tx) =>
    recordMediaAssetTx(tx, {
      ...uploaded,
      organizationId: context.organization.id,
      uploadedById: context.localUser.id,
    })
  )
}

export async function runInferenceWorkflow(input: unknown) {
  const parsed = inferenceSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "ai.use")
  return runHuggingFaceInference(parsed.prompt)
}

export async function searchLocationsWorkflow(input: unknown) {
  const parsed = locationSearchSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "map.read")
  return geocodeLocation(parsed.query)
}

export async function saveLocationWorkflow(input: unknown) {
  const parsed = saveLocationSchema.parse(input)
  const context = await requireTenantContext()
  assertCapability(context, "map.manage")
  return withTenantContext(context.organization.id, (tx) =>
    createLocationTx(tx, { ...parsed, organizationId: context.organization.id })
  )
}
