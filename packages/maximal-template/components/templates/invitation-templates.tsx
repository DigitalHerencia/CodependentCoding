import {
  InvitationAcceptanceBlock,
  InvitationCreateBlock,
  InvitationLoadingBlock,
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

export function InvitationLoadingTemplate() {
  return <InvitationLoadingBlock />;
}
