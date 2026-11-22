import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supportCopy as copy } from "@/content/support";
import type { ActionErrorCode } from "@/types/actionTypes";
import type {
  SupportAnalyticsView,
  SupportArticleView,
  SupportConversationView,
  SupportFieldBinding,
  SupportFormView,
  SupportInboxView,
  SupportKnowledgeView,
  SupportPageKind,
  SupportPager,
} from "@/types/supportTypes";
import Link from "next/link";
import { useId } from "react";

/** Present the heading for a support route within the tenant shell. */
export function SupportHeadingBlock({ page }: { page: SupportPageKind }) {
  return <h1 className="type-title">{copy.headings[page]}</h1>;
}

/** Reserve space for the pending route heading and result or form. */
export function SupportSkeletonBlock({ page }: { page: SupportPageKind }) {
  return (
    <div
      className="flex flex-col gap-5 p-5"
      role="status"
      aria-label={copy.headings[page]}
    >
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardContent className="space-y-4 p-5">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/** Present forbidden and invalid-query results without rendering protected data. */
export function SupportUnavailableBlock({ code }: { code: ActionErrorCode }) {
  if (code === "FORBIDDEN" || code === "UNAUTHENTICATED")
    return <p role="alert">{copy.unavailable.denied}</p>;
  if (code === "VALIDATION")
    return <p role="alert">{copy.unavailable.invalid}</p>;
  if (code === "NOT_FOUND")
    return <p role="alert">{copy.unavailable.missing}</p>;
  return <p role="alert">{copy.unavailable.failed}</p>;
}

/** Render links over the same filter and visibility context. */
export function SupportPaginationBlock({ previous, next }: SupportPager) {
  if (!previous && !next) return null;
  return (
    <nav aria-label={copy.pagination} className="flex gap-4">
      {previous && (
        <Link className="type-link" href={previous}>
          {copy.previous}
        </Link>
      )}
      {next && (
        <Link className="type-link" href={next}>
          {copy.next}
        </Link>
      )}
    </nav>
  );
}

/** Show server-side filter controls and current active-queue results. */
export function SupportInboxBlock({
  tickets,
  query,
  status,
  priority,
  canCreateTicket,
}: SupportInboxView) {
  return (
    <>
      <form
        action="/support/inbox"
        className="flex flex-wrap items-center gap-3"
      >
        <Input
          className="w-auto"
          name="query"
          aria-label={copy.searchTickets}
          placeholder={copy.searchTicketPlaceholder}
          defaultValue={query}
          maxLength={300}
        />
        <div className="w-full sm:w-52">
          <NativeSelect
            name="status"
            aria-label={copy.fields.status}
            defaultValue={status}
          >
            <NativeSelectOption value="">{copy.allStatuses}</NativeSelectOption>
            {Object.entries(copy.status)
              .filter(([value]) => value !== "CLOSED")
              .map(([value, label]) => (
                <NativeSelectOption key={value} value={value}>
                  {label}
                </NativeSelectOption>
              ))}
          </NativeSelect>
        </div>
        <div className="w-full sm:w-44">
          <NativeSelect
            name="priority"
            aria-label={copy.fields.priority}
            defaultValue={priority}
          >
            <NativeSelectOption value="">
              {copy.allPriorities}
            </NativeSelectOption>
            {Object.entries(copy.priority).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <Button type="submit">{copy.search}</Button>
        {canCreateTicket && (
          <Link className="type-link" href="/support/tickets/new">
            {copy.newTicket}
          </Link>
        )}
      </form>
      {tickets.length === 0 ? (
        <p>{copy.noTickets}</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/support/tickets/${ticket.id}`}
              className="grid gap-3 p-4 hover:bg-muted md:grid-cols-[8rem_1fr_14rem]"
            >
              <div>
                <p className="type-label">#{ticket.number}</p>
                <p>{copy.priority[ticket.priority]}</p>
              </div>
              <div>
                <h2 className="type-label">{ticket.subject}</h2>
                <p className="text-muted-primary">
                  {ticket.requester?.displayName ??
                    ticket.requester?.email ??
                    copy.unknown}{" "}
                  · {copy.messages(ticket.messageCount)}
                </p>
              </div>
              <div>
                <p>{copy.status[ticket.status]}</p>
                <p className="text-sm">
                  {ticket.assignee?.displayName ?? copy.unassigned}
                </p>
                <p className="text-sm">
                  {copy.responseDeadline}{" "}
                  {ticket.firstResponseDueAt ? (
                    <SupportTime value={ticket.firstResponseDueAt} />
                  ) : (
                    copy.notSet
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/** Display the stored instant with an explicit timezone and semantic datetime. */
function SupportTime({ value }: { value: string }) {
  return (
    <time dateTime={value}>{value.slice(0, 16).replace("T", " ")} UTC</time>
  );
}

/** Render the published article index and its server-side search controls. */
export function SupportKnowledgeBlock({
  articles,
  query,
  canCreateArticle,
}: SupportKnowledgeView) {
  return (
    <>
      <form
        action="/support/knowledge-base"
        className="flex flex-wrap items-center gap-3"
      >
        <Input
          className="w-auto"
          name="query"
          aria-label={copy.searchArticles}
          placeholder={copy.searchArticles}
          defaultValue={query}
          maxLength={300}
        />
        <Button type="submit">{copy.search}</Button>
        {canCreateArticle && (
          <Link className="type-link" href="/support/knowledge-base/new">
            {copy.writeArticle}
          </Link>
        )}
      </form>
      {articles.length === 0 ? (
        <p>{copy.noArticles}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    className="type-link"
                    href={`/support/knowledge-base/${article.id}`}
                  >
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {copy.updated} <SupportTime value={article.updatedAt} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

/** Render the article as text and offer editing only to authorized editors. */
export function SupportArticleBlock({
  article,
  canEditArticle,
}: SupportArticleView) {
  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Link className="type-link" href="/support/knowledge-base">
        {copy.headings.knowledge}
      </Link>
      <header className="space-y-3 border-b border-border pb-5">
        <h1 className="type-title">{article.title}</h1>
        <p>
          {copy.updated} <SupportTime value={article.updatedAt} />
        </p>
        {canEditArticle && (
          <Link
            className="type-link"
            href={`/support/knowledge-base/${article.id}/edit`}
          >
            {copy.headings.editArticle}
          </Link>
        )}
      </header>
      <div className="reading-copy wrap-break-word whitespace-pre-wrap">
        {article.body}
      </div>
    </article>
  );
}

/** Display only the messages and metadata selected for the current viewer. */
export function SupportConversationBlock({
  ticket,
  messages,
  pager,
  children,
  resolutionOverdue,
}: SupportConversationView) {
  return (
    <>
      <h1 className="type-title">
        #{ticket.number} · {ticket.subject}
      </h1>
      <div className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.conversation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="wrap-break-word whitespace-pre-wrap">
              {ticket.description || copy.noDescription}
            </p>
            <ol className="space-y-4">
              {messages.map((message) => (
                <li key={message.id} className="space-y-2 surface-inset p-4">
                  <p className="type-label">
                    {message.authorLabel}
                    {message.isInternal && ` · ${copy.internalNote}`}
                  </p>
                  <p className="text-xs text-muted-primary">
                    <SupportTime value={message.createdAt} />
                  </p>
                  <p className="wrap-break-word whitespace-pre-wrap">
                    {message.body}
                  </p>
                </li>
              ))}
            </ol>
            {!messages.length && <p>{copy.noReplies}</p>}
            <SupportPaginationBlock {...pager} />
            {children}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{copy.triage}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3">
              <dt>{copy.requester}</dt>
              <dd>
                {ticket.requester?.displayName ??
                  ticket.requester?.email ??
                  copy.unknown}
              </dd>
              <dt>{copy.assignee}</dt>
              <dd>{ticket.assignee?.displayName ?? copy.unassigned}</dd>
              <dt>{copy.fields.priority}</dt>
              <dd>{copy.priority[ticket.priority]}</dd>
              <dt>{copy.fields.status}</dt>
              <dd>{copy.status[ticket.status]}</dd>
              <dt>{copy.responseDeadline}</dt>
              <dd>
                {ticket.firstResponseDueAt ? (
                  <SupportTime value={ticket.firstResponseDueAt} />
                ) : (
                  copy.notSet
                )}
              </dd>
              <dt>{copy.resolutionDeadline}</dt>
              <dd>
                {ticket.resolutionDueAt ? (
                  <SupportTime value={ticket.resolutionDueAt} />
                ) : (
                  copy.notSet
                )}
                {resolutionOverdue && (
                  <span className="block text-destructive">{copy.overdue}</span>
                )}
              </dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/** Report complete non-closed queue counts for tickets visible to this caller. */
export function SupportAnalyticsBlock({ count, rows }: SupportAnalyticsView) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.queuePopulation}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="type-title tabular-nums">{count}</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.fields.priority}</TableHead>
              <TableHead>{copy.tickets}</TableHead>
              <TableHead>{copy.unassigned}</TableHead>
              <TableHead>{copy.status.WAITING_ON_CUSTOMER}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{copy.priority[row.priority]}</TableCell>
                <TableCell>{row.count}</TableCell>
                <TableCell>{row.unassigned}</TableCell>
                <TableCell>{row.waiting}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/** Connect a presentational control and its accessible error text to an RHF binding. */
function SupportFieldBlock({ binding }: { binding: SupportFieldBinding }) {
  const id = useId();
  const label = copy.fields[binding.name];
  const props = {
    ...binding.registration,
    id,
    "aria-invalid": Boolean(binding.error),
    "aria-describedby": binding.error ? `${id}-error` : undefined,
  };
  return (
    <Field data-invalid={Boolean(binding.error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {binding.options ? (
        <NativeSelect {...props}>
          {binding.options.map((option) => (
            <NativeSelectOption key={option} value={option}>
              {copy.status[option as keyof typeof copy.status] ??
                copy.priority[option as keyof typeof copy.priority]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ) : binding.multiline ? (
        <Textarea {...props} rows={binding.multiline} />
      ) : (
        <Input {...props} />
      )}
      {binding.error && (
        <FieldError id={`${id}-error`}>{binding.error}</FieldError>
      )}
    </Field>
  );
}

/** Present bound controls, pending state, and command outcomes. */
export function SupportFormBlock({
  kind,
  fields,
  pending,
  saved,
  error,
  transportFailed,
  onSubmit,
}: SupportFormView) {
  return (
    <form
      className="flex flex-col items-start gap-4"
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
    >
      <FieldGroup className="w-full">
        {fields.map((binding) => (
          <SupportFieldBlock key={binding.name} binding={binding} />
        ))}
      </FieldGroup>
      {(error || transportFailed) && (
        <p role="alert">{error ?? copy.unavailable.failed}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? copy.saving : copy.submit[kind]}
      </Button>
      <p role="status">{saved && copy.saved[kind]}</p>
    </form>
  );
}
