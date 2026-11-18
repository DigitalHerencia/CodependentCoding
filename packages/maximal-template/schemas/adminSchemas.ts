/** Runtime contracts shared by server commands and React Hook Form. */
import { z } from "zod";
import { adminAssignableRoles } from "@/lib/constants/adminConstants";
/** Roles assignable without transferring ownership. */
export const adminRoleSchema = z.enum(adminAssignableRoles);
/** Role update scoped to a persistent membership. */
export const changeAdminMembershipSchema = z.object({
  membershipId: z.uuid(),
  role: adminRoleSchema,
});
/** Membership state update; the server chooses the desired state. */
export const updateAdminMembershipStatusSchema = z.object({
  membershipId: z.uuid(),
});
/** Preserve the existing verified-email workspace approval contract. */
export const addAdminMembershipSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  role: adminRoleSchema,
});
/** Normalize URL search criteria and bound offset pagination. */
export const adminListCriteriaSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000000).default(1),
  query: z.string().trim().max(200).default(""),
});
/** Clerk identities are strings, not application UUIDs. */
export const adminUserIdSchema = z.string().trim().min(1).max(200);
/** Inventory routes accept bounded registry identifiers. */
export const adminRecordIdSchema = z.string().trim().min(1).max(200);
