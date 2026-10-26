import { z } from "zod";

export const organizationSettingsSchema = z.object({
  timezone: z.string().min(1).max(100),
  locale: z.string().min(2).max(35),
  defaultCurrency: z
    .string()
    .length(3)
    .transform((value) => value.toUpperCase()),
});

export const onboardingSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a workspace name.").max(100),
  })
  .strict();

export const createInvitationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Enter an email address.")),
    role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
  })
  .strict();

export const invitationIdSchema = z.object({ invitationId: z.uuid() }).strict();

export const acceptInvitationSchema = z
  .object({ token: z.string().min(32).max(128) })
  .strict();
