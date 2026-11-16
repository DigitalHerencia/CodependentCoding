import { z } from "zod";
export { onboardingSchema } from "@/schemas/onboardingSchemas";
export {
  createInvitationSchema,
  invitationIdSchema,
  acceptInvitationSchema,
} from "@/schemas/invitationSchemas";

export const organizationSettingsSchema = z.object({
  timezone: z.string().min(1).max(100),
  locale: z.string().min(2).max(35),
  defaultCurrency: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase()),
});

export const switchOrganizationSchema = z
  .object({ organizationId: z.uuid() })
  .strict();

export const persistedRecordIdSchema = z.uuid();
export const persistedReadLimitSchema = z.number().int().min(1).max(250);
export const persistedDateRangeSchema = z
  .object({ periodStart: z.coerce.date(), periodEnd: z.coerce.date() })
  .refine((value) => value.periodStart <= value.periodEnd, {
    message: "Period end must follow its start.",
    path: ["periodEnd"],
  });
