import { z } from "zod";
import { invitableRoles } from "@/lib/authz/roles";

/** Validate the invitation command at its server boundary. */
export const createInvitationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .pipe(z.email("Enter an email address.")),
    role: z.enum(invitableRoles),
  })
  .strict();

/** Validate the invitation command at its server boundary. */
export const invitationIdSchema = z.object({ invitationId: z.uuid() }).strict();

/** Validate the invitation command at its server boundary. */
export const acceptInvitationSchema = z
  .object({ token: z.string().min(32).max(128) })
  .strict();

/** Edits preserve the original token and expiry while replacing email and role. */
export const editInvitationSchema = createInvitationSchema
  .extend({ invitationId: z.uuid() })
  .strict();
