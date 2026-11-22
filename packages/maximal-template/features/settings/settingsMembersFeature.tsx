import { SettingsMembersTemplate } from "@/components/templates/settings-templates";
import { InvitationsFeatureClient } from "@/features/invitations/invitationsFeatureClient";
import { InvitationsNewMemberForm } from "@/features/invitations/invitationsNewMemberForm";
import { loadMembersWorkflow } from "@/lib/workflows/settingsWorkflows";
import type { SettingsMembersFeatureProps } from "@/types/settingsTypes";
import { Fragment } from "react";

/** Compose authorized directory data with invitation-owned forms and controls. */
export async function SettingsMembersFeature({
  criteria,
}: SettingsMembersFeatureProps) {
  const view = await loadMembersWorkflow(await criteria);
  const { pending } = view;
  return (
    <SettingsMembersTemplate
      members={view.members}
      page={view.page}
      hasNextPage={view.hasNextPage}
      invitations={
        pending.canInvite ? (
          <Fragment key={pending.organizationId}>
            <InvitationsFeatureClient
              invitations={pending.invitations}
              canEdit={pending.canEdit}
              canRevoke={pending.canRevoke}
            />
            <InvitationsNewMemberForm />
          </Fragment>
        ) : null
      }
    />
  );
}
