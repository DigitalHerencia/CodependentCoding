import {
  DashboardBars,
  DashboardLayout,
  DashboardPanel,
  DashboardRailList,
  DashboardTable,
  type CanonicalDashboardTemplateProps,
} from "@/components/blocks/dashboard-layout";

const nav = [
  { label: "Pipeline", href: "/crm/pipeline", active: false },
  { label: "Contacts", href: "/crm/contacts", active: false },
  { label: "Accounts", href: "/crm/accounts", active: true },
  { label: "Analytics", href: "/crm/analytics", active: false },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function CrmAccountsTemplate({
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
      title="Accounts"
      toolbar={toolbar}
    >
      <DashboardPanel title="Account registry">
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
