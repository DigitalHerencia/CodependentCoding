import {
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { contactStatusSchema, CrmDealStage } from "@/schemas/crmSchemas";
import {
  crmPresentationCopy,
  crmBlockCopy,
  crmControlCopy,
  crmRemainingCopy,
  accountFormCopy,
  contactFormCopy,
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
export function CrmAccountsToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
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
export function CrmContactsToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}
export function CrmLeadsToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}
export function CrmPipelineToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}

// -----------------------------------------------------------------------------
// Interactive CRM search controls: composed primitives, no local state.
// -----------------------------------------------------------------------------
export function CrmAccountsToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={crmBlockCopy.searchAccounts}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={crmBlockCopy.searchCompanyOrIndustry}
      />
      <Link className="type-link" href="/crm/accounts/new">
        {crmBlockCopy.newAccount}
      </Link>
    </div>
  );
}
export function CrmContactsToolbar({
  query,
  onQueryChange,
  lead,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  lead: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={crmBlockCopy.searchContacts}
        placeholder={crmBlockCopy.searchPersonEmailOrAccount}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Link
        className="type-link"
        href={`/crm/${lead ? crmPresentationCopy.leads : crmPresentationCopy.contacts}/new`}
      >
        {crmBlockCopy.add}
        {lead ? crmBlockCopy.lead : crmBlockCopy.contact}
      </Link>
    </div>
  );
}

export function CrmPipelineToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <Input
      aria-label={crmPresentationCopy.searchOpportunitiesAndAccounts}
      placeholder={crmPresentationCopy.searchOpportunitiesOrAccounts}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}


// -----------------------------------------------------------------------------
// CRM form field blocks: presentation only; RHF controllers live in forms.
// -----------------------------------------------------------------------------
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

type CrmFieldBinding = Pick<ControllerRenderProps<FieldValues>, "name" | "value" | "onChange" | "onBlur" | "ref">;
type CrmFieldView = { field: CrmFieldBinding; invalid: boolean; error?: string };

/** Render one account field from its RHF controller without owning RHF state. */
export function CrmAccountFieldBlock({ name, field, invalid, error }: CrmFieldView & {
  name: "name" | "website" | "industry" | "notes";
}) {
  const inputProps = { id: name, name: field.name, onBlur: field.onBlur, onChange: field.onChange, ref: field.ref, "aria-invalid": invalid };
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={name}>{accountFormCopy.fields[name]}</FieldLabel>
      {name === "notes" ? (
        <Textarea {...inputProps} value={String(field.value ?? "")} className="control-field min-h-36" />
      ) : (
        <Input {...inputProps} value={String(field.value ?? "")} type={name === "website" ? "url" : "text"} />
      )}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/** Render one contact/lead field using current ShadCN Field components. */
export function CrmContactFieldBlock({ name, field, invalid, error }: CrmFieldView & {
  name: "firstName" | "lastName" | "email" | "phone" | "title" | "status";
}) {
  const inputProps = { id: name, name: field.name, onBlur: field.onBlur, onChange: field.onChange, ref: field.ref, "aria-invalid": invalid };
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={name}>{contactFormCopy.fields[name]}</FieldLabel>
      {name === "status" ? (
        <NativeSelect {...inputProps} value={String(field.value ?? "")} className="control-field">
          {contactStatusSchema.options.map((status) => <NativeSelectOption key={status} value={status}>{status}</NativeSelectOption>)}
        </NativeSelect>
      ) : (
        <Input {...inputProps} value={String(field.value ?? "")} type={name === "email" ? "email" : "text"} />
      )}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/** Render one opportunity input, including its typed numeric controller. */
export function CrmOpportunityFieldBlock({ name, field, invalid, error, accounts }: CrmFieldView & {
  name: "name" | "accountId" | "value" | "currency" | "probability" | "expectedCloseDate";
  accounts: CrmAccountDTO[];
}) {
  const labels = {
    name: crmControlCopy.opportunityName,
    accountId: crmControlCopy.account,
    value: crmControlCopy.opportunityValue,
    currency: crmControlCopy.currency,
    probability: crmControlCopy.probability,
    expectedCloseDate: crmControlCopy.expectedClose,
  };
  const inputProps = { id: field.name, name: field.name, onBlur: field.onBlur, onChange: field.onChange, ref: field.ref, "aria-invalid": invalid };
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={field.name}>{labels[name]}</FieldLabel>
      {name === "accountId" ? (
        <NativeSelect {...inputProps} value={String(field.value ?? "")} className="control-field">
          <NativeSelectOption value="">{crmControlCopy.chooseAccount}</NativeSelectOption>
          {accounts.map((account) => <NativeSelectOption key={account.id} value={account.id}>{account.name}</NativeSelectOption>)}
        </NativeSelect>
      ) : (
        <Input
          {...inputProps}
          value={String(field.value ?? "")}
          type={name === "expectedCloseDate" ? "date" : name === "probability" ? "number" : "text"}
          inputMode={name === "value" ? "decimal" : undefined}
          min={name === "probability" ? 0 : undefined}
          max={name === "probability" ? 100 : undefined}
          onChange={name === "probability" ? (event) => field.onChange(Number(event.target.value)) : field.onChange}
        />
      )}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/** Render the allowed opportunity stages; the server transaction validates transitions. */
export function CrmDealStageFieldBlock({ field, invalid, error, id }: CrmFieldView & { id: string }) {
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{crmControlCopy.opportunityStage}</FieldLabel>
      <NativeSelect name={field.name} value={String(field.value ?? "")} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} id={id} aria-invalid={invalid} className="control-field">
        {Object.values(CrmDealStage).map((stage) => <NativeSelectOption key={stage} value={stage}>{stage}</NativeSelectOption>)}
      </NativeSelect>
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/** Shared submit/error/status block for CRM form templates. */
export function CrmFormSubmitBlock({ label, pendingLabel, pending, disabled = false, error, status }: {
  label: string; pendingLabel?: string; pending: boolean; disabled?: boolean; error?: string; status?: string;
}) {
  return (
    <>
      {error && <FieldError>{error}</FieldError>}
      <Button type="submit" disabled={pending || disabled}>{pending ? (pendingLabel ?? label) : label}</Button>
      {status && <p role="status">{status}</p>}
    </>
  );
}
