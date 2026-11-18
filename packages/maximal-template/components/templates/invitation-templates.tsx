/** Invitation templates contracts and composition for the owning application slice. */
import type { ComponentProps } from "react";
import {
  InvitationAcceptanceBlock,
  InvitationCreateBlock,
  InvitationEmailFieldBlock,
  InvitationRoleFieldBlock,
  InvitationsBlock,
} from "@/components/blocks/invitation-blocks";
import type {
  InvitationCreateProps,
  InvitationFormProps,
  InvitationListProps,
} from "@/types/invitationTypes";

export function InvitationCreateTemplate(props: InvitationCreateProps) {
  return <InvitationCreateBlock {...props} />;
}

export function InvitationAcceptanceTemplate(props: InvitationFormProps) {
  return <InvitationAcceptanceBlock {...props} />;
}

export function InvitationsTemplate(props: InvitationListProps) {
  return <InvitationsBlock {...props} />;
}

export function InvitationEmailFieldTemplate(
  props: ComponentProps<typeof InvitationEmailFieldBlock>,
) {
  return <InvitationEmailFieldBlock {...props} />;
}
export function InvitationRoleFieldTemplate(
  props: ComponentProps<typeof InvitationRoleFieldBlock>,
) {
  return <InvitationRoleFieldBlock {...props} />;
}
