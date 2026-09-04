import { SettingsSurface } from "@/components/blocks/settings-page";
import {
  DashboardLayout,
  DashboardRailList,
  DashboardTable,
  type CanonicalDashboardTemplateProps,
} from "@/components/blocks/dashboard-layout";

const nav = [
  { label: "Profile", href: "/settings/profile", active: false },
  { label: "Members", href: "/settings/members", active: false },
  { label: "Integrations", href: "/settings/integrations", active: false },
  { label: "Billing", href: "/settings/billing", active: true },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function SharedBillingSettingsTemplate({
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
      title="Billing Settings"
      toolbar={toolbar}
    >
      <SettingsSurface
        description="Tenant billing configuration uses server-authoritative values and explicit workflow-backed actions."
        title="Billing Settings"
      >
        <DashboardTable columns={columns} rows={rows} />
      </SettingsSurface>
      {children}
    </DashboardLayout>
  );
}
