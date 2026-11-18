/** Shared authorization, membership, tenancy, and organization presentation contracts. */
import type { organizationMemberSelect } from "@/lib/db/selects/authzSelects";
import type { ChangeEvent } from "react";
import type { Prisma } from "@/generated/prisma/client";
import type { tenancies } from "@/lib/constants/authzConstants";
import type { AuthenticatedIdentity } from "@/types/authTypes";
import type { MembershipRole } from "@/generated/prisma/enums";
import type { ModulePermission } from "@/types/moduleTypes";

/** Application membership role backed by the database enum. */
export type AppRole = MembershipRole;

/** `<module>.<resource>:<action>`; base resources use the `base` prefix. */
export type Permission = ModulePermission;

/** Authenticated identity combined with the active organization membership. */
export interface AccessContext extends AuthenticatedIdentity {
  userId: string;
  organizationId: string;
  membershipId: string;
  role: AppRole;
}

/** A base resource (`base.organization`) or one a module declares in `permissions.resources`. */
export type ResourceKind = `${string}.${string}`;

/** Resource attributes evaluated after the membership role permission check. */
export type ResourceAccessDescriptor = {
  kind: ResourceKind;
  organizationId: string;
  ownerMembershipId?: string | null;
  assigneeMembershipId?: string | null;
  requesterUserId?: string | null;
  clientVisible?: boolean;
};

/** Supported organization allocation mode. */
export type Tenancy = (typeof tenancies)[number];

/** One organization the signed-in user holds an ACTIVE membership in. */
export type OrganizationOptionDTO = {
  id: string;
  name: string;
};

/** Active organization and the caller's available organization choices. */
export type OrganizationSwitcherDTO = {
  activeOrganizationId: string;
  organizations: OrganizationOptionDTO[];
};

/** Trusted identity fields used to allocate application workspace access. */
export type ProvisionedUser = { id: string; displayName: string | null };

/** Identity fixtures required before creating authorization fixtures. */
export type AuthzSeedIdentityContext = {
  tx: Prisma.TransactionClient;
  owner: { id: string };
  agent: { id: string };
};

/** Presentation state and event contract for organization selection. */
export type OrganizationSwitcherBlockProps = OrganizationSwitcherDTO & {
  pending: boolean;
  error: string;
  onOrganizationChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

/** Membership roles that administrators may grant through invitations. */
export type InvitableRole = Exclude<AppRole, "OWNER">;

/** Database directory row selected by the authorization domain. */
export type OrganizationMemberRecord = Prisma.MembershipGetPayload<{
  select: typeof organizationMemberSelect;
}>;

/** Serializable membership fields displayed in the organization directory. */
export type OrganizationMemberDTO = {
  id: string;
  role: AppRole;
  status: OrganizationMemberRecord["status"];
  name: string;
};
