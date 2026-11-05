import { z } from "zod";
import { appRoles, invitableRoles } from "@/lib/authz/roles";

export const adminRoleSchema = z.enum(appRoles);

export const changeAdminMembershipSchema = z.object({
  membershipId: z.string().uuid(),
  role: adminRoleSchema,
});

export const updateAdminMembershipStatusSchema = z.object({
  membershipId: z.string().uuid(),
});

export const addAdminMembershipSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  role: z.enum(invitableRoles),
});

export const adminBulkOperationSchema = z.array(
  z.discriminatedUnion("kind", [
    changeAdminMembershipSchema.extend({ kind: z.literal("change-role") }),
    updateAdminMembershipStatusSchema.extend({ kind: z.literal("suspend") }),
    updateAdminMembershipStatusSchema.extend({ kind: z.literal("restore") }),
  ]),
);
