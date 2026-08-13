import { z } from 'zod';
import { invitationRoles, organizationRoles } from '@/types/authzTypes';

const organizationRoleSchema = z.enum(organizationRoles);
const invitationRoleSchema = z.enum(invitationRoles);

export const createOrganizationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(120),
  })
  .strict();

export const updateOrganizationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(120),
  })
  .strict();

export const inviteOrganizationMemberSchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    role: invitationRoleSchema,
  })
  .strict();

export const updateMembershipSchema = z
  .object({
    membershipId: z.string().trim().min(1),
    role: organizationRoleSchema.nullable(),
  })
  .strict();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteOrganizationMemberInput = z.infer<
  typeof inviteOrganizationMemberSchema
>;
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>;
