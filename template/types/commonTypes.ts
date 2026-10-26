import type { AppRole } from "./accessTypes";

export interface OrganizationDTO {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  timezone: string;
  locale: string;
  defaultCurrency: string;
  memberCount: number;
}

export interface InvitationDTO {
  id: string;
  email: string;
  role: AppRole;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  expiresAt: string;
  createdAt: string;
}

/** A new invitation and the relative link to share; the token is never stored or shown again. */
export interface CreatedInvitationDTO {
  invitation: InvitationDTO;
  path: string;
}

export interface InvitationListDTO {
  canInvite: boolean;
  invitations: InvitationDTO[];
}
