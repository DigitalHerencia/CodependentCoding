// Why: Templates: pure presentation for the crm pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
import { crmTemplateCopy } from "@/content/crm";
import type {
  CrmAccountDTO,
  CrmDealSummaryDTO,
  CrmContactDTO,
} from "@/types/crmTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
import type { ReactNode } from "react";
import { CrmDealStage } from "@/schema/crmSchemas";

export function CrmAccountDetailTemplate({
  account,
}: {
  account: CrmAccountDTO;
}) {
  return (
    <DashboardLayout
      title={account.name}
      nav={[]}
      toolbar={
        <Link className="type-link" href={`/crm/accounts/${account.id}/edit`}>
          {crmTemplateCopy.editAccount}
        </Link>
      }
    >
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
              {account.contactCount} / {account.dealCount}
            </dd>
          </dl>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}

export function CrmAccountsTemplate({
  accounts,
  toolbar,
}: {
  accounts: CrmAccountDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.accounts}
      nav={[]}
      toolbar={toolbar}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <article key={account.id} className="space-y-3 surface-card p-5">
            <Link
              className="type-title hover:underline"
              href={`/crm/accounts/${account.id}`}
            >
              {account.name}
            </Link>
            <p>
              {account.industry ?? crmTemplateCopy.unknownIndustry} ·{" "}
              {account.status}
            </p>
            <p>
              {account.contactCount} {crmTemplateCopy.contacts} ·{" "}
              {account.dealCount} {crmTemplateCopy.opportunities}
            </p>
            <p className="line-clamp-3 text-muted-primary">
              {account.notes ?? crmTemplateCopy.noRelationshipNotes}
            </p>
          </article>
        ))}
      </div>
      {!accounts.length && <p>{crmTemplateCopy.noAccounts}</p>}
    </DashboardLayout>
  );
}

export function CrmAnalyticsTemplate({
  deals,
}: {
  deals: CrmDealSummaryDTO[];
}) {
  const currencies = [...new Set(deals.map((deal) => deal.currency))];
  return (
    <DashboardLayout title={crmTemplateCopy.analytics} nav={[]}>
      <p>{crmTemplateCopy.analyticsDescription(deals.length)}</p>
      {currencies.map((currency) => (
        <DashboardPanel key={currency} title={currency}>
          <DashboardTable
            columns={[
              { key: "stage", label: crmTemplateCopy.stage },
              { key: "count", label: crmTemplateCopy.opportunityCount },
              { key: "value", label: crmTemplateCopy.pipelineValue },
              { key: "weighted", label: crmTemplateCopy.weightedValue },
            ]}
            rows={[
              "LEAD",
              "QUALIFIED",
              "PROPOSAL",
              "NEGOTIATION",
              "WON",
              "LOST",
            ].map((stage) => {
              const group = deals.filter(
                (deal) => deal.currency === currency && deal.stage === stage,
              );
              return {
                id: stage,
                cells: {
                  stage,
                  count: group.length,
                  value: group
                    .reduce((sum, deal) => sum + Number(deal.value), 0)
                    .toFixed(2),
                  weighted: group
                    .reduce(
                      (sum, deal) =>
                        sum + (Number(deal.value) * deal.probability) / 100,
                      0,
                    )
                    .toFixed(2),
                },
              };
            })}
          />
        </DashboardPanel>
      ))}
      {!deals.length && <p>{crmTemplateCopy.noAnalytics}</p>}
    </DashboardLayout>
  );
}

export function CrmContactDetailTemplate({
  contact,
  lead = false,
}: {
  contact: CrmContactDTO;
  lead?: boolean;
}) {
  return (
    <DashboardLayout
      title={`${contact.firstName} ${contact.lastName}`}
      nav={[]}
      toolbar={
        <Link
          className="type-link"
          href={`/crm/${lead ? "leads" : "contacts"}/${contact.id}/edit`}
        >
          {lead ? crmTemplateCopy.editLead : crmTemplateCopy.editContact}
        </Link>
      }
    >
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
    </DashboardLayout>
  );
}

export function CrmContactsTemplate({
  contacts,
  toolbar,
  lead = false,
}: {
  contacts: CrmContactDTO[];
  toolbar: ReactNode;
  lead?: boolean;
}) {
  return (
    <DashboardLayout
      title={
        lead
          ? crmTemplateCopy.leadQualification
          : crmTemplateCopy.contactDirectory
      }
      nav={[]}
      toolbar={toolbar}
    >
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
          href: `/crm/${lead ? "leads" : "contacts"}/${contact.id}`,
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
    </DashboardLayout>
  );
}

export function CrmLeadDetailTemplate({ contact }: { contact: CrmContactDTO }) {
  return <CrmContactDetailTemplate contact={contact} lead />;
}

export function CrmLeadsTemplate({
  contacts,
  toolbar,
}: {
  contacts: CrmContactDTO[];
  toolbar: ReactNode;
  lead?: boolean;
}) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.leadQueue}
      nav={[]}
      toolbar={toolbar}
    >
      <p>{crmTemplateCopy.leadQueueDescription}</p>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <article
            key={contact.id}
            className="grid gap-4 surface-card p-5 md:grid-cols-[1fr_1fr_auto]"
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
          </article>
        ))}
      </div>
      {!contacts.length && <p>{crmTemplateCopy.noLeads}</p>}
    </DashboardLayout>
  );
}

export function CrmPipelineTemplate({
  deals,
  toolbar,
  renderControls,
}: {
  deals: readonly CrmDealSummaryDTO[];
  toolbar: ReactNode;
  renderControls: (deal: CrmDealSummaryDTO) => ReactNode;
}) {
  return (
    <DashboardLayout
      title={crmTemplateCopy.pipeline}
      nav={[]}
      toolbar={toolbar}
    >
      <p className="text-muted-primary">
        {crmTemplateCopy.pipelineDescription}
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.values(CrmDealStage).map((stage) => {
          const items = deals.filter((deal) => deal.stage === stage);
          return (
            <DashboardPanel
              key={stage}
              title={`${stage.replaceAll("_", " ")} · ${items.length}`}
            >
              <div className="space-y-3">
                {items.map((deal) => (
                  <article
                    key={deal.id}
                    className="space-y-3 surface-inset p-4"
                  >
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
                      <dd>{deal.probability}%</dd>
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
                  </article>
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
    </DashboardLayout>
  );
}
