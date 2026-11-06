import {
  CrmAccountDetailContentBlock,
  CrmAccountDetailToolbarBlock,
  CrmAccountsContentBlock,
  CrmAccountsToolbarBlock,
  CrmAnalyticsContentBlock,
  CrmContactDetailContentBlock,
  CrmContactDetailToolbarBlock,
  CrmContactsContentBlock,
  CrmContactsToolbarBlock,
  CrmLeadDetailPageBlock,
  CrmLeadsContentBlock,
  CrmLeadsToolbarBlock,
  CrmPipelineContentBlock,
  CrmPipelineToolbarBlock,
} from "@/components/blocks/crm-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { crmRemainingCopy, crmTemplateCopy } from "@/content/crm";
import type { ComponentProps } from "react";

export function CrmAccountDetailTemplate(
  props: ComponentProps<typeof CrmAccountDetailContentBlock>,
) {
  const { account } = props;
  return (
    <DashboardLayout
      title={account.name}
      nav={[]}
      toolbar={<CrmAccountDetailToolbarBlock {...props} />}
    >
      <CrmAccountDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmAccountsTemplate(
  props: ComponentProps<typeof CrmAccountsContentBlock>,
) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.accounts}
      nav={[]}
      toolbar={<CrmAccountsToolbarBlock {...props} />}
    >
      <CrmAccountsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmAnalyticsTemplate(
  props: ComponentProps<typeof CrmAnalyticsContentBlock>,
) {
  return (
    <DashboardLayout title={crmTemplateCopy.analytics} nav={[]}>
      <CrmAnalyticsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmContactDetailTemplate(
  props: ComponentProps<typeof CrmContactDetailContentBlock>,
) {
  const { contact } = props;
  return (
    <DashboardLayout
      title={crmRemainingCopy.personName(contact.firstName, contact.lastName)}
      nav={[]}
      toolbar={<CrmContactDetailToolbarBlock {...props} />}
    >
      <CrmContactDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmContactsTemplate(
  props: ComponentProps<typeof CrmContactsContentBlock>,
) {
  const { lead = false } = props;
  return (
    <DashboardLayout
      title={
        lead
          ? crmTemplateCopy.leadQualification
          : crmTemplateCopy.contactDirectory
      }
      nav={[]}
      toolbar={<CrmContactsToolbarBlock {...props} />}
    >
      <CrmContactsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmLeadDetailTemplate(
  props: ComponentProps<typeof CrmLeadDetailPageBlock>,
) {
  return (
    <DashboardLayout
      title={crmRemainingCopy.personName(
        props.contact.firstName,
        props.contact.lastName,
      )}
      nav={[]}
      toolbar={<CrmContactDetailToolbarBlock {...props} lead />}
    >
      <CrmLeadDetailPageBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmLeadsTemplate(
  props: ComponentProps<typeof CrmLeadsContentBlock>,
) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.leadQueue}
      nav={[]}
      toolbar={<CrmLeadsToolbarBlock {...props} />}
    >
      <CrmLeadsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function CrmPipelineTemplate(
  props: ComponentProps<typeof CrmPipelineContentBlock>,
) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.pipeline}
      nav={[]}
      toolbar={<CrmPipelineToolbarBlock {...props} />}
    >
      <CrmPipelineContentBlock {...props} />
    </DashboardLayout>
  );
}
