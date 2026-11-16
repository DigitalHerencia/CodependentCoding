import { z } from "zod";
import { invitableRoles } from "@/lib/authz/roles";

export const createInvitationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Enter an email address.")),
    role: z.enum(invitableRoles),
  })
  .strict();

export const invitationIdSchema = z.object({ invitationId: z.uuid() }).strict();

export const acceptInvitationSchema = z
  .object({ token: z.string().min(32).max(128) })
  .strict();
