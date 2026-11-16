import { z } from "zod";

/** Profile input never accepts tenant IDs, roles or the completion timestamp. */
export const onboardingSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your display name.").max(100),
  })
  .strict();
