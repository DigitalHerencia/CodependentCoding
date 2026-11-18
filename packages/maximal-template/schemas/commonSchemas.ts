/** Common Schemas contracts and composition for the owning application slice. */
import { z } from "zod";
export { onboardingSchema } from "@/schemas/authSchemas";
export {
  createInvitationSchema,
  invitationIdSchema,
  acceptInvitationSchema,
} from "@/schemas/invitationSchemas";

export const persistedRecordIdSchema = z.uuid();
export const persistedReadLimitSchema = z.number().int().min(1).max(250);
export const persistedDateRangeSchema = z
  .object({ periodStart: z.coerce.date(), periodEnd: z.coerce.date() })
  .refine((value) => value.periodStart <= value.periodEnd, {
    message: "Period end must follow its start.",
    path: ["periodEnd"],
  });
