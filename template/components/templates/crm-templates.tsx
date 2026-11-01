// Why: Templates: pure presentation for the crm pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
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
import { CrmDealStage } from "@/schemas/crmSchemas";

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
          Edit account
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Relationship notes">
          <p className="whitespace-pre-wrap">
            {account.notes ?? "No notes yet."}
          </p>
        </DashboardPanel>
        <DashboardPanel title="Company profile">
          <dl className="space-y-2">
            <dt>Industry</dt>
            <dd>{account.industry ?? "Not recorded"}</dd>
            <dt>Website</dt>
            <dd>
              {account.website && /^https?:\/\//.test(account.website) ? (
                <a className="type-link" href={account.website}>
                  {account.website}
                </a>
              ) : (
                "Not recorded"
              )}
            </dd>
            <dt>Relationship</dt>
            <dd>{account.status}</dd>
            <dt>Contacts / opportunities</dt>
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
    <DashboardLayout title="Account relationships" nav={[]} toolbar={toolbar}>
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
              {account.industry ?? "Industry not recorded"} · {account.status}
            </p>
            <p>
              {account.contactCount} contacts · {account.dealCount}{" "}
              opportunities
            </p>
            <p className="line-clamp-3 text-muted-primary">
              {account.notes ?? "No relationship notes."}
            </p>
          </article>
        ))}
      </div>
      {!accounts.length && <p>No matching accounts.</p>}
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
    <DashboardLayout title="Pipeline analysis" nav={[]}>
      <p>
        Analysis of the latest {deals.length} opportunities (maximum 100).
        Values are kept separate by currency.
      </p>
      {currencies.map((currency) => (
        <DashboardPanel key={currency} title={currency}>
          <DashboardTable
            columns={[
              { key: "stage", label: "Sales stage" },
              { key: "count", label: "Opportunities" },
              { key: "value", label: "Pipeline value" },
              { key: "weighted", label: "Probability-weighted value" },
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
      {!deals.length && <p>No opportunities available for analysis.</p>}
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
          {lead ? "Qualify or edit lead" : "Edit contact"}
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Contact profile">
          <p className="text-xl">{contact.title ?? "Job title not recorded"}</p>
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
                "No account linked"
              )}
            </p>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Relationship">
          <dl className="space-y-2">
            <dt>Status</dt>
            <dd>{contact.status}</dd>
            <dt>Relationship owner</dt>
            <dd>{contact.owner?.displayName ?? "Unassigned"}</dd>
            <dt>Added</dt>
            <dd>{contact.createdAt.slice(0, 10)}</dd>
            <dt>Last updated</dt>
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
      title={lead ? "Lead qualification" : "Contact directory"}
      nav={[]}
      toolbar={toolbar}
    >
      <p className="text-muted-primary">
        {lead
          ? "Review prospective customers and qualify their relationship."
          : "Find people, their accounts, and the best way to reach them."}{" "}
        Showing up to 100 contacts.
      </p>
      <DashboardTable
        columns={[
          { key: "person", label: "Person" },
          { key: "role", label: "Job title" },
          { key: "account", label: "Account" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "status", label: "Relationship" },
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
              "Independent"
            ),
            email: contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              "—"
            ),
            phone: contact.phone,
            status: contact.status,
          },
        }))}
        emptyLabel="No matching contacts."
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
      title="Lead qualification queue"
      nav={[]}
      toolbar={toolbar}
    >
      <p>
        Review new relationships, reach out, and update qualified leads to
        Active.
      </p>
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
              <p>{contact.title ?? "Role not recorded"}</p>
              <p className="text-sm text-muted-primary">
                Added {contact.createdAt.slice(0, 10)}
              </p>
            </div>
            <div>
              {contact.email ? (
                <a className="type-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : (
                <p>Email needed</p>
              )}
              <p>{contact.phone ?? "Phone not recorded"}</p>
              <p>{contact.account?.name ?? "No account linked"}</p>
            </div>
            <Link className="type-link" href={`/crm/leads/${contact.id}/edit`}>
              Review and qualify
            </Link>
          </article>
        ))}
      </div>
      {!contacts.length && <p>No leads awaiting qualification.</p>}
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
    <DashboardLayout title="Sales pipeline" nav={[]} toolbar={toolbar}>
      <p className="text-muted-primary">
        Move opportunities through qualification, proposal, negotiation, and
        close. Showing up to 100 opportunities.
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
                      <dt>Probability</dt>
                      <dd>{deal.probability}%</dd>
                      <dt>Expected close</dt>
                      <dd>
                        {deal.expectedCloseDate?.slice(0, 10) ?? "Unscheduled"}
                      </dd>
                      <dt>Owner</dt>
                      <dd>{deal.owner?.displayName ?? "Unassigned"}</dd>
                    </dl>
                    {renderControls(deal)}
                  </article>
                ))}
                {items.length === 0 && (
                  <p className="p-3 text-muted-primary">
                    No opportunities in this stage.
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
