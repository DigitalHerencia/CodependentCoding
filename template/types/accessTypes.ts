import type { appRoles } from "@/lib/constants/roles";
import type { ModulePermission } from "@/types/moduleTypes";

export type AppRole = (typeof appRoles)[number];

/** `<module>.<resource>:<action>`; base resources use the `base` prefix. */
export type Permission = ModulePermission;

/** Clerk establishes user identity only. Application tenancy is resolved locally. */
export interface AuthenticatedIdentity {
  clerkUserId: string;
}

export interface AuthenticatedSession {
  clerkUserId: string;
  clerkSessionId: string;
}

export interface CurrentSessionContext {
  isAuthenticated: boolean;
  clerkUserId: string | null;
  clerkSessionId: string | null;
}

export interface CurrentUserProfile {
  clerkUserId: string;
  displayName: string | null;
  primaryEmailAddress: string | null;
  imageUrl: string;
}

export interface AccessContext extends AuthenticatedIdentity {
  userId: string;
  organizationId: string;
  membershipId: string;
  role: AppRole;
}

/** A base resource (`base.organization`) or one a module declares in `permissions.resources`. */
export type ResourceKind = `${string}.${string}`;

export interface ResourceAccessDescriptor {
  kind: ResourceKind;
  organizationId: string;
  ownerMembershipId?: string | null;
  assigneeMembershipId?: string | null;
  requesterUserId?: string | null;
  clientVisible?: boolean;
}
