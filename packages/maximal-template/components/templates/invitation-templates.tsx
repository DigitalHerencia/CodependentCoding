/** Invitation presentation composition; workflows and RHF state belong to features. */
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

/** Compose the full invitation create or edit form from block primitives. */
export function InvitationCreateTemplate(props: InvitationCreateProps) {
  return (
    <InvitationCreateBlock {...props}>
      <InvitationEmailFieldBlock
        {...props.emailField}
        error={props.emailError}
      />
      <InvitationRoleFieldBlock
        {...props.roleField}
        roles={props.roles}
        error={props.roleError}
      />
    </InvitationCreateBlock>
  );
}

/** Compose the invitation acceptance route presentation. */
export function InvitationAcceptanceTemplate(props: InvitationFormProps) {
  return <InvitationAcceptanceBlock {...props} />;
}

/** Compose the pending invitation administration presentation. */
export function InvitationsTemplate(props: InvitationListProps) {
  return <InvitationsBlock {...props} />;
}
