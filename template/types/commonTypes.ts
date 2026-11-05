import type { AppRole } from "./accessTypes";

export type OrganizationDTO = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  timezone: string;
  locale: string;
  defaultCurrency: string;
  memberCount: number;
};

export type InvitationDTO = {
  id: string;
  email: string;
  role: AppRole;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  expiresAt: string;
  createdAt: string;
};

/** A new invitation and the relative link to share; the token is never stored or shown again. */
export type CreatedInvitationDTO = {
  invitation: InvitationDTO;
  path: string;
};

export type InvitationListDTO = {
  canInvite: boolean;
  invitations: InvitationDTO[];
};

/** One organization the signed-in user holds an ACTIVE membership in. */
export type OrganizationOptionDTO = {
  id: string;
  name: string;
};

export type OrganizationSwitcherDTO = {
  activeOrganizationId: string;
  organizations: OrganizationOptionDTO[];
};
