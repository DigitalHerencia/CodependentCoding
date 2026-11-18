/** Runtime contracts shared by server commands and React Hook Form. */
import { z } from "zod";
import { adminAssignableRoles } from "@/lib/constants/adminConstants";
/** Roles assignable without transferring ownership. */
export const adminRoleSchema = z.enum(adminAssignableRoles);
/** Role update scoped to a persistent membership. */
export const changeAdminMembershipSchema = z.strictObject({
  membershipId: z.uuid(),
  role: adminRoleSchema,
  organizationId: z.uuid(),
  deniedPermissions: z.array(z.string().min(1).max(200)).max(1000),
});
/** Membership state update; the server chooses the desired state. */
export const updateAdminMembershipStatusSchema = z.strictObject({
  membershipId: z.uuid(),
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
