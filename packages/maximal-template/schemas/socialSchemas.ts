import { z } from "zod";
import { hasSocialScheduleLeadTime } from "@/lib/utils/social";

/** Validate parent and per-account draft content before resolving tenant targets. */
export const createSocialPostSchema = z.object({
  title: z.string().trim().max(200).nullable().optional(),
  content: z
    .string()
    .max(100_000)
    .refine((content) => content.trim().length > 0),
  variants: z
    .array(
      z.object({
        socialAccountId: z.uuid().toLowerCase(),
        content: z.string().max(100_000).trim().min(1),
      }),
    )
    .min(1)
    .max(20)
    .refine(
      (variants) =>
        new Set(variants.map((variant) => variant.socialAccountId)).size ===
        variants.length,
      "Select each account at most once.",
    ),
});

/** Validation shared by server commands and the explicitly UTC form. */
const scheduleLeadTimeMessage =
  "Choose a time at least one minute in the future.";

/** Accept an unambiguous instant and the version on which the command is based. */
export const scheduleSocialPostSchema = z.object({
  postId: z.string().uuid(),
  scheduledAt: z
    .union([
      z.date(),
      z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
    ])
    .refine(
      (value) => hasSocialScheduleLeadTime(value),
      scheduleLeadTimeMessage,
    ),
  expectedVersion: z.number().int().positive(),
});

/** Interpret the labeled UTC form field explicitly before calling the server. */
export const scheduleSocialPostFormSchema = scheduleSocialPostSchema.extend({
  scheduledAt: z.iso
    .datetime({ local: true, precision: -1 })
    .refine((value) => !value.endsWith("Z"), "Enter a UTC date and time.")
    .transform((value) => new Date(`${value}:00Z`))
    .refine(
      (value) => hasSocialScheduleLeadTime(value),
      scheduleLeadTimeMessage,
    ),
});

/** Capture the exact draft version reviewed by the approving membership. */
export const approveSocialPostSchema = z.object({
  postId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});

/** Accept an asset reference for server-side tenant and storage resolution. */
export const socialAssetIdSchema = z.uuid();
