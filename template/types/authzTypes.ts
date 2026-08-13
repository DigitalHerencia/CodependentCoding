import type { AuthenticatedUserContext } from '@/types/authTypes';

export const organizationRoles = [
  'owner',
  'admin',
  'member',
  'viewer',
] as const;
export type OrganizationRole = (typeof organizationRoles)[number];

export const organizationRoleLabels = {
  owner: 'Owner',
  admin: 'Administrator',
  member: 'Member',
  viewer: 'Viewer',
} as const satisfies Record<OrganizationRole, string>;

export const primaryOrganizationRole: OrganizationRole = 'owner';
export const defaultOrganizationRole: OrganizationRole = 'viewer';
export const invitationRoles = [
  'admin',
  'member',
  'viewer',
] as const satisfies readonly OrganizationRole[];
export const defaultInvitationRole: OrganizationRole = 'member';

export type Capability =
  | 'organization.read'
  | 'organization.manage'
  | 'membership.read'
  | 'membership.manage'
  | 'invitation.manage'
  | 'project.read'
  | 'project.create'
  | 'project.update'
  | 'project.archive'
  | 'audit.read'
  | 'billing.manage'
  | 'connect.manage'
  | 'media.read'
  | 'media.manage'
  | 'ai.use'
  | 'map.read'
  | 'map.manage';

export type TenantContext = AuthenticatedUserContext & {
  organization: {
    id: string;
    status: 'active' | 'suspended';
  };
  membership: {
    id: string;
    role: OrganizationRole;
  };
  capabilities: readonly Capability[];
};
