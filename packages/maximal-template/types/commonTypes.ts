export type {
  InvitationDTO,
  CreatedInvitationDTO,
  InvitationListDTO,
} from "@/types/invitationTypes";

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

/** One organization the signed-in user holds an ACTIVE membership in. */
export type OrganizationOptionDTO = {
  id: string;
  name: string;
};

export type OrganizationSwitcherDTO = {
  activeOrganizationId: string;
  organizations: OrganizationOptionDTO[];
};
