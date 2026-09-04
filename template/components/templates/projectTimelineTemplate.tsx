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
  { label: "Projects", href: "/projects", active: false },
  { label: "My Tasks", href: "/my-tasks", active: false },
  { label: "Timeline", href: "#timeline", active: true },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function ProjectTimelineTemplate({
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
      title="Project Timeline"
      toolbar={toolbar}
    >
      <DashboardPanel title="Milestone sequence trend">
        <DashboardBars
          label="Project Timeline trend"
          values={chartValues ?? [18, 28, 23, 42, 48, 66, 74]}
        />
      </DashboardPanel>
      <DashboardPanel title="Milestone sequence">
        <DashboardTable columns={columns} rows={rows} />
      </DashboardPanel>
      {children}
    </DashboardLayout>
  );
}
