import {
  CrmAccountsToolbar,
  CrmContactsToolbar,
  CrmPipelineToolbar,
} from "@/components/blocks/crm-blocks";
import {
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import { Card } from "@/components/ui/card";
import {
  crmPresentationCopy,
  crmRemainingCopy,
  crmTemplateCopy,
} from "@/content/crm";
import type {
  CrmAccountDTO,
  CrmContactDTO,
  CrmDealSummaryDTO,
} from "@/types/crmTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the crm pages, laid out from DTOs; data and slots come from features.

export function CrmAccountDetailContentBlock({
  account,
}: {
  account: CrmAccountDTO;
}) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={crmTemplateCopy.relationshipNotes}>
          <p className="whitespace-pre-wrap">
            {account.notes ?? crmTemplateCopy.noNotes}
          </p>
        </DashboardPanel>
        <DashboardPanel title={crmTemplateCopy.companyProfile}>
          <dl className="space-y-2">
            <dt>{crmTemplateCopy.industry}</dt>
            <dd>{account.industry ?? crmTemplateCopy.notRecorded}</dd>
            <dt>{crmTemplateCopy.website}</dt>
            <dd>
              {account.website && /^https?:\/\//.test(account.website) ? (
                <a className="type-link" href={account.website}>
                  {account.website}
                </a>
              ) : (
                crmTemplateCopy.notRecorded
              )}
            </dd>
            <dt>{crmTemplateCopy.relationship}</dt>
            <dd>{account.status}</dd>
            <dt>{crmTemplateCopy.contactAndDealCounts}</dt>
            <dd>
              {account.contactCount}
              {crmPresentationCopy.divisionSeparator}
              {account.dealCount}
            </dd>
          </dl>
        </DashboardPanel>
      </div>
    </>
  );
}

export function CrmAccountsContentBlock({
  accounts,
}: {
  accounts: CrmAccountDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof CrmAccountsToolbar>;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="space-y-3 p-5">
            <Link
              className="type-title hover:underline"
              href={`/crm/accounts/${account.id}`}
            >
              {account.name}
            </Link>
            <p>
              {account.industry ?? crmTemplateCopy.unknownIndustry}
              {crmPresentationCopy.separator} {account.status}
            </p>
            <p>
              {account.contactCount} {crmTemplateCopy.contacts}
              {crmPresentationCopy.separator} {account.dealCount}{" "}
              {crmTemplateCopy.opportunities}
            </p>
            <p className="line-clamp-3 text-muted-primary">
              {account.notes ?? crmTemplateCopy.noRelationshipNotes}
            </p>
          </Card>
        ))}
      </div>
      {!accounts.length && <p>{crmTemplateCopy.noAccounts}</p>}
    </>
  );
}

export function CrmAnalyticsContentBlock({
  count,
  groups,
}: {
  count: number;
  groups: {
    currency: string;
    rows: {
      id: string;
      cells: { stage: string; count: number; value: string; weighted: string };
    }[];
  }[];
}) {
  return (
    <>
      <p>{crmTemplateCopy.analyticsDescription(count)}</p>
      {groups.map(({ currency, rows }) => (
        <DashboardPanel key={currency} title={currency}>
          <DashboardTable
            columns={[
              { key: "stage", label: crmTemplateCopy.stage },
              { key: "count", label: crmTemplateCopy.opportunityCount },
              { key: "value", label: crmTemplateCopy.pipelineValue },
              { key: "weighted", label: crmTemplateCopy.weightedValue },
            ]}
            rows={rows}
          />
        </DashboardPanel>
      ))}
      {!count && <p>{crmTemplateCopy.noAnalytics}</p>}
    </>
  );
}

export function CrmContactDetailContentBlock({
  contact,
}: {
  contact: CrmContactDTO;
  lead?: boolean;
}) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={crmTemplateCopy.contactProfile}>
          <p className="text-xl">
            {contact.title ?? crmTemplateCopy.unknownTitle}
          </p>
          <div className="mt-5 space-y-3">
            {contact.email && (
              <p>
                <a className="type-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </p>
            )}
            {contact.phone && (
              <p>
                <a className="type-link" href={`tel:${contact.phone}`}>
                  {contact.phone}
                </a>
              </p>
            )}
            <p>
              {contact.account ? (
                <Link
                  className="type-link"
                  href={`/crm/accounts/${contact.account.id}`}
                >
                  {contact.account.name}
                </Link>
              ) : (
                crmTemplateCopy.noAccount
              )}
            </p>
          </div>
        </DashboardPanel>
        <DashboardPanel title={crmTemplateCopy.relationship}>
          <dl className="space-y-2">
            <dt>{crmTemplateCopy.status}</dt>
            <dd>{contact.status}</dd>
            <dt>{crmTemplateCopy.relationshipOwner}</dt>
            <dd>{contact.owner?.displayName ?? crmTemplateCopy.unassigned}</dd>
            <dt>{crmTemplateCopy.added}</dt>
            <dd>{contact.createdAt.slice(0, 10)}</dd>
            <dt>{crmTemplateCopy.lastUpdated}</dt>
            <dd>{contact.updatedAt.slice(0, 10)}</dd>
          </dl>
        </DashboardPanel>
      </div>
    </>
  );
}

export function CrmContactsContentBlock({
  contacts,
  lead = false,
}: {
  contacts: CrmContactDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof CrmContactsToolbar>;
  lead?: boolean;
}) {
  return (
    <>
      <p className="text-muted-primary">
        {lead
          ? crmTemplateCopy.leadDirectoryDescription
          : crmTemplateCopy.contactDirectoryDescription}{" "}
        {crmTemplateCopy.contactLimit}
      </p>
      <DashboardTable
        columns={[
          { key: "person", label: crmTemplateCopy.person },
          { key: "role", label: crmTemplateCopy.jobTitle },
          { key: "account", label: crmTemplateCopy.account },
          { key: "email", label: crmTemplateCopy.email },
          { key: "phone", label: crmTemplateCopy.phone },
          { key: "status", label: crmTemplateCopy.relationship },
        ]}
        rows={contacts.map((contact) => ({
          id: contact.id,
          href: `/crm/${lead ? crmPresentationCopy.leads : crmPresentationCopy.contacts}/${contact.id}`,
          cells: {
            person: `${contact.firstName} ${contact.lastName}`,
            role: contact.title,
            account: contact.account ? (
              <Link href={`/crm/accounts/${contact.account.id}`}>
                {contact.account.name}
              </Link>
            ) : (
              crmTemplateCopy.independent
            ),
            email: contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              crmTemplateCopy.emptyValue
            ),
            phone: contact.phone,
            status: contact.status,
          },
        }))}
        emptyLabel={crmTemplateCopy.noContacts}
      />
    </>
  );
}

export function CrmLeadDetailPageBlock({
  contact,
}: {
  contact: CrmContactDTO;
}) {
  return <CrmContactDetailContentBlock contact={contact} lead />;
}

export function CrmLeadsContentBlock({
  contacts,
}: {
  contacts: CrmContactDTO[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof CrmContactsToolbar>;
  lead?: boolean;
}) {
  return (
    <>
      <p>{crmTemplateCopy.leadQueueDescription}</p>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <Link
                className="type-label hover:underline"
                href={`/crm/leads/${contact.id}`}
              >
                {contact.firstName} {contact.lastName}
              </Link>
              <p>{contact.title ?? crmTemplateCopy.unknownRole}</p>
              <p className="text-sm text-muted-primary">
                {crmTemplateCopy.added} {contact.createdAt.slice(0, 10)}
              </p>
            </div>
            <div>
              {contact.email ? (
                <a className="type-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : (
                <p>{crmTemplateCopy.emailNeeded}</p>
              )}
              <p>{contact.phone ?? crmTemplateCopy.unknownPhone}</p>
              <p>{contact.account?.name ?? crmTemplateCopy.noAccount}</p>
            </div>
            <Link className="type-link" href={`/crm/leads/${contact.id}/edit`}>
              {crmTemplateCopy.qualify}
            </Link>
          </Card>
        ))}
      </div>
      {!contacts.length && <p>{crmTemplateCopy.noLeads}</p>}
    </>
  );
}

export function CrmPipelineContentBlock({
  stages,
  renderControls,
}: {
  stages: readonly { stage: string; items: readonly CrmDealSummaryDTO[] }[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof CrmPipelineToolbar>;
  renderControls: (deal: CrmDealSummaryDTO) => ReactNode;
}) {
  return (
    <>
      <p className="text-muted-primary">
        {crmTemplateCopy.pipelineDescription}
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map(({ stage, items }) => {
          return (
            <DashboardPanel
              key={stage}
              title={crmRemainingCopy.nameAndDetail(
                stage.replaceAll("_", " "),
                items.length,
              )}
            >
              <div className="space-y-3">
                {items.map((deal) => (
                  <Card variant="inset" key={deal.id} className="space-y-3 p-4">
                    <h3 className="type-label">{deal.name}</h3>
                    <Link
                      className="type-link"
                      href={`/crm/accounts/${deal.account.id}`}
                    >
                      {deal.account.name}
                    </Link>
                    <p className="text-xl">
                      {deal.value} {deal.currency}
                    </p>
                    <dl className="text-sm">
                      <dt>{crmTemplateCopy.probability}</dt>
                      <dd>
                        {deal.probability}
                        {crmPresentationCopy.sentenceSeparator}
                      </dd>
                      <dt>{crmTemplateCopy.expectedClose}</dt>
                      <dd>
                        {deal.expectedCloseDate?.slice(0, 10) ??
                          crmTemplateCopy.unscheduled}
                      </dd>
                      <dt>{crmTemplateCopy.owner}</dt>
                      <dd>
                        {deal.owner?.displayName ?? crmTemplateCopy.unassigned}
                      </dd>
                    </dl>
                    {renderControls(deal)}
                  </Card>
                ))}
                {items.length === 0 && (
                  <p className="p-3 text-muted-primary">
                    {crmTemplateCopy.noDealsInStage}
                  </p>
                )}
              </div>
            </DashboardPanel>
          );
        })}
      </div>
    </>
  );
}

export function CrmAccountDetailToolbarBlock(
  props: ComponentProps<typeof CrmAccountDetailContentBlock>,
) {
  const { account } = props;
  return (
    <Link className="type-link" href={`/crm/accounts/${account.id}/edit`}>
      {crmTemplateCopy.editAccount}
    </Link>
  );
}
export function CrmAccountsToolbarBlock(
  props: ComponentProps<typeof CrmAccountsContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <CrmAccountsToolbar {...toolbarProps} /> : toolbarSlot;
}
export function CrmContactDetailToolbarBlock(
  props: ComponentProps<typeof CrmContactDetailContentBlock>,
) {
  const { contact, lead = false } = props;
  return (
    <Link
      className="type-link"
      href={`/crm/${lead ? crmPresentationCopy.leads : crmPresentationCopy.contacts}/${contact.id}/edit`}
    >
      {lead ? crmTemplateCopy.editLead : crmTemplateCopy.editContact}
    </Link>
  );
}
export function CrmContactsToolbarBlock(
  props: ComponentProps<typeof CrmContactsContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <CrmContactsToolbar {...toolbarProps} /> : toolbarSlot;
}
export function CrmLeadsToolbarBlock(
  props: ComponentProps<typeof CrmLeadsContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <CrmContactsToolbar {...toolbarProps} /> : toolbarSlot;
}
export function CrmPipelineToolbarBlock(
  props: ComponentProps<typeof CrmPipelineContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <CrmPipelineToolbar {...toolbarProps} /> : toolbarSlot;
}
