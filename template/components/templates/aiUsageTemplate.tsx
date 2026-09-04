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
  { label: "Generation", href: "/ai", active: false },
  { label: "Playground", href: "/ai/playground", active: false },
  { label: "Usage", href: "/ai/usage", active: true },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function AiUsageTemplate({
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
      title="AI Usage"
      toolbar={toolbar}
    >
      <DashboardPanel title="Usage trend trend">
        <DashboardBars
          label="AI Usage trend"
          values={chartValues ?? [18, 28, 23, 42, 48, 66, 74]}
        />
      </DashboardPanel>
      <DashboardPanel title="Usage trend">
        <DashboardTable columns={columns} rows={rows} />
      </DashboardPanel>
      {children}
    </DashboardLayout>
  );
}
