import type { AppRole } from "@/types/accessTypes";
import type { ComponentProps, ReactNode } from "react";

export type InvitationFormProps = {
  onSubmit: ComponentProps<"form">["onSubmit"];
  busy: boolean;
  error?: string | undefined;
};

export type InvitationCreateProps = InvitationFormProps & {
  children: ReactNode;
  link: string;
};

export type InvitationListProps = {
  invitations: InvitationDTO[];
  pending: boolean;
  error: string;
  onRevoke: (id: string) => void | Promise<void>;
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
