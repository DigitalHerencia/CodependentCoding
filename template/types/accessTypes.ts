import type { appRoles } from "@/lib/constants/roles";
import type { basePermissions } from "@/lib/authz/permissions";
import type { ModulePermission } from "@/types/moduleTypes";

export type AppRole = (typeof appRoles)[number];

/** Base permissions are literal; module permissions come from the registry at runtime. */
export type Permission = (typeof basePermissions)[number] | ModulePermission;

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

/** "organization" or a resource kind a module declares in `permissions.resources`. */
export type ResourceKind = string;

export interface ResourceAccessDescriptor {
  kind: ResourceKind;
  organizationId: string;
  ownerMembershipId?: string | null;
  assigneeMembershipId?: string | null;
  requesterUserId?: string | null;
  clientVisible?: boolean;
}
