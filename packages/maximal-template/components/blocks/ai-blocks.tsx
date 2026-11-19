import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { aiPresentationCopy as copy } from "@/content/ai";
import type {
  AiHeaderProps,
  AiOverviewMetricsProps,
  AiSummaryProps,
  AiHistoryProps,
  AiUsageRecordsProps,
  AiPaginationProps,
  AiConfigurationProps,
  AiPromptProps,
  AiSubmitProps,
  AiOutputProps,
  AiErrorProps,
} from "@/types/aiTypes";
import Link from "next/link";

/** Uses fixed UTC formatting so the rendered date range has no browser/server timezone mismatch. */
function date(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

/** Route headings and local links complement the existing tenant navigation. */
export function AiHeaderBlock({ route, scope }: AiHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div>
        <h1 className="type-title">{copy[route]}</h1>
        <p className="mt-2 text-muted-foreground">{copy.description}</p>
      </div>
      <nav className="flex flex-wrap gap-3" aria-label={copy.overview}>
        {(
          [
            ["overview", "/ai"],
            ["playground", "/ai/playground"],
            ["usage", "/ai/usage"],
          ] as const
        ).map(([key, href]) => (
          <Button
            key={key}
            asChild
            variant={route === key ? "default" : "outline"}
          >
            <Link href={href} aria-current={route === key ? "page" : undefined}>
              {copy[key]}
            </Link>
          </Button>
        ))}
      </nav>
      {scope && (
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="font-semibold">{copy.scope}</dt>
            <dd>{scope.label}</dd>
          </div>
          <div>
            <dt className="font-semibold">{copy.range}</dt>
            <dd>
              <time dateTime={scope.from}>{date(scope.from)}</time>
              {" – "}
              <time dateTime={scope.to}>{date(scope.to)}</time>
            </dd>
          </div>
        </dl>
      )}
    </header>
  );
}

/** Overview counters are supplied by authorized database aggregates, never by the current history page. */
export function AiOverviewMetricsBlock({
  generationCount,
  succeededCount,
  failedCount,
  runningCount,
}: AiOverviewMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {(
        [
          [copy.generations, generationCount],
          [copy.succeeded, succeededCount],
          [copy.failed, failedCount],
          [copy.running, runningCount],
        ] as const
      ).map(([label, value]) => (
        <Card key={label}>
          <CardContent className="pt-6">
            <dl>
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-2 text-3xl font-bold tabular-nums">{value}</dd>
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Accessible proportional meters expose genuine lifecycle counts for the displayed scope. */
export function AiOutcomesBlock({
  generationCount,
  succeededCount,
  failedCount,
  runningCount,
}: AiOverviewMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="type-label">{copy.distribution}</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-6">
        {(
          [
            [copy.succeeded, succeededCount],
            [copy.failed, failedCount],
            [copy.running, runningCount],
          ] as const
        ).map(([label, count]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <span className="tabular-nums">{count}</span>
            </div>
            <meter
              className="h-4 w-full"
              min={0}
              max={Math.max(generationCount, 1)}
              value={count}
              aria-label={label}
            >
              {count}
            </meter>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** Keeps exact decimal cost strings intact and distinguishes missing measurements from measured zero. */
export function AiSummaryBlock({ summary }: AiSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="type-label">{copy.summary}</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {(
            [
              [copy.generations, summary.generationCount],
              [copy.input, summary.inputTokens],
              [copy.output, summary.outputTokens],
              [copy.cost, summary.cost],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">
                {value ?? copy.unknown}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted-foreground">
          {copy.measured}: {copy.input} {summary.measuredInputCount};{" "}
          {copy.output} {summary.measuredOutputCount}; {copy.cost}{" "}
          {summary.measuredCostCount}.
        </p>
        <p className="text-sm text-muted-foreground">{copy.measurementNote}</p>
      </CardContent>
    </Card>
  );
}

/** Bounded history deliberately omits private prompts and provider diagnostics. */
export function AiHistoryBlock({ generations }: AiHistoryProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="type-label">{copy.history}</h2>
      {generations.items.length ? (
        <Table>
          <TableCaption>{copy.history}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">{copy.model}</TableHead>
              <TableHead scope="col">{copy.status}</TableHead>
              <TableHead scope="col">{copy.date}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generations.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="break-all">{item.model}</TableCell>
                <TableCell>
                  <Badge variant="outline">{copy.statuses[item.status]}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <time dateTime={item.createdAt}>{date(item.createdAt)}</time>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">{copy.noHistory}</p>
      )}
    </section>
  );
}

/** Ledger rows preserve missing measurements and exact persisted decimal strings. */
export function AiUsageRecordsBlock({
  records,
  activity = false,
}: AiUsageRecordsProps) {
  const title = activity ? copy.activity : copy.usage;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="type-label">{title}</h2>
      {records.length ? (
        <Table>
          <TableCaption>{title}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">{copy.model}</TableHead>
              <TableHead scope="col">{copy.occurred}</TableHead>
              <TableHead scope="col">{copy.input}</TableHead>
              <TableHead scope="col">{copy.output}</TableHead>
              <TableHead scope="col">{copy.cost}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="break-all">{item.model}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <time dateTime={item.occurredAt}>
                    {date(item.occurredAt)}
                  </time>
                </TableCell>
                <TableCell>{item.inputTokens ?? copy.unknown}</TableCell>
                <TableCell>{item.outputTokens ?? copy.unknown}</TableCell>
                <TableCell>{item.cost ?? copy.unknown}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">{copy.noUsage}</p>
      )}
    </section>
  );
}

/** Links retain server pagination without adding a second client navigation implementation. */
export function AiPaginationBlock({
  page,
  hasNextPage,
  usage = false,
}: AiPaginationProps) {
  const path = usage ? "/ai/usage" : "/ai";
  return (
    <nav
      aria-label={copy.pagination}
      className="flex flex-wrap items-center gap-4"
    >
      {page > 1 && (
        <Button asChild variant="outline">
          <Link href={`${path}?page=${page - 1}`}>{copy.previous}</Link>
        </Button>
      )}
      <span className="text-sm">
        {copy.page} {page}
      </span>
      {hasNextPage && (
        <Button asChild variant="outline">
          <Link href={`${path}?page=${page + 1}`}>{copy.next}</Link>
        </Button>
      )}
    </nav>
  );
}

/** Server-owned provider configuration is displayed without credentials or editable model options. */
export function AiConfigurationBlock({ configuration }: AiConfigurationProps) {
  return (
    <div className="flex flex-col gap-3">
      <dl className="flex flex-wrap gap-6 text-sm">
        <div>
          <dt className="font-semibold">{copy.provider}</dt>
          <dd>{configuration.provider}</dd>
        </div>
        <div>
          <dt className="font-semibold">{copy.model}</dt>
          <dd className="break-all">{configuration.model}</dd>
        </div>
      </dl>
      {!configuration.configured && <p role="status">{copy.unavailable}</p>}
      {!configuration.canGenerate && <p role="status">{copy.forbidden}</p>}
    </div>
  );
}

/** Controlled prompt bindings originate in the form; this block owns labels and primitive composition. */
export function AiPromptBlock({
  promptField,
  promptError,
  pending,
  configuration,
}: AiPromptProps) {
  return (
    <FieldGroup>
      <Field data-invalid={Boolean(promptError)}>
        <FieldLabel htmlFor="ai-prompt">{copy.prompt}</FieldLabel>
        <Textarea
          {...promptField}
          id="ai-prompt"
          className="min-h-64"
          maxLength={100000}
          disabled={
            pending || !configuration.configured || !configuration.canGenerate
          }
          aria-invalid={Boolean(promptError)}
          aria-describedby={`ai-prompt-help${promptError ? " ai-prompt-error" : ""}`}
        />
        <FieldDescription id="ai-prompt-help">
          {copy.promptHelp}
        </FieldDescription>
        {promptError && (
          <FieldError id="ai-prompt-error">{promptError}</FieldError>
        )}
      </Field>
    </FieldGroup>
  );
}

/** Submission status remains announced while failed responses expose no provider diagnostics. */
export function AiSubmitBlock({
  pending,
  error,
  configuration,
}: AiSubmitProps) {
  return (
    <div className="flex flex-col gap-4">
      {error && <FieldError>{copy.generationFailed}</FieldError>}
      <Button
        type="submit"
        disabled={
          pending || !configuration.configured || !configuration.canGenerate
        }
      >
        {pending ? copy.generating : copy.generate}
      </Button>
    </div>
  );
}

/** React renders inference output as text; it is never interpreted as HTML or application code. */
export function AiOutputBlock({ pending, output }: AiOutputProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="type-label">{copy.response}</h2>
      </CardHeader>
      <CardContent className="pt-6">
        <p role="status" aria-live="polite">
          {pending ? copy.generating : output ? copy.success : copy.initial}
        </p>
        {!pending && output && (
          <p className="mt-4 break-words whitespace-pre-wrap">{output}</p>
        )}
      </CardContent>
    </Card>
  );
}

/** One reusable skeleton block supplies route fallbacks without a skeleton template or nested shell. */
export function AiRouteSkeletonBlock() {
  return (
    <section
      className="flex flex-col gap-6 p-4 md:p-6"
      aria-busy="true"
      aria-label={copy.loading}
    >
      <span className="sr-only" role="status">
        {copy.loading}
      </span>
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-10 w-72 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
    </section>
  );
}

/** Recoverable route error never renders Next's error message or private provider diagnostics. */
export function AiErrorBlock({ onRetry }: AiErrorProps) {
  return (
    <section className="flex flex-col gap-4 p-4 md:p-6" role="alert">
      <h1 className="type-title">{copy.loadFailed}</h1>
      <p>{copy.retryHelp}</p>
      <Button onClick={onRetry} className="self-start">
        {copy.retry}
      </Button>
    </section>
  );
}
