import type { ComponentProps, ReactNode } from "react";

import {
  CrmAccountDetailContentBlock,
  CrmAccountDetailToolbarBlock,
  CrmAccountFormBlock,
  CrmAccountsContentBlock,
  CrmAccountsToolbarBlock,
  CrmAnalyticsContentBlock,
  CrmContactDetailContentBlock,
  CrmContactDetailToolbarBlock,
  CrmContactFormBlock,
  CrmContactsContentBlock,
  CrmContactsToolbarBlock,
  CrmDealStageFormBlock,
  CrmLeadDetailPageBlock,
  CrmLeadsContentBlock,
  CrmLeadsToolbarBlock,
  CrmOpportunityFormBlock,
  CrmPageBlock,
  CrmPipelineContentBlock,
  CrmPipelineToolbarBlock,
} from "@/components/blocks/crm-blocks";

// -----------------------------------------------------------------------------
// CRM tenant route templates: composition only, no copy or UI primitives.
// -----------------------------------------------------------------------------

/** Arrange one account detail page inside its existing tenant shell. */
export function CrmAccountDetailTemplate(
  props: ComponentProps<typeof CrmAccountDetailContentBlock>,
) {
  return (
    <CrmPageBlock section="detail" account={props.account}
      toolbar={<CrmAccountDetailToolbarBlock {...props} />}>
      <CrmAccountDetailContentBlock {...props} />
    </CrmPageBlock>
  );
}

/** Arrange the account directory and its independent interaction slots. */
export function CrmAccountsTemplate({
  pagination,
  ...props
}: ComponentProps<typeof CrmAccountsContentBlock> & { pagination?: ReactNode | undefined }) {
  return (
    <CrmPageBlock section="accounts" toolbar={<CrmAccountsToolbarBlock {...props} />}>
      <CrmAccountsContentBlock {...props} />
      {pagination}
    </CrmPageBlock>
  );
}

/** Arrange the accurate tenant-scoped currency analytics. */
export function CrmAnalyticsTemplate(
  props: ComponentProps<typeof CrmAnalyticsContentBlock>,
) {
  return (
    <CrmPageBlock section="analytics">
      <CrmAnalyticsContentBlock {...props} />
    </CrmPageBlock>
  );
}

/** Arrange a contact detail record. */
export function CrmContactDetailTemplate(
  props: ComponentProps<typeof CrmContactDetailContentBlock>,
) {
  return (
    <CrmPageBlock section="detail" contact={props.contact}
      toolbar={<CrmContactDetailToolbarBlock {...props} />}>
      <CrmContactDetailContentBlock {...props} />
    </CrmPageBlock>
  );
}

/** Arrange a contact directory with its client interaction slot. */
export function CrmContactsTemplate({
  pagination,
  ...props
}: ComponentProps<typeof CrmContactsContentBlock> & { pagination?: ReactNode | undefined }) {
  return (
    <CrmPageBlock section="contacts" toolbar={<CrmContactsToolbarBlock {...props} />}>
      <CrmContactsContentBlock {...props} />
      {pagination}
    </CrmPageBlock>
  );
}

/** Arrange the lead detail page without sharing presentation components. */
export function CrmLeadDetailTemplate(
  props: ComponentProps<typeof CrmLeadDetailPageBlock>,
) {
  return (
    <CrmPageBlock section="detail" contact={props.contact}
      toolbar={<CrmContactDetailToolbarBlock {...props} lead />}>
      <CrmLeadDetailPageBlock {...props} />
    </CrmPageBlock>
  );
}

/** Arrange the lead queue with CRM-owned filtering and paging. */
export function CrmLeadsTemplate({
  pagination,
  ...props
}: ComponentProps<typeof CrmLeadsContentBlock> & { pagination?: ReactNode | undefined }) {
  return (
    <CrmPageBlock section="leads" toolbar={<CrmLeadsToolbarBlock {...props} />}>
      <CrmLeadsContentBlock {...props} />
      {pagination}
    </CrmPageBlock>
  );
}

/** Arrange a stage-grouped pipeline and its independent RHF forms. */
export function CrmPipelineTemplate({
  creationControl,
  pagination,
  ...props
}: ComponentProps<typeof CrmPipelineContentBlock> & {
  creationControl?: ReactNode | undefined;
  pagination?: ReactNode | undefined;
}) {
  return (
    <CrmPageBlock section="pipeline" toolbar={<CrmPipelineToolbarBlock {...props} />}>
      {creationControl}
      <CrmPipelineContentBlock {...props} />
      {pagination}
    </CrmPageBlock>
  );
}

// -----------------------------------------------------------------------------
// CRM RHF templates: delegate all rendered markup to named CRM blocks.
// -----------------------------------------------------------------------------

/** Compose the account form block from prepared RHF controllers. */
export function CrmAccountFormTemplate(props: ComponentProps<typeof CrmAccountFormBlock>) {
  return <CrmAccountFormBlock {...props} />;
}

/** Compose the contact/lead form block from prepared RHF controllers. */
export function CrmContactFormTemplate(props: ComponentProps<typeof CrmContactFormBlock>) {
  return <CrmContactFormBlock {...props} />;
}

/** Compose the opportunity form block from prepared RHF controllers. */
export function CrmOpportunityFormTemplate(props: ComponentProps<typeof CrmOpportunityFormBlock>) {
  return <CrmOpportunityFormBlock {...props} />;
}

/** Compose the deal stage editor block from prepared RHF controllers. */
export function CrmDealStageFormTemplate(props: ComponentProps<typeof CrmDealStageFormBlock>) {
  return <CrmDealStageFormBlock {...props} />;
}
