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
} from "@/components/blocks/crm-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { CrmFormSubmitBlock } from "@/components/blocks/crm-blocks";
import type { ReactNode, FormEventHandler } from "react";
import { accountFormCopy, contactFormCopy, crmControlCopy } from "@/content/crm";
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
export function CrmPipelineTemplate({
  creationControl,
  ...props
}: ComponentProps<typeof CrmPipelineContentBlock> & { creationControl?: ReactNode }) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.pipeline}
      nav={[]}
      toolbar={<CrmPipelineToolbarBlock {...props} />}
    >
      {creationControl}
      <CrmPipelineContentBlock {...props} />
    </DashboardLayout>
  );
}

// -----------------------------------------------------------------------------
// CRM form templates: arrange prepared fields and controls, never own RHF state.
// -----------------------------------------------------------------------------
/** Account create/edit form layout. */
export function CrmAccountFormTemplate({ edit, fields, onSubmit, error, pending }: {
  edit: boolean; fields: ReactNode; onSubmit: FormEventHandler<HTMLFormElement>; error?: string; pending: boolean;
}) {
  return (
    <form className="mx-auto max-w-3xl space-y-5 surface-card p-5" noValidate onSubmit={onSubmit}>
      <h1 className="type-title">{edit ? accountFormCopy.edit : accountFormCopy.create}</h1>
      <div className="grid gap-4">{fields}</div>
      <CrmFormSubmitBlock label={accountFormCopy.save} pendingLabel={accountFormCopy.saving} pending={pending} error={error} />
    </form>
  );
}

/** Contact/lead create/edit form layout. */
export function CrmContactFormTemplate({ edit, lead, fields, onSubmit, error, pending }: {
  edit: boolean; lead: boolean; fields: ReactNode; onSubmit: FormEventHandler<HTMLFormElement>; error?: string; pending: boolean;
}) {
  return (
    <form className="mx-auto max-w-3xl space-y-5 surface-card p-5" noValidate onSubmit={onSubmit}>
      <h1 className="type-title">{edit ? contactFormCopy.edit : contactFormCopy.create} {lead ? contactFormCopy.lead : contactFormCopy.contact}</h1>
      <div className="grid gap-4 sm:grid-cols-2">{fields}</div>
      <CrmFormSubmitBlock label={contactFormCopy.save} pendingLabel={contactFormCopy.saving} pending={pending} error={error} />
    </form>
  );
}

/** Opportunity creation presentation; all application state remains in RHF. */
export function CrmOpportunityFormTemplate({ fields, onSubmit, error, pending, disabled, status }: {
  fields: ReactNode; onSubmit: FormEventHandler<HTMLFormElement>; error?: string; pending: boolean; disabled: boolean; status: string;
}) {
  return (
    <details className="surface-card p-4">
      <summary>{crmControlCopy.createOpportunity}</summary>
      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        <h2 className="type-title">{crmControlCopy.createOpportunity}</h2>
        {fields}
        <CrmFormSubmitBlock label={crmControlCopy.createOpportunity} pending={pending} disabled={disabled} error={error} status={status} />
      </form>
    </details>
  );
}

/** Opportunity stage editor presentation. */
export function CrmDealStageFormTemplate({ fields, onSubmit, error, pending, status }: {
  fields: ReactNode; onSubmit: FormEventHandler<HTMLFormElement>; error?: string; pending: boolean; status: string;
}) {
  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      {fields}
      <CrmFormSubmitBlock label={crmControlCopy.moveOpportunity} pending={pending} error={error} status={status} />
    </form>
  );
}
