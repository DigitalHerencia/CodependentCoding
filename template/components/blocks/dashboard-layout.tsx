import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export interface DashboardNavItem {
  label: string;
  href?: string | undefined;
  active?: boolean;
}

export interface DashboardStat {
  label: string;
  value: string;
  trend?: string;
}

export interface DashboardLayoutProps {
  title: string;
  nav: readonly DashboardNavItem[];
  stats?: readonly DashboardStat[];
  toolbar?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}

export function DashboardLayout({
  title,
  nav,
  stats = [],
  toolbar,
  children,
  aside,
  className,
}: DashboardLayoutProps) {
  return (
    <section
      className={cn(
        "grid min-h-[42rem] overflow-hidden border border-border bg-background lg:grid-cols-[11rem_minmax(0,1fr)_14rem]",
        className,
      )}
    >
      <aside className="hidden border-r border-border bg-[#080b0d] p-3 lg:block">
        <p className="mb-5 font-mono text-base font-black text-foreground">
          BoldKit
        </p>
        <nav aria-label={`${title} navigation`} className="space-y-1">
          {nav.map((item) => {
            const classes = cn(
              "block w-full border border-transparent px-3 py-2 text-left font-mono text-[0.7rem] text-foreground transition-colors",
              item.active
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-muted hover:bg-[#101518]",
            );

            return item.href ? (
              <Link
                key={item.label}
                aria-current={item.active ? "page" : undefined}
                className={classes}
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                aria-current={item.active ? "page" : undefined}
                className={classes}
              >
                {item.label}
              </span>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 bg-[#05070a]">
        <header className="flex min-h-14 items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h1 className="font-mono text-xl font-black tracking-tight text-foreground">
            {title}
          </h1>
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

      <aside className="hidden border-l border-border bg-[#05030b] p-3 lg:block">
        <div className="mb-3 border border-border px-3 py-2 font-mono text-[0.68rem] font-bold text-foreground">
          {title}
        </div>
        {aside ?? (
          <p className="font-mono text-[0.65rem] leading-relaxed text-[#9dc0c8]">
            Server state is authoritative. Controls in this rail expose only
            supported workflow state.
          </p>
        )}
      </aside>
    </section>
  );
}

export function DashboardStatCard({ label, value, trend }: DashboardStat) {
  return (
    <article className="border border-border bg-[#0b0f12] p-3">
      <p className="font-mono text-[0.6rem] uppercase tracking-wider text-[#9dc0c8]">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-black text-foreground">
        {value}
      </p>
      {trend ? (
        <p className="mt-1 font-mono text-[0.58rem] text-[#8cb9c3]">{trend}</p>
      ) : null}
    </article>
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
    <section className={cn("border border-border bg-[#0b0f12]", className)}>
      {title ? (
        <h2 className="border-b border-border px-3 py-2 font-mono text-[0.68rem] font-black uppercase tracking-wider text-foreground">
          {title}
        </h2>
      ) : null}
      <div className="p-3">{children}</div>
    </section>
  );
}

export interface DashboardTableColumn {
  key: string;
  label: string;
}

export interface DashboardTableRow {
  id: string;
  href?: string | undefined;
  cells: Record<string, ReactNode>;
}

export interface CanonicalDashboardTemplateProps {
  stats?: readonly DashboardStat[];
  columns?: readonly DashboardTableColumn[];
  rows?: readonly DashboardTableRow[];
  toolbar?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  chartValues?: readonly number[];
}

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
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[36rem] border-collapse font-mono text-[0.64rem]">
        <thead className="bg-[#101518] text-[#9dc0c8]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-border px-3 py-2 text-left uppercase tracking-wider"
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
                className="border-b border-[#314047] last:border-0"
              >
                {columns.map((column, index) => (
                  <td key={column.key} className="px-3 py-2 text-foreground">
                    {index === 0 && row.href ? (
                      <Link
                        className="text-[#8ec6d3] hover:underline"
                        href={row.href}
                      >
                        {row.cells[column.key] ?? "—"}
                      </Link>
                    ) : (
                      (row.cells[column.key] ?? "—")
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-3 py-8 text-center text-[#9dc0c8]"
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
          className="min-h-1 flex-1 border border-[#8ec6d3] bg-primary"
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
        <article
          key={`${item.label}-${item.value ?? ""}`}
          className="border border-[#5b737a] p-2"
        >
          <p className="font-mono text-[0.62rem] font-bold text-foreground">
            {item.label}
          </p>
          {item.value ? (
            <p className="mt-1 font-mono text-[0.58rem] text-[#8ec6d3]">
              {item.value}
            </p>
          ) : null}
          {item.meta ? (
            <p className="mt-1 font-mono text-[0.55rem] text-[#9dc0c8]">
              {item.meta}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
