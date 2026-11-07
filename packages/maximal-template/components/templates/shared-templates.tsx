import {
  InvitationsBlock,
  OrganizationSwitcherBlock,
} from "@/components/blocks/settings-blocks";
import {
  DashboardLayout,
  WorkspaceLoadingState,
  FormLoadingState,
  PageLoadingState,
} from "@/components/blocks/shared-blocks";
import {
  SharedDashboardContentBlock,
  SharedIntegrationsContentBlock,
  SharedMembersContentBlock,
  SharedOnboardingPageBlock,
  SharedProfileSettingsContentBlock,
} from "@/components/blocks/shared-page-blocks";
import { sharedPresentationCopy } from "@/content/shared";
import type { ComponentProps } from "react";
import { GenericErrorPage } from "@/components/blocks/shared-blocks.client";

export function SharedDashboardTemplate(
  props: ComponentProps<typeof SharedDashboardContentBlock>,
) {
  const { organization } = props;
  return (
    <DashboardLayout title={organization.name} nav={[]}>
      <SharedDashboardContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SharedIntegrationsTemplate(
  props: ComponentProps<typeof SharedIntegrationsContentBlock>,
) {
  return (
    <DashboardLayout
      title={sharedPresentationCopy.integrationConfiguration}
      nav={[]}
    >
      <SharedIntegrationsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SharedMembersTemplate(
  props: ComponentProps<typeof SharedMembersContentBlock>,
) {
  return (
    <DashboardLayout title={sharedPresentationCopy.workspaceDirectory} nav={[]}>
      <SharedMembersContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SharedOnboardingTemplate(
  props: ComponentProps<typeof SharedOnboardingPageBlock>,
) {
  return <SharedOnboardingPageBlock {...props} />;
}
export function SharedProfileSettingsTemplate(
  props: ComponentProps<typeof SharedProfileSettingsContentBlock>,
) {
  return (
    <DashboardLayout title={sharedPresentationCopy.workspaceSettings} nav={[]}>
      <SharedProfileSettingsContentBlock {...props} />
    </DashboardLayout>
  );
}

export function InvitationsTemplate(
  props: ComponentProps<typeof InvitationsBlock>,
) {
  return <InvitationsBlock {...props} />;
}

export function OrganizationSwitcherTemplate(
  props: ComponentProps<typeof OrganizationSwitcherBlock>,
) {
  return <OrganizationSwitcherBlock {...props} />;
}

export function WorkspaceLoadingTemplate(
  props: ComponentProps<typeof WorkspaceLoadingState>,
) {
  return <WorkspaceLoadingState {...props} />;
}
export function FormLoadingTemplate(
  props: ComponentProps<typeof FormLoadingState>,
) {
  return <FormLoadingState {...props} />;
}
export function PageLoadingTemplate(
  props: ComponentProps<typeof PageLoadingState>,
) {
  return <PageLoadingState {...props} />;
}
export function GenericErrorTemplate(
  props: ComponentProps<typeof GenericErrorPage>,
) {
  return <GenericErrorPage {...props} />;
}
