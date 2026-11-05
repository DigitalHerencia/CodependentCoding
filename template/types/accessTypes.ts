import type { appRoles } from "@/lib/authz/roles";
import type { ModulePermission } from "@/types/moduleTypes";

export type AppRole = (typeof appRoles)[number];

/** `<module>.<resource>:<action>`; base resources use the `base` prefix. */
export type Permission = ModulePermission;

/** Clerk establishes user identity only. Application tenancy is resolved locally. */
export type AuthenticatedIdentity = {
  clerkUserId: string;
};

export type AuthenticatedSession = {
  clerkUserId: string;
  clerkSessionId: string;
};

export type CurrentSessionContext = {
  isAuthenticated: boolean;
  clerkUserId: string | null;
  clerkSessionId: string | null;
};

export type CurrentUserProfile = {
  clerkUserId: string;
  displayName: string | null;
  primaryEmailAddress: string | null;
  imageUrl: string;
};

export interface AccessContext extends AuthenticatedIdentity {
  userId: string;
  organizationId: string;
  membershipId: string;
  role: AppRole;
}

/** A base resource (`base.organization`) or one a module declares in `permissions.resources`. */
export type ResourceKind = `${string}.${string}`;

export type ResourceAccessDescriptor = {
  kind: ResourceKind;
  organizationId: string;
  ownerMembershipId?: string | null;
  assigneeMembershipId?: string | null;
  requesterUserId?: string | null;
  clientVisible?: boolean;
};
