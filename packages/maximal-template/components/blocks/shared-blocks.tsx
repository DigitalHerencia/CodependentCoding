import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/ui/utils";
import { sharedLibraryCopy, sharedRemainingCopy } from "@/content/shared";
import { type IntegrationStatus } from "@/types/integrationTypes";
import Link from "next/link";
import { type ReactNode } from "react";

export type PageHeaderAction = {
  label: string;
  href: string;
};

export function IntegrationStatusGridBlock({
  integrations,
}: {
  integrations: IntegrationStatus[];
}) {
  return (
    <section className="grid gap-4 py-6 md:grid-cols-2 xl:grid-cols-3">
      {integrations.map((integration) => (
        <Card key={integration.name}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>{integration.name}</CardTitle>
              <Badge
                variant={
                  integration.state === "CONFIGURED" ? "default" : "outline"
                }
              >
                {integration.state}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {integration.purpose}
            </p>
            <Badge variant="secondary">{integration.mode}</Badge>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function PageHeaderBlock({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: PageHeaderAction;
}) {
  return (
    <header className="flex flex-col gap-5 border-b-3 border-foreground py-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-black tracking-[0.2em] text-primary uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </header>
  );
}

export type MetricItem = {
  label: string;
  value: string;
  detail?: string;
};

export function MetricGridBlock({ metrics }: { metrics: MetricItem[] }) {
  return (
    <section className="grid gap-4 py-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs tracking-widest text-muted-foreground uppercase">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{metric.value}</p>
            {metric.detail ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.detail}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export type DataTableColumn = {
  key: string;
  label: string;
};

export type DataTableRow = {
  id: string;
  href?: string;
  cells: Record<string, string | null>;
};

export function DataTableToolbarBlock({
  query,
  onQueryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  resultCount: number;
}) {
  return (
    <div className="grid gap-3 border-3 border-foreground bg-card p-4 sm:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] sm:items-center">
      <Input
        aria-label={sharedLibraryCopy.searchContacts}
        type="search"
        placeholder={sharedLibraryCopy.searchNameOrEmail}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <NativeSelect
        aria-label={sharedLibraryCopy.filterByStatus}
        className="h-11 border-3 border-input bg-background px-3 text-sm font-bold uppercase focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <NativeSelectOption value="all">
          {sharedLibraryCopy.allStatuses}
        </NativeSelectOption>
        <NativeSelectOption value="LEAD">
          {sharedLibraryCopy.lead}
        </NativeSelectOption>
        <NativeSelectOption value="ACTIVE">
          {sharedLibraryCopy.active}
        </NativeSelectOption>
        <NativeSelectOption value="INACTIVE">
          {sharedLibraryCopy.inactive}
        </NativeSelectOption>
      </NativeSelect>
      <NativeSelect
        aria-label={sharedLibraryCopy.sortContacts}
        className="h-11 border-3 border-input bg-background px-3 text-sm font-bold uppercase focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
      >
        <NativeSelectOption value="name-asc">
          {sharedLibraryCopy.nameAZ}
        </NativeSelectOption>
        <NativeSelectOption value="name-desc">
          {sharedLibraryCopy.nameZA}
        </NativeSelectOption>
        <NativeSelectOption value="updated-desc">
          {sharedLibraryCopy.recentlyUpdated}
        </NativeSelectOption>
      </NativeSelect>
      <p className="text-xs font-black tracking-wider text-muted-foreground uppercase">
        {resultCount}
        {sharedLibraryCopy.records}
      </p>
    </div>
  );
}

export function DataTableBlock({
  columns,
  rows,
  emptyMessage = sharedLibraryCopy.noRecordsMatchTheActiveOrganizationAndFilters,
}: {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyStateBlock
        title={sharedLibraryCopy.noRecords}
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="overflow-x-auto border-3 border-foreground bg-card shadow-[5px_5px_0px_hsl(var(--shadow-color))]">
      <table className="w-full min-w-2xl border-collapse text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b-3 border-foreground px-4 py-3 text-left text-xs font-black tracking-wider uppercase"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0">
              {columns.map((column, index) => {
                const value =
                  row.cells[column.key] ?? sharedLibraryCopy.separator2;
                return (
                  <td key={column.key} className="px-4 py-3 align-top">
                    {index === 0 && row.href ? (
                      <Link
                        className="font-bold underline-offset-4 hover:underline"
                        href={row.href}
                      >
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type DetailItem = {
  label: string;
  value: ReactNode;
};

export function RecordDetailBlock({
  title,
  status,
  items,
  children,
}: {
  title: string;
  status?: string;
  items: DetailItem[];
  children?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <CardTitle className="text-2xl uppercase">{title}</CardTitle>
        {status ? <Badge variant="outline">{status}</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="border-l-3 border-primary pl-3">
              <dt className="text-xs font-black tracking-wider text-muted-foreground uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
        {children}
      </CardContent>
    </Card>
  );
}

export type BoardColumn = {
  id: string;
  title: string;
  items: Array<{ id: string; title: string; detail?: string; href?: string }>;
};

export function KanbanBoardBlock({ columns }: { columns: BoardColumn[] }) {
  return (
    <section className="grid items-start gap-4 overflow-x-auto py-6 lg:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.id}
          className="min-w-64 border-3 border-foreground bg-muted/40 p-3"
        >
          <h2 className="mb-3 flex items-center justify-between text-sm font-black tracking-wider uppercase">
            {column.title}
            <Badge variant="outline">{column.items.length}</Badge>
          </h2>
          <div className="space-y-3">
            {column.items.map((item) => (
              <article
                key={item.id}
                className="border-2 border-foreground bg-card p-3 shadow-[3px_3px_0px_hsl(var(--shadow-color))]"
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="font-bold underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <h3 className="font-bold">{item.title}</h3>
                )}
                {item.detail ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.detail}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function TimelineBlock({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    timestamp: string;
    detail?: string;
  }>;
}) {
  return (
    <ol className="space-y-0 border-l-3 border-foreground pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative pb-7 last:pb-0">
          <span className="absolute top-1 -left-[1.95rem] size-3 border-2 border-foreground bg-primary" />
          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {item.timestamp}
          </p>
          <h3 className="font-black">{item.title}</h3>
          {item.detail ? (
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function SplitPaneBlock({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
      <div>{primary}</div>
      <aside>{secondary}</aside>
    </div>
  );
}

export function FileVaultBlock({
  files,
}: {
  files: Array<{ id: string; name: string; meta: string; href?: string }>;
}) {
  return (
    <DataTableBlock
      columns={[
        { key: "name", label: sharedLibraryCopy.file },
        { key: "meta", label: sharedLibraryCopy.details },
      ]}
      rows={files.map((file) => ({
        id: file.id,
        ...(file.href ? { href: file.href } : {}),
        cells: { name: file.name, meta: file.meta },
      }))}
      emptyMessage={sharedLibraryCopy.noFilesAreVisibleInThisWorkspace}
    />
  );
}

export function MediaLibraryBlock({
  items,
}: {
  items: Array<{ id: string; title: string; description?: string }>;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="aspect-video border-b-3 border-foreground bg-muted" />
          <CardContent className="pt-4">
            <h3 className="font-black">{item.title}</h3>
            {item.description ? (
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function ChatWorkspaceBlock({
  messages,
}: {
  messages: Array<{
    id: string;
    author: string;
    body: string;
    internal?: boolean;
  }>;
}) {
  return (
    <section className="space-y-3">
      {messages.map((message) => (
        <article
          key={message.id}
          className={cn(
            "max-w-3xl border-2 border-foreground p-4",
            message.internal ? "bg-warning/20" : "bg-card",
          )}
        >
          <p className="text-xs font-black tracking-wider uppercase">
            {message.author}
            {message.internal ? sharedLibraryCopy.internal : ""}
          </p>
          <p className="mt-2 whitespace-pre-wrap">{message.body}</p>
        </article>
      ))}
    </section>
  );
}

export function AuditLogBlock({
  events,
}: {
  events: Array<{
    id: string;
    action: string;
    resource: string;
    timestamp: string;
  }>;
}) {
  return (
    <TimelineBlock
      items={events.map((event) => ({
        id: event.id,
        title: event.action,
        detail: event.resource,
        timestamp: event.timestamp,
      }))}
    />
  );
}

export function EmptyStateBlock({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: PageHeaderAction;
}) {
  return (
    <section className="grid min-h-56 place-items-center border-3 border-dashed border-foreground p-8 text-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-xl font-black uppercase">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export type DashboardNavItem = {
  label: string;
  href?: string | undefined;
  active?: boolean;
};

export type DashboardStat = {
  label: string;
  value: string;
  trend?: string;
};

export type DashboardLayoutProps = {
  title: string;
  nav: readonly DashboardNavItem[];
  stats?: readonly DashboardStat[];
  toolbar?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function DashboardLayout({
  title,
  stats = [],
  toolbar,
  children,
  aside,
  className,
}: DashboardLayoutProps) {
  return (
    <section className={cn("dashboard-layout w-full bg-background", className)}>
      <div className="typeset typeset-app min-w-0 bg-background">
        <header className="dashboard-header grid min-h-14 gap-3 border-b border-foreground/30 px-4 py-4 md:flex md:justify-between">
          <h1 className="type-title text-foreground">{title}</h1>
          {toolbar}
        </header>

        <div className="space-y-4 p-4">
          {stats.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <DashboardStatCard key={stat.label} {...stat} />
              ))}
            </div>
          ) : null}
          {children}
        </div>
      </div>

      {aside && (
        <aside className="border-t border-foreground/30 bg-background p-4">
          {aside}
        </aside>
      )}
    </section>
  );
}

export function DashboardStatCard({ label, value, trend }: DashboardStat) {
  return (
    <Card className="p-4">
      <p className="type-caption tracking-wider text-muted-primary uppercase">
        {label}
      </p>
      <p className="mt-1 font-sans text-2xl font-bold text-foreground">
        {value}
      </p>
      {trend ? (
        <p className="mt-1 type-caption text-muted-primary">{trend}</p>
      ) : null}
    </Card>
  );
}

export function DashboardPanel({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card", className)}>
      {title ? (
        <h2 className="border-b border-foreground/20 px-4 py-3 type-label uppercase">
          {title}
        </h2>
      ) : null}
      <div className="p-3">{children}</div>
    </section>
  );
}

export type DashboardTableColumn = {
  key: string;
  label: string;
};

export type DashboardTableRow = {
  id: string;
  href?: string | undefined;
  cells: Record<string, ReactNode>;
};

export type CanonicalDashboardTemplateProps = {
  stats?: readonly DashboardStat[];
  columns?: readonly DashboardTableColumn[];
  rows?: readonly DashboardTableRow[];
  toolbar?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  chartValues?: readonly number[];
};

export function DashboardTable({
  columns,
  rows,
  emptyLabel = "No records available.",
}: {
  columns: readonly DashboardTableColumn[];
  rows: readonly DashboardTableRow[];
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-x-auto border border-foreground/30">
      <table className="w-full min-w-[36rem] border-collapse font-sans text-sm">
        <thead className="bg-primary/15 text-muted-primary">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-foreground/30 px-3 py-2 text-left tracking-wider uppercase"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-foreground/20 last:border-0"
              >
                {columns.map((column, index) => (
                  <td key={column.key} className="px-3 py-2 text-foreground">
                    {index === 0 && row.href ? (
                      <Link
                        className="text-foreground hover:underline"
                        href={row.href}
                      >
                        {row.cells[column.key] ?? sharedLibraryCopy.separator2}
                      </Link>
                    ) : (
                      (row.cells[column.key] ?? sharedLibraryCopy.separator2)
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-3 py-8 text-center text-muted-primary"
                colSpan={columns.length}
              >
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardBars({
  values,
  label,
}: {
  values: readonly number[];
  label: string;
}) {
  const maximum = Math.max(1, ...values);
  return (
    <div aria-label={label} className="flex h-40 items-end gap-2" role="img">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="min-h-1 flex-1 border border-muted-primary bg-primary"
          style={{ height: `${Math.max(4, (value / maximum) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardRailList({
  items,
}: {
  items: readonly { label: string; value?: string; meta?: string }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card
          variant="inset"
          key={`${item.label}-${item.value ?? ""}`}
          className="p-3"
        >
          <p className="type-label text-foreground">{item.label}</p>
          {item.value ? (
            <p className="mt-1 type-caption text-foreground">{item.value}</p>
          ) : null}
          {item.meta ? (
            <p className="mt-1 type-caption text-muted-primary">{item.meta}</p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

export function DataTableLoadingState({ rows = 6 }: { rows?: number }) {
  return (
    <div
      aria-label={sharedLibraryCopy.loadingRecords}
      role="status"
      className="space-y-3 border-3 border-foreground bg-card p-4"
    >
      <div className="h-11 animate-pulse bg-muted" />
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-3 border-t border-border pt-3"
        >
          <span className="h-5 animate-pulse bg-muted" />
          <span className="h-5 animate-pulse bg-muted" />
          <span className="h-5 animate-pulse bg-muted" />
          <span className="h-5 animate-pulse bg-muted" />
        </div>
      ))}
      <span className="sr-only">{sharedLibraryCopy.loadingRecords}</span>
    </div>
  );
}

export function RecordDetailLoadingState() {
  return (
    <div
      aria-label={sharedLibraryCopy.loadingRecord}
      role="status"
      className="space-y-6 border-3 border-foreground bg-card p-6"
    >
      <div className="h-8 w-2/3 animate-pulse bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-2 border-l-3 border-primary pl-3">
            <span className="block h-3 w-20 animate-pulse bg-muted" />
            <span className="block h-5 w-32 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
      <span className="sr-only">{sharedLibraryCopy.loadingRecord}</span>
    </div>
  );
}

const formWidths = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
} as const;

export function FormLoadingState({
  fields = 4,
  width = "3xl",
}: {
  fields?: number;
  width?: keyof typeof formWidths;
}) {
  return (
    <div
      aria-label={sharedLibraryCopy.loadingForm}
      role="status"
      className={cn("mx-auto space-y-5 surface-card p-5", formWidths[width])}
    >
      <div className="h-8 w-48 animate-pulse bg-muted" />
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="space-y-2">
          <span className="block h-4 w-28 animate-pulse bg-muted" />
          <span className="block h-10 animate-pulse bg-muted" />
        </div>
      ))}
      <div className="h-10 w-32 animate-pulse bg-muted" />
      <span className="sr-only">{sharedLibraryCopy.loadingForm}</span>
    </div>
  );
}

export function PageLoadingState({
  label = sharedLibraryCopy.loadingPage,
}: {
  label?: string;
}) {
  return (
    <div aria-label={label} role="status" className="space-y-6 p-4 md:p-6">
      <div className="h-10 w-64 bg-muted motion-safe:animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-24 bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
      <div className="h-80 bg-muted motion-safe:animate-pulse" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Shared placeholder for workspace pages: left rail, header, four stat
// cards, main panel and right rail.
export function WorkspaceLoadingState({ route }: { route: string }) {
  return (
    <div
      aria-label={sharedRemainingCopy.loading(route)}
      className="grid min-h-[42rem] animate-pulse border border-border lg:grid-cols-[11rem_minmax(0,1fr)_14rem]"
      role="status"
    >
      <Skeleton className="hidden rounded-none border-r border-border lg:block" />
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-52 rounded-none" />
        <div className="grid gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-20 rounded-none" key={index} />
          ))}
        </div>
        <Skeleton className="h-80 rounded-none" />
      </div>
      <Skeleton className="hidden rounded-none border-l border-border lg:block" />
      <span className="sr-only">{sharedLibraryCopy.loading}</span>
    </div>
  );
}
