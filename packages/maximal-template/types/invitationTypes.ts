/** Invitation Types contracts and composition for the owning application slice. */
import type { AppRole } from "@/types/authzTypes";
import type { ComponentProps, ReactNode } from "react";
import type { Prisma } from "@/generated/prisma/client";
import type { z } from "zod";
import type { UseFormRegisterReturn } from "react-hook-form";
import type {
  acceptInvitationSchema,
  createInvitationSchema,
  editInvitationSchema,
} from "@/schemas/invitationSchemas";
import type { invitationSelect } from "@/lib/db/selects/invitationSelects";

/** Invitation slice contract. */
export type InvitationFormProps = {
  onSubmit: ComponentProps<"form">["onSubmit"];
  busy: boolean;
  failure?: "invalid" | "failed" | undefined;
  error?: string | undefined;
};

/** Invitation slice contract. */
export type InvitationCreateProps = InvitationFormProps & {
  children?: ReactNode;
  link?: string;
  editing?: boolean;
  emailField: UseFormRegisterReturn<"email"> & { id: string };
  roleField: UseFormRegisterReturn<"role"> & { id: string };
  emailError?: string | undefined;
  roleError?: string | undefined;
  roles: readonly AppRole[];
  onCancel?: (() => void) | undefined;
};

/** Invitation slice contract. */
export type InvitationListProps = {
  invitations: InvitationDTO[];
  pending: boolean;
  error: string;
  onRevoke?: ((id: string) => void | Promise<void>) | undefined;
  onEdit?: ((invitation: InvitationDTO) => void) | undefined;
};

/** Invitation slice contract. */
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

/** Pending invitation rows and individually authorized administrative capabilities. */
export type InvitationListDTO = {
  canInvite: boolean;
  canEdit: boolean;
  canRevoke: boolean;
  organizationId: string | null;
  invitations: InvitationDTO[];
};

/** Browser input accepted by the new invitation form. */
export type InvitationCreateInput = z.input<typeof createInvitationSchema>;
/** Validated new invitation command. */
export type InvitationCreateValues = z.output<typeof createInvitationSchema>;
/** Browser input accepted by the edit invitation form. */
export type InvitationEditInput = z.input<typeof editInvitationSchema>;
/** Validated pending invitation update. */
export type InvitationEditValues = z.output<typeof editInvitationSchema>;
/** Token retained exclusively in the acceptance form state. */
export type InvitationAcceptanceInput = z.input<typeof acceptInvitationSchema>;
/** Acceptance route parameters. */
export type InvitationAcceptanceProps = { token: string };
/** Async acceptance route parameters. */
export type InvitationAcceptanceRouteProps = {
  params: Promise<{ token: string }>;
};
/** Server-projected rows and affordances for the invitation client feature. */
export type InvitationsFeatureProps = Pick<
  InvitationListDTO,
  "invitations" | "canEdit" | "canRevoke"
>;
/** Props for editing one pending invitation. */
export type InvitationEditFormProps = {
  invitation: InvitationDTO;
  onComplete: () => void;
};
/** Email primitive binding owned by a React Hook Form feature. */
export type InvitationEmailFieldProps = ComponentProps<"input"> & {
  error?: string | undefined;
};
/** Role primitive binding owned by a React Hook Form feature. */
export type InvitationRoleFieldProps = ComponentProps<"select"> & {
  error?: string | undefined;
  roles: readonly AppRole[];
};
/** Selected database invitation row, without its token hash. */
export type InvitationRecord = Prisma.InvitationGetPayload<{
  select: typeof invitationSelect;
}>;
/** Tenant and actor scope used by atomic invitation administration. */
export type InvitationAdministrationScope = {
  organizationId: string;
  actorUserId: string;
};
/** Immutable snapshot checked again when accepting an invitation. */
export type InvitationAcceptanceRecord = {
  id: string;
  organizationId: string;
  role: AppRole;
  email?: string;
  createdAt?: Date;
};
/** Accepted membership identifiers returned to provisioning. */
export type InvitationAcceptanceResult = {
  membershipId: string;
  organizationId: string;
};

/** Identifier returned after canceling one invitation. */
export type InvitationIdentifier = { id: string };
/** Organization selected by successful invitation acceptance. */
export type InvitationOrganization = { organizationId: string };
