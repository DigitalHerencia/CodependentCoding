import {
  DashboardLayout,
  DashboardPanel,
  DashboardRailList,
  DashboardTable,
  type CanonicalDashboardTemplateProps,
} from "@/components/blocks/dashboard-layout";

const nav = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Projects", href: "/projects", active: false },
  { label: "Invoices", href: "/invoices", active: false },
  { label: "Support", href: "/support/inbox", active: false },
  { label: "Settings", href: "/settings/profile", active: false },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function SharedDashboardTemplate({
  stats = [],
  columns = defaultColumns,
  rows = [],
  toolbar,
  aside,
  children,
}: CanonicalDashboardTemplateProps) {
  return (
    <DashboardLayout
      aside={
        aside ?? (
          <DashboardRailList
            items={rows.slice(0, 4).map((row) => ({
              label: String(row.cells[columns[0]?.key ?? "name"] ?? row.id),
              value: String(row.cells[columns[1]?.key ?? "state"] ?? ""),
            }))}
          />
        )
      }
      nav={nav}
      stats={stats}
      title="Tenant Dashboard"
      toolbar={toolbar}
    >
      <DashboardPanel title="Recent activity">
        <DashboardTable columns={columns} rows={rows} />
      </DashboardPanel>
      {children}
    </DashboardLayout>
  );
}
