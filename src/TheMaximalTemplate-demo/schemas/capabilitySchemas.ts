import { z } from "zod"

export const mediaUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0 && file.size <= 10_000_000, "Choose a file up to 10 MB."),
})

export const inferenceSchema = z.object({
  prompt: z.string().trim().min(3).max(4000),
})

export const locationSearchSchema = z.object({
  query: z.string().trim().min(2).max(256),
})

export const saveLocationSchema = z.object({
  label: z.string().trim().min(2).max(200),
  mapboxId: z.string().trim().max(255).optional(),
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
})

export const cloudinaryNotificationSchema = z.object({
  notification_type: z.string().min(1),
  asset_id: z.string().min(1),
  public_id: z.string().min(1),
  resource_type: z.string().min(1),
  secure_url: z.string().url().optional(),
  format: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

export type SaveLocationInput = z.infer<typeof saveLocationSchema>
