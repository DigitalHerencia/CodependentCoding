"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/ui/chart";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { marketingCopy as copy } from "@/content/marketing";
import type {
  MarketingPageProps,
  MarketingCampaignsProps,
  MarketingAudiencesProps,
  MarketingCampaignDetailProps,
  MarketingAudienceDetailProps,
  MarketingAnalyticsProps,
  MarketingFieldProps,
  MarketingFormFrameProps,
  MarketingLifecycleProps,
  MarketingPaginationProps,
  MarketingFiltersProps,
  MarketingDistributionProps,
  MarketingAudienceSearchProps,
} from "@/types/marketingTypes";

/** Tenant content heading; the tenant layout supplies navigation and chrome. */
export function MarketingPageBlock({
  section,
  title,
  toolbar,
  children,
}: MarketingPageProps) {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="type-title">{title ?? copy.titles[section]}</h1>
          <p className="text-muted-foreground">{copy.description}</p>
        </div>
        {toolbar}
      </header>
      {children}
    </section>
  );
}

/** GET controls query every matching authorized record in the database. */
export function MarketingFiltersBlock({
  kind,
  criteria,
  canCreate,
}: MarketingFiltersProps) {
  const statuses =
    kind === "campaigns" ? copy.campaignStatuses : copy.audienceStatuses;
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <form
        action={`/marketing/${kind}`}
        method="get"
        className="flex flex-wrap items-end gap-3"
      >
        <Field>
          <FieldLabel htmlFor={`${kind}-search`}>{copy.search}</FieldLabel>
          <Input
            id={`${kind}-search`}
            name="search"
            maxLength={200}
            defaultValue={criteria.search}
            placeholder={
              kind === "campaigns" ? copy.campaignSearch : copy.audienceSearch
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${kind}-status`}>{copy.status}</FieldLabel>
          <NativeSelect
            id={`${kind}-status`}
            name="status"
            defaultValue={criteria.status}
          >
            <NativeSelectOption value="ALL">
              {copy.allStatuses}
            </NativeSelectOption>
            {Object.entries(statuses).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <input type="hidden" name="pageSize" value={criteria.pageSize} />
        <Button type="submit">{copy.apply}</Button>
        <Link className="type-link" href={`/marketing/${kind}`}>
          {copy.reset}
        </Link>
      </form>
      {canCreate && (
        <Button asChild>
          <Link href={`/marketing/${kind}/new`}>
            {kind === "campaigns" ? copy.createCampaign : copy.createAudience}
          </Link>
        </Button>
      )}
    </div>
  );
}

/** Stable page links retain the server-normalized search and status filters. */
export function MarketingPaginationBlock({
  kind,
  page,
  previousHref,
  nextHref,
}: MarketingPaginationProps) {
  return (
    <nav
      aria-label={`${kind} ${copy.pagination}`}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p role="status">{copy.results(page.total, page.page, page.pageCount)}</p>
      <div className="flex gap-4">
        {previousHref && (
          <Link className="type-link" href={previousHref} rel="prev">
            {copy.previous}
          </Link>
        )}
        {nextHref && (
          <Link className="type-link" href={nextHref} rel="next">
            {copy.next}
          </Link>
        )}
      </div>
    </nav>
  );
}

/** Status groups describe the current page; matching totals come from the database. */
export function MarketingCampaignsContentBlock({
  page,
  groups,
}: MarketingCampaignsProps) {
  if (!page.items.length)
    return (
      <Card className="p-6">
        <p>{copy.emptyCampaigns}</p>
      </Card>
    );
  return (
    <div className="space-y-6">
      {groups.map(({ status, items }) => (
        <section key={status} className="space-y-3">
          <h2 className="type-heading">{copy.campaignStatuses[status]}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((campaign) => (
              <Card key={campaign.id} className="space-y-3 p-5">
                <h3>
                  <Link
                    className="type-link"
                    href={`/marketing/campaigns/${campaign.id}`}
                  >
                    {campaign.name}
                  </Link>
                </h3>
                <p className="line-clamp-3 whitespace-pre-wrap">
                  {campaign.description ?? copy.noBrief}
                </p>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-muted-foreground">{copy.audience}</dt>
                    <dd>{campaign.audience?.name ?? copy.noAudience}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{copy.schedule}</dt>
                    <dd>{campaign.scheduledAt ?? copy.noSchedule}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{copy.steps}</dt>
                    <dd>{campaign.stepCount}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Resolve supported audience semantics at the presentation boundary. */
export function MarketingAudienceDefinitionBlock({
  audience,
}: MarketingAudienceDetailProps) {
  return (
    <>
      <p>
        {audience.relationship
          ? copy.ruleDescription(copy.relationships[audience.relationship])
          : copy.customDefinition}
      </p>
      <p className="mt-3">
        {copy.status}: {copy.audienceStatuses[audience.status]}
      </p>
    </>
  );
}

/** Audience cards describe persisted rules without inventing membership counts. */
export function MarketingAudiencesContentBlock({
  audiences,
  capabilities,
}: MarketingAudiencesProps) {
  if (!audiences.length)
    return (
      <Card className="p-6">
        <p>{copy.emptyAudiences}</p>
      </Card>
    );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {audiences.map((audience) => (
        <Card key={audience.id} className="space-y-3 p-5">
          <h2>
            <Link
              className="type-link"
              href={`/marketing/audiences/${audience.id}`}
            >
              {audience.name}
            </Link>
          </h2>
          <MarketingAudienceDefinitionBlock audience={audience} />
          {capabilities.canUpdateAudiences && (
            <Link
              className="type-link"
              href={`/marketing/audiences/${audience.id}/edit`}
            >
              {copy.edit}
            </Link>
          )}
        </Card>
      ))}
    </div>
  );
}

/** Show planning state, lifecycle timestamps and selected non-sensitive step metadata. */
export function MarketingCampaignDetailContentBlock({
  campaign,
  steps,
  children,
  capabilities,
  editable,
}: MarketingCampaignDetailProps) {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-heading">{copy.details}</h2>
            {capabilities.canUpdateCampaigns && editable && (
              <Link
                className="type-link"
                href={`/marketing/campaigns/${campaign.id}/edit`}
              >
                {copy.edit}
              </Link>
            )}
          </div>
          <p className="whitespace-pre-wrap">
            {campaign.description ?? copy.noBrief}
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt>{copy.status}</dt>
              <dd>{copy.campaignStatuses[campaign.status]}</dd>
            </div>
            <div>
              <dt>{copy.audience}</dt>
              <dd>
                {campaign.audience ? (
                  capabilities.canReadAudiences ? (
                    <Link
                      className="type-link"
                      href={`/marketing/audiences/${campaign.audience.id}`}
                    >
                      {campaign.audience.name}
                    </Link>
                  ) : (
                    campaign.audience.name
                  )
                ) : (
                  copy.noAudience
                )}
              </dd>
            </div>
            <div>
              <dt>{copy.schedule}</dt>
              <dd>{campaign.scheduledAt ?? copy.noSchedule}</dd>
            </div>
            <div>
              <dt>{copy.started}</dt>
              <dd>{campaign.startedAt ?? copy.notRecorded}</dd>
            </div>
            <div>
              <dt>{copy.completed}</dt>
              <dd>{campaign.completedAt ?? copy.notRecorded}</dd>
            </div>
            <div>
              <dt>{copy.canceled}</dt>
              <dd>{campaign.canceledAt ?? copy.notRecorded}</dd>
            </div>
            <div>
              <dt>{copy.version}</dt>
              <dd>{campaign.version}</dd>
            </div>
          </dl>
        </Card>
        <Card className="space-y-4 p-5">
          <h2 className="type-heading">{copy.lifecycle}</h2>
          {children ?? <p>{copy.terminal}</p>}
        </Card>
      </div>
      <Card className="space-y-4 p-5">
        <h2 className="type-heading">{copy.steps}</h2>
        {steps.length ? (
          <ol className="space-y-3">
            {steps.map((step) => (
              <li key={step.id} className="rounded border p-3">
                <p>
                  {step.position}. {copy.stepTypes[step.type]}
                </p>
                {step.templateKey && (
                  <p>
                    {copy.template}: {step.templateKey}
                  </p>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p>{copy.noSteps}</p>
        )}
      </Card>
    </>
  );
}

/** Unsupported rules are described accurately and remain unchanged in storage. */
export function MarketingAudienceDetailContentBlock(
  props: MarketingAudienceDetailProps,
) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-heading">{copy.definition}</h2>
        {props.canUpdate && (
          <Link
            className="type-link"
            href={`/marketing/audiences/${props.audience.id}/edit`}
          >
            {copy.edit}
          </Link>
        )}
      </div>
      <MarketingAudienceDefinitionBlock {...props} />
    </Card>
  );
}

/** A BoldKit chart has an equivalent accessible status-count table. */
export function MarketingDistributionBlock({
  kind,
  rows,
}: MarketingDistributionProps) {
  const labels: Record<string, string> =
    kind === "campaigns" ? copy.campaignStatuses : copy.audienceStatuses;
  const data = rows.map((row, index) => ({
    name: labels[row.status] ?? row.status,
    value: row.count,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));
  return (
    <Card className="space-y-4 p-5">
      <h2 className="type-heading">
        {kind === "campaigns"
          ? copy.campaignDistribution
          : copy.audienceDistribution}
      </h2>
      {data.some((row) => row.value > 0) ? (
        <div aria-hidden="true">
          <DonutChart
            data={data}
            config={{ value: { label: copy.count } }}
            animated={false}
            showTooltip={false}
          />
        </div>
      ) : (
        <p>{copy.emptyChart}</p>
      )}
      <table className="w-full text-left">
        <caption className="sr-only">
          {kind === "campaigns"
            ? copy.campaignDistribution
            : copy.audienceDistribution}
        </caption>
        <thead>
          <tr>
            <th scope="col">{copy.status}</th>
            <th scope="col">{copy.count}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.status}>
              <th scope="row" className="py-2 font-normal">
                {labels[row.status]}
              </th>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/** Database aggregates and persisted update activity replace commercial sample metrics. */
export function MarketingAnalyticsContentBlock({
  analytics,
  range,
}: MarketingAnalyticsProps) {
  return (
    <>
      <form
        action="/marketing/analytics"
        method="get"
        className="flex flex-wrap items-end gap-3"
      >
        <Field>
          <FieldLabel htmlFor="marketing-from">{copy.from}</FieldLabel>
          <Input
            type="date"
            id="marketing-from"
            name="from"
            defaultValue={range.from}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="marketing-to">{copy.to}</FieldLabel>
          <Input
            type="date"
            id="marketing-to"
            name="to"
            defaultValue={range.to}
            required
          />
        </Field>
        <Button type="submit">{copy.apply}</Button>
      </form>
      <p className="text-muted-foreground">{copy.analyticsScope}</p>
      <p>
        {analytics.from} — {analytics.to}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [copy.campaigns, analytics.campaignTotal],
          [copy.audiences, analytics.audienceTotal],
          [copy.scheduled, analytics.scheduledCampaigns],
          [copy.stepCount, analytics.stepTotal],
        ].map(([label, value]) => (
          <Card key={String(label)} className="space-y-2 p-5">
            <h2 className="type-label">{label}</h2>
            <p className="text-3xl font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <MarketingDistributionBlock
          kind="campaigns"
          rows={analytics.campaignStatuses}
        />
        <MarketingDistributionBlock
          kind="audiences"
          rows={analytics.audienceStatuses}
        />
      </div>
      <Card className="space-y-4 p-5">
        <h2 className="type-heading">{copy.recent}</h2>
        <p>{copy.recentHint}</p>
        {analytics.recentCampaigns.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <caption className="sr-only">{copy.recent}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.campaign}</th>
                  <th scope="col">{copy.status}</th>
                  <th scope="col">{copy.updated}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <th scope="row" className="py-3 font-normal">
                      <Link
                        className="type-link"
                        href={`/marketing/campaigns/${campaign.id}`}
                      >
                        {campaign.name}
                      </Link>
                    </th>
                    <td>{copy.campaignStatuses[campaign.status]}</td>
                    <td>{campaign.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{copy.noActivity}</p>
        )}
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="type-heading">{copy.telemetry}</h2>
        <p>{copy.telemetryHint}</p>
      </Card>
    </>
  );
}

/** RHF supplies every field binding; blocks own primitives and accessible labels. */
export function MarketingFieldBlock({
  id,
  kind,
  field,
  error,
  audiences = [],
}: MarketingFieldProps) {
  const label = {
    name: copy.name,
    description: copy.brief,
    audienceId: copy.audience,
    scheduledAt: copy.schedule,
    status: copy.status,
    relationship: copy.rule,
  }[kind];
  const shared = {
    ...field,
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": error
      ? `${id}-error`
      : kind === "scheduledAt"
        ? `${id}-hint`
        : undefined,
  };
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {kind === "description" ? (
        <Textarea {...shared} maxLength={10000} />
      ) : kind === "audienceId" ? (
        <NativeSelect {...shared}>
          <NativeSelectOption value="">{copy.noAudience}</NativeSelectOption>
          {field.value &&
            !audiences.some((audience) => audience.id === field.value) && (
              <NativeSelectOption value={field.value}>
                {copy.selectedAudience}
              </NativeSelectOption>
            )}
          {audiences.map((audience) => (
            <NativeSelectOption key={audience.id} value={audience.id}>
              {audience.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ) : kind === "status" ? (
        <NativeSelect {...shared}>
          {Object.entries(copy.audienceStatuses).map(([value, text]) => (
            <NativeSelectOption key={value} value={value}>
              {text}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ) : kind === "relationship" ? (
        <NativeSelect {...shared}>
          {Object.entries(copy.relationships).map(([value, text]) => (
            <NativeSelectOption key={value} value={value}>
              {text}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ) : (
        <Input
          {...shared}
          type={kind === "scheduledAt" ? "datetime-local" : "text"}
          maxLength={kind === "name" ? 200 : undefined}
          required={kind === "name"}
        />
      )}
      {kind === "scheduledAt" && <p id={`${id}-hint`}>{copy.utcHint}</p>}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

/** Announce safe failures and offer explicit recovery after optimistic conflicts. */
export function MarketingFormBlock({
  kind,
  onSubmit,
  children,
  pending,
  error,
  conflict,
  unavailable,
  customDefinition,
  cancelHref,
  onReload,
}: MarketingFormFrameProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      className="mx-auto max-w-3xl space-y-5"
    >
      <fieldset disabled={pending || unavailable} className="space-y-5">
        {customDefinition && <p role="status">{copy.customDefinition}</p>}
        {children}
      </fieldset>
      {unavailable && <p role="status">{copy.unavailable}</p>}
      {error !== undefined && (
        <p role="alert" tabIndex={-1} data-marketing-form-error>
          {conflict ? copy.conflict : error || copy.saveFailed}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending || unavailable || conflict}>
          {pending
            ? copy.saving
            : kind === "campaign"
              ? copy.saveCampaign
              : copy.saveAudience}
        </Button>
        {conflict && (
          <Button type="button" variant="outline" onClick={onReload}>
            {copy.reload}
          </Button>
        )}
        <Link className="type-link" href={cancelHref}>
          {copy.cancel}
        </Link>
      </div>
    </form>
  );
}

/** Offer only transitions prepared from the persisted lifecycle and permissions. */
export function MarketingLifecycleBlock({
  id,
  field,
  transitions,
  error,
  pending,
  message,
  onSubmit,
  conflict,
  onReload,
}: MarketingLifecycleProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      className="space-y-4"
    >
      <p>{copy.lifecycleHint}</p>
      {transitions.length ? (
        <>
          <Field>
            <FieldLabel htmlFor={id}>{copy.lifecycle}</FieldLabel>
            <NativeSelect
              {...field}
              id={id}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              disabled={pending}
            >
              <NativeSelectOption value="">
                {copy.selectTransition}
              </NativeSelectOption>
              {transitions.map((status) => (
                <NativeSelectOption value={status} key={status}>
                  {copy.campaignStatuses[status]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Button type="submit" disabled={pending}>
            {pending ? copy.saving : copy.saveLifecycle}
          </Button>
        </>
      ) : (
        <p>{copy.terminal}</p>
      )}
      {error !== undefined && (
        <p
          role="alert"
          id={`${id}-error`}
          tabIndex={-1}
          data-marketing-form-error
        >
          {conflict ? copy.conflict : error || copy.saveFailed}
        </p>
      )}
      {conflict && (
        <Button type="button" onClick={onReload}>
          {copy.reload}
        </Button>
      )}
      <p role="status">{message ? copy.saved : ""}</p>
    </form>
  );
}

/** Mirror the heading and content geometry without introducing another shell. */
export function MarketingSkeletonBlock({ form = false }: { form?: boolean }) {
  return (
    <div role="status" aria-label={copy.loading} className="space-y-6">
      <span className="sr-only">{copy.loading}</span>
      <Skeleton className="h-9 w-64" />
      <div
        className={
          form ? "mx-auto max-w-3xl space-y-5" : "grid gap-4 md:grid-cols-2"
        }
      >
        {Array.from({ length: form ? 5 : 4 }, (_, index) => (
          <Skeleton
            key={index}
            className={form ? "h-16 w-full" : "h-48 w-full"}
          />
        ))}
      </div>
    </div>
  );
}

/** Route failures never render raw server or provider diagnostics. */
export function MarketingErrorBlock({ reset }: { reset: () => void }) {
  return (
    <Card role="alert" className="space-y-4 p-6">
      <h1 className="type-title">{copy.error}</h1>
      <Button onClick={reset}>{copy.retry}</Button>
    </Card>
  );
}

/** Absent tenant-scoped identifiers resolve to an actionable route boundary. */
export function MarketingNotFoundBlock() {
  return (
    <Card className="space-y-4 p-6">
      <h1 className="type-title">{copy.missing}</h1>
      <Link className="type-link" href="/marketing/campaigns">
        {copy.returnCampaigns}
      </Link>
    </Card>
  );
}

/** Bounded audience lookup supports associations outside the initial option page. */
export function MarketingAudienceSearchBlock({
  id,
  query,
  onQueryChange,
  onSearch,
  pending,
  error,
  results,
}: MarketingAudienceSearchProps) {
  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel htmlFor={id}>{copy.audienceOptionsSearch}</FieldLabel>
        <Input
          id={id}
          value={query}
          maxLength={200}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </Field>
      <Button type="button" disabled={pending} onClick={onSearch}>
        {pending ? copy.loading : copy.search}
      </Button>
      <p role="status">
        {results ? copy.audienceOptionsHint(results.shown, results.total) : ""}
      </p>
      {error !== undefined && <p role="alert">{error || copy.saveFailed}</p>}
    </div>
  );
}
