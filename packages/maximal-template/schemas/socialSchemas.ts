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
  scheduledAt: z.preprocess(
    (value) =>
      typeof value === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)
        ? value + "Z"
        : value,
    z.coerce.date(),
  ),
  expectedVersion: z.number().int().positive(),
});

export const approveSocialPostSchema = z.object({
  postId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});
