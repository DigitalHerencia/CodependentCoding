import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableCell, TableHead,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  crmPresentationCopy,
  crmControlCopy,
  crmRemainingCopy,
  accountFormCopy,
  contactFormCopy,
  crmTemplateCopy,
  crmResultCopy,
  crmListCopy,
} from "@/content/crm";
import type {
  CrmAccountDTO,
  CrmContactDTO,
  CrmDealSummaryDTO,
} from "@/types/crmTypes";
import Link from "next/link";
import type { ReactNode, FormEventHandler, ComponentProps } from "react";
import type { Route } from "next";
import type { CrmPageInfo } from "@/types/crmTypes";
import type { CrmFieldBinding } from "@/types/crmTypes";

// Why: Templates: pure presentation for the crm pages, laid out from DTOs; data and slots come from features.

/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmAccountDetailContentBlock({
  account,
}: {
  account: CrmAccountDTO;
}) {
  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <CrmPanelBlock title={crmTemplateCopy.relationshipNotes}>
          <p className="whitespace-pre-wrap">
            {account.notes ?? crmTemplateCopy.noNotes}
          </p>
        </CrmPanelBlock>
        <CrmPanelBlock title={crmTemplateCopy.companyProfile}>
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
        </CrmPanelBlock>
      </section>
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmAccountsContentBlock({
  accounts,
}: {
  accounts: CrmAccountDTO[];
  toolbar?: ReactNode;
}) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      </section>
      {!accounts.length && <p>{crmTemplateCopy.noAccounts}</p>}
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
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
        <CrmPanelBlock key={currency} title={currency}>
          <CrmTableBlock
            columns={[
              { key: "stage", label: crmTemplateCopy.stage },
              { key: "count", label: crmTemplateCopy.opportunityCount },
              { key: "value", label: crmTemplateCopy.pipelineValue },
              { key: "weighted", label: crmTemplateCopy.weightedValue },
            ]}
            rows={rows}
          />
        </CrmPanelBlock>
      ))}
      {!count && <p>{crmTemplateCopy.noAnalytics}</p>}
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmContactDetailContentBlock({
  contact,
}: {
  contact: CrmContactDTO;
  lead?: boolean;
}) {
  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <CrmPanelBlock title={crmTemplateCopy.contactProfile}>
          <p className="text-xl">
            {contact.title ?? crmTemplateCopy.unknownTitle}
          </p>
          <section className="mt-5 space-y-3">
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
          </section>
        </CrmPanelBlock>
        <CrmPanelBlock title={crmTemplateCopy.relationship}>
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
        </CrmPanelBlock>
      </section>
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
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
      <CrmTableBlock
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

/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmLeadDetailPageBlock({
  contact, qualifyControl,
}: {
  contact: CrmContactDTO;
  qualifyControl?: ReactNode | undefined;
}) {
  return (
    <>
      <CrmContactDetailContentBlock contact={contact} lead />
      {qualifyControl}
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
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
      <section className="space-y-3">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]"
          >
            <section>
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
            </section>
            <section>
              {contact.email ? (
                <a className="type-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : (
                <p>{crmTemplateCopy.emailNeeded}</p>
              )}
              <p>{contact.phone ?? crmTemplateCopy.unknownPhone}</p>
              <p>{contact.account?.name ?? crmTemplateCopy.noAccount}</p>
            </section>
            <Link className="type-link" href={`/crm/leads/${contact.id}/edit`}>
              {crmTemplateCopy.qualify}
            </Link>
          </Card>
        ))}
      </section>
      {!contacts.length && <p>{crmTemplateCopy.noLeads}</p>}
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
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
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map(({ stage, items }) => {
          return (
            <CrmPanelBlock
              key={stage}
              title={crmRemainingCopy.nameAndDetail(
                stage.replaceAll("_", " "),
                items.length,
              )}
            >
              <section className="space-y-3">
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
              </section>
            </CrmPanelBlock>
          );
        })}
      </section>
    </>
  );
}

/** Compose CRM content and ShadCN primitives into a domain UI block. */
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
/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmAccountsToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}
/** Compose CRM content and ShadCN primitives into a domain UI block. */
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
/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmContactsToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}
/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmLeadsToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}
/** Compose CRM content and ShadCN primitives into a domain UI block. */
export function CrmPipelineToolbarBlock({ toolbar }: { toolbar?: ReactNode }) {
  return toolbar ?? null;
}

// -----------------------------------------------------------------------------
// Interactive CRM search controls: composed primitives, no local state.
// -----------------------------------------------------------------------------
/** Declare or implement the CRM-specific contract named CrmAccountsToolbar. */
// -----------------------------------------------------------------------------
// CRM form field blocks: presentation only; controllers belong in form features.
// -----------------------------------------------------------------------------
type CrmFieldView = { field: CrmFieldBinding; invalid: boolean; error?: string | undefined };

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
export function CrmContactFieldBlock({ name, field, invalid, error, statusOptions }: CrmFieldView & {
  name: "firstName" | "lastName" | "email" | "phone" | "title" | "status";
  statusOptions: readonly string[];
}) {
  const inputProps = { id: name, name: field.name, onBlur: field.onBlur, onChange: field.onChange, ref: field.ref, "aria-invalid": invalid };
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={name}>{contactFormCopy.fields[name]}</FieldLabel>
      {name === "status" ? (
        <NativeSelect {...inputProps} value={String(field.value ?? "")} className="control-field">
          {statusOptions.map((status) => <NativeSelectOption key={status} value={status}>{status}</NativeSelectOption>)}
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
export function CrmDealStageFieldBlock({ field, invalid, error, id, stageOptions }: CrmFieldView & { id: string; stageOptions: readonly string[] }) {
  const inputProps = { id, name: field.name, onBlur: field.onBlur, onChange: field.onChange, ref: field.ref, "aria-invalid": invalid };
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{crmControlCopy.opportunityStage}</FieldLabel>
      <NativeSelect {...inputProps} value={String(field.value ?? "")} className="control-field">
        {stageOptions.map((stage) => <NativeSelectOption key={stage} value={stage}>{stage}</NativeSelectOption>)}
      </NativeSelect>
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/** Shared submit/error/status block for CRM form templates. */
export function CrmFormSubmitBlock({ label, pendingLabel, pending, disabled = false, error, status }: {
  label: string; pendingLabel?: string; pending: boolean; disabled?: boolean; error?: string | undefined; status?: "saved" | "failed" | undefined;
}) {
  return (
    <>
      {error && <FieldError>{error}</FieldError>}
      <Button type="submit" disabled={pending || disabled}>{pending ? (pendingLabel ?? label) : label}</Button>
      {status && <p role="status">{crmResultCopy[status]}</p>}
    </>
  );
}


// -----------------------------------------------------------------------------
// CRM-owned layout and collection primitives (no shared presentation).
// -----------------------------------------------------------------------------

/** An accessible CRM page frame beneath the existing tenant route-group shell. */
export function CrmPageBlock({
  section,
  account,
  contact,
  toolbar,
  children,
}: {
  section: "accounts" | "analytics" | "contacts" | "leads" | "pipeline" | "detail";
  account?: CrmAccountDTO | undefined;
  contact?: CrmContactDTO | undefined;
  toolbar?: ReactNode | undefined;
  children: ReactNode;
}) {
  const titles = {
    accounts: crmTemplateCopy.accounts,
    analytics: crmTemplateCopy.analytics,
    contacts: crmTemplateCopy.contactDirectory,
    leads: crmTemplateCopy.leadQueue,
    pipeline: crmTemplateCopy.pipeline,
    detail: crmTemplateCopy.relationship,
  };
  const title = account?.name
    ?? (contact ? crmRemainingCopy.personName(contact.firstName, contact.lastName) : titles[section]);
  return (
    <Card role="region" aria-label={title} className="min-w-0">
      <CardHeader className="grid gap-3 md:flex md:items-center md:justify-between">
        <h1 className="type-title">{title}</h1>
        {toolbar}
      </CardHeader>
      <CardContent className="space-y-4 p-4">{children}</CardContent>
    </Card>
  );
}

/** A CRM record grouping using domain-owned ShadCN card composition. */
export function CrmPanelBlock({
  title,
  children,
  className,
}: {
  title?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <Card className={className}>
      {title && <CardHeader><CardTitle>{title}</CardTitle></CardHeader>}
      <CardContent className="space-y-3 p-4">{children}</CardContent>
    </Card>
  );
}

type CrmTableColumn = { key: string; label: string };
type CrmTableRow = { id: string; href?: string; cells: Record<string, ReactNode> };

/** Domain-specific ShadCN table; links remain accessible to keyboard users. */
export function CrmTableBlock({
  columns,
  rows,
  emptyLabel = crmTemplateCopy.noContacts,
}: {
  columns: readonly CrmTableColumn[];
  rows: readonly CrmTableRow[];
  emptyLabel?: string | undefined;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => <TableHead key={column.key}>{column.label}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length ? rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column, index) => (
              <TableCell key={column.key}>
                {index === 0 && row.href ? (
                  <Link href={row.href as Route} className="type-link">
                    {row.cells[column.key]}
                  </Link>
                ) : (row.cells[column.key] ?? crmTemplateCopy.emptyValue)}
              </TableCell>
            ))}
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={Math.max(1, columns.length)}>{emptyLabel}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// -----------------------------------------------------------------------------
// CRM-specific search, filter and page controls.
// -----------------------------------------------------------------------------

/** CRM-only filters; client islands own URL state and event behavior. */
export function CrmListFiltersBlock({
  mode, query, sort, filter, onQueryChange, onSortChange, onFilterChange,
}: {
  mode: "accounts" | "contacts" | "leads" | "pipeline";
  query: string;
  sort: string;
  filter: string;
  onQueryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}) {
  const sorts = mode === "pipeline" ? [
    { value: "stage-asc", label: crmListCopy.sortStageAsc },
    { value: "updated-desc", label: crmListCopy.sortUpdatedDesc },
    { value: "value-desc", label: crmListCopy.sortValueDesc },
  ] : [
    { value: "name-asc", label: crmListCopy.sortNameAsc },
    { value: "name-desc", label: crmListCopy.sortNameDesc },
    { value: "updated-desc", label: crmListCopy.sortUpdatedDesc },
  ];
  const filterOptions = mode === "pipeline"
    ? crmListCopy.stageOptions
    : mode === "accounts" ? crmListCopy.accountStatusOptions : crmListCopy.contactStatusOptions;
  const filterLabel = mode === "pipeline" ? crmListCopy.stage : crmListCopy.status;
  const create = mode === "accounts"
    ? { href: "/crm/accounts/new", label: crmListCopy.createAccount }
    : mode === "contacts"
      ? { href: "/crm/contacts/new", label: crmListCopy.createContact }
      : mode === "leads" ? { href: "/crm/leads/new", label: crmListCopy.createLead } : null;
  return (
    <nav aria-label={crmListCopy.search} className="grid w-full gap-3 md:grid-cols-[minmax(10rem,1fr)_auto_auto_auto]">
      <Field>
        <FieldLabel htmlFor="crm-search">{crmListCopy.search}</FieldLabel>
        <Input id="crm-search" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="crm-sort">{crmListCopy.sort}</FieldLabel>
        <NativeSelect id="crm-sort" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {sorts.map(({ value, label }) => <NativeSelectOption key={value} value={value}>{label}</NativeSelectOption>)}
        </NativeSelect>
      </Field>
      {mode !== "leads" && (
        <Field>
          <FieldLabel htmlFor="crm-filter">{filterLabel}</FieldLabel>
          <NativeSelect id="crm-filter" value={filter} onChange={(event) => onFilterChange(event.target.value)}>
            <NativeSelectOption value="">{crmListCopy.all}</NativeSelectOption>
            {filterOptions.map(({ value, label }) => <NativeSelectOption key={value} value={value}>{label}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
      )}
      {create && <Button variant="default" size="sm" asChild><Link href={create.href as Route}>{create.label}</Link></Button>}
    </nav>
  );
}

/** CRM paging controls, with total and pending state supplied by the feature. */
export function CrmPaginationBlock({
  pageInfo,
  onPageChange,
  pending = false,
}: {
  pageInfo: CrmPageInfo;
  onPageChange: (page: number) => void;
  pending?: boolean | undefined;
}) {
  return (
    <nav aria-label={crmListCopy.page(pageInfo.page, pageInfo.totalPages)} className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm">{crmListCopy.resultCount(pageInfo.total)}</p>
      <p className="text-sm">{crmListCopy.page(pageInfo.page, pageInfo.totalPages)}</p>
      <Button type="button" variant="outline" size="sm" disabled={!pageInfo.hasPrevious || pending}
        onClick={() => onPageChange(pageInfo.page - 1)}>{crmListCopy.previous}</Button>
      <Button type="button" variant="outline" size="sm" disabled={!pageInfo.hasNext || pending}
        onClick={() => onPageChange(pageInfo.page + 1)}>{crmListCopy.next}</Button>
    </nav>
  );
}

// -----------------------------------------------------------------------------
// CRM form composition; controllers and Zod remain in feature forms.
// -----------------------------------------------------------------------------

/** Full CRM account create/edit form using ShadCN Card and Field blocks. */
export function CrmAccountFormBlock({
  edit, fields, onSubmit, error, pending,
}: {
  edit: boolean;
  fields: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string | undefined;
  pending: boolean;
}) {
  return (
    <Card className="mx-auto max-w-3xl">
      <form className="space-y-5 p-5" noValidate onSubmit={onSubmit}>
        <CardHeader><h1 className="type-title">{edit ? accountFormCopy.edit : accountFormCopy.create}</h1></CardHeader>
        <CardContent className="grid gap-4">{fields}</CardContent>
        <CrmFormSubmitBlock label={accountFormCopy.save} pendingLabel={accountFormCopy.saving} pending={pending} error={error} />
      </form>
    </Card>
  );
}

/** Full CRM contact/lead create/edit form, with copy owned by CRM. */
export function CrmContactFormBlock({
  edit, lead, fields, onSubmit, error, pending,
}: {
  edit: boolean;
  lead: boolean;
  fields: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string | undefined;
  pending: boolean;
}) {
  return (
    <Card className="mx-auto max-w-3xl">
      <form className="space-y-5 p-5" noValidate onSubmit={onSubmit}>
        <CardHeader><h1 className="type-title">{edit ? contactFormCopy.edit : contactFormCopy.create} {lead ? contactFormCopy.lead : contactFormCopy.contact}</h1></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">{fields}</CardContent>
        <CrmFormSubmitBlock label={contactFormCopy.save} pendingLabel={contactFormCopy.saving} pending={pending} error={error} />
      </form>
    </Card>
  );
}

/** Opportunity form preserved as native disclosure, styled with ShadCN Card. */
export function CrmOpportunityFormBlock({
  fields, onSubmit, error, pending, disabled, status,
}: {
  fields: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string | undefined;
  pending: boolean;
  disabled: boolean;
  status: "saved" | "failed" | undefined;
}) {
  return (
    <Card>
      <details className="p-4">
        <summary className="type-label cursor-pointer">{crmControlCopy.createOpportunity}</summary>
        <form className="space-y-4 py-4" noValidate onSubmit={onSubmit}>
          {fields}
          <CrmFormSubmitBlock label={crmControlCopy.createOpportunity} pending={pending}
            disabled={disabled} error={error} status={status} />
        </form>
      </details>
    </Card>
  );
}

/** Stage editor: presentation only, with server-validated transitions. */
export function CrmDealStageFormBlock({
  fields, onSubmit, error, pending, status,
}: {
  fields: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string | undefined;
  pending: boolean;
  status: "saved" | "failed" | undefined;
}) {
  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      {fields}
      <CrmFormSubmitBlock label={crmControlCopy.moveOpportunity} pending={pending} error={error} status={status} />
    </form>
  );
}

// -----------------------------------------------------------------------------
// CRM-only loading placeholders: skeletons replace templates directly.
// -----------------------------------------------------------------------------

/** Route-shaped CRM skeleton composed exclusively from ShadCN primitives. */
export function CrmSkeletonBlock({ variant }: {
  variant: "form" | "detail" | "directory" | "pipeline" | "analytics";
}) {
  const rows = variant === "form" ? 4 : variant === "pipeline" ? 6 : 5;
  return (
    <Card role="status" aria-label={crmListCopy.search} className="space-y-4 p-5">
      <CardHeader><Skeleton className="h-7 w-48" /></CardHeader>
      <CardContent className={variant === "form" ? "grid max-w-3xl gap-4" : "grid gap-4 md:grid-cols-2"}>
        {Array.from({ length: rows }, (_, index) => (
          <Card key={index} variant="inset" className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            {variant !== "form" && <Skeleton className="h-4 w-1/2" />}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}


// -----------------------------------------------------------------------------
// CRM lead qualification presentation (action reference owned by server feature).
// -----------------------------------------------------------------------------
/** Typed CRM lead qualification control, with no business logic in the block. */
export function CrmQualifyLeadBlock({
  pending, onQualify, error,
}: {
  pending: boolean;
  onQualify: () => void;
  error?: string | undefined;
}) {
  return (
    <>
      <Button type="button" variant="default" size="sm" disabled={pending} onClick={onQualify}>
        {pending ? crmListCopy.qualifyingLead : crmListCopy.qualifyLead}
      </Button>
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}
