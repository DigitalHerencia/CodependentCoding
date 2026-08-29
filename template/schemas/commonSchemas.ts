import { z } from "zod";

export const organizationSettingsSchema = z.object({
  timezone: z.string().min(1).max(100),
  locale: z.string().min(2).max(35),
  defaultCurrency: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase()),
});
