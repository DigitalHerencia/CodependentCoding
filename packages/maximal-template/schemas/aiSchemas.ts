import { z } from "zod";

/** Reject unsupported options; model, credentials and request bounds are server-owned. */
export const aiGenerationRequestSchema = z.strictObject({
  prompt: z
    .string()
    .trim()
    .min(1, "Enter a prompt.")
    .max(100_000, "Use at most 100,000 characters."),
});

/** Bound result size and pagination offset. */
export const aiPageQuerySchema = z.strictObject({
  page: z.coerce.number().int().min(1).max(1000).default(1),
});

/** Validate untrusted SDK output before persistence or transport. */
export const aiInferenceResultSchema = z.strictObject({
  text: z.string().min(1).max(100_000),
  inputTokens: z.number().int().nonnegative().max(2_147_483_647).nullable(),
  outputTokens: z.number().int().nonnegative().max(2_147_483_647).nullable(),
  cost: z
    .string()
    .regex(/^\d{1,11}(?:\.\d{1,8})?$/)
    .nullable(),
});

/** Only the provider response fields used by the existing text-generation integration. */
export const aiProviderTextResponseSchema = z.object({
  generated_text: z.string(),
  details: z
    .object({ generated_tokens: z.number().int().nonnegative().optional() })
    .nullish(),
});
