import { z } from "zod";
import { appRoles } from "@/lib/constants/roles";

export const adminRoleSchema = z.enum(appRoles);

export const changeAdminMembershipSchema = z.object({
  membershipId: z.string().uuid(),
  role: adminRoleSchema,
});

export const updateAdminMembershipStatusSchema = z.object({
  membershipId: z.string().uuid(),
});

export const addAdminMembershipSchema = z.object({
  email: z.string().trim().email(),
  role: adminRoleSchema,
});
