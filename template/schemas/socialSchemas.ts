import { z } from "zod";

export const createSocialPostSchema = z.object({
  title: z.string().trim().max(200).nullable().optional(),
  content: z.string().min(1).max(100_000),
  variants: z
    .array(
      z.object({
        socialAccountId: z.string().uuid(),
        content: z.string().min(1).max(100_000),
      }),
    )
    .min(1)
    .max(20),
});

export const scheduleSocialPostSchema = z.object({
  postId: z.string().uuid(),
  scheduledAt: z.coerce.date(),
  expectedVersion: z.number().int().positive(),
});
