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
  { label: "Campaigns", href: "/marketing/campaigns", active: false },
  { label: "Audiences", href: "/marketing/audiences", active: false },
  { label: "Analytics", href: "/marketing/analytics", active: false },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function MarketingAudienceDetailTemplate({
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
      title="Audience Detail"
      toolbar={toolbar}
    >
      <DashboardPanel title="Audience context">
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
