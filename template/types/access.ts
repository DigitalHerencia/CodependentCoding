export type AppRole =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "MEMBER"
  | "BILLING"
  | "SUPPORT"
  | "CLIENT"
  | "VIEWER";

export type Permission =
  | "organization:read"
  | "organization:write"
  | "crm:read"
  | "crm:write"
  | "projects:read"
  | "projects:write"
  | "support:read"
  | "support:write"
  | "marketing:read"
  | "marketing:write"
  | "invoicing:read"
  | "invoicing:write"
  | "social:read"
  | "social:write"
  | "ai:read"
  | "ai:write"
  | "portal:read"
  | "portal:write"
  | "portal:billing"
  | "admin:audit"
  | "admin:records"
  | "admin:users"
  | "admin:bulk";

/** Clerk establishes user identity only. Application tenancy is resolved locally. */
export interface AuthenticatedIdentity {
  clerkUserId: string;
}

export interface AccessContext extends AuthenticatedIdentity {
  userId: string;
  organizationId: string;
  membershipId: string;
  role: AppRole;
}
