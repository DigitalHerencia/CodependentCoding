import {
  DashboardBars,
  DashboardLayout,
  DashboardPanel,
  DashboardRailList,
  DashboardTable,
  type CanonicalDashboardTemplateProps,
} from "@/components/blocks/dashboard-layout";

const nav = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "Inbox", href: "/support/inbox", active: true },
  { label: "Knowledge", href: "/support/knowledge-base", active: false },
  { label: "Analytics", href: "/support/analytics", active: false },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function SupportInboxTemplate({
  stats = [],
  columns = defaultColumns,
  rows = [],
  toolbar,
  aside,
  children,
  chartValues,
}: CanonicalDashboardTemplateProps) {
  const labelKey = columns[0]?.key ?? "name";
  const valueKey = columns[1]?.key ?? "state";

  return (
    <DashboardLayout
      aside={
        aside ?? (
          <DashboardRailList
            items={rows.slice(0, 4).map((row) => ({
              label: String(row.cells[labelKey] ?? row.id),
              value: String(row.cells[valueKey] ?? ""),
            }))}
          />
        )
      }
      nav={nav}
      stats={stats}
      title="Support Inbox"
      toolbar={toolbar}
    >
      <DashboardPanel title="Ticket queue">
        <DashboardTable columns={columns} rows={rows} />
      </DashboardPanel>
      {chartValues?.length ? (
        <DashboardPanel title="Activity trend">
          <DashboardBars label="Activity trend" values={chartValues} />
        </DashboardPanel>
      ) : null}
      {children}
    </DashboardLayout>
  );
}
