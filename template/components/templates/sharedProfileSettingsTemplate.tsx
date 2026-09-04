import { SettingsSurface } from "@/components/blocks/settings-page";
import {
  DashboardLayout,
  DashboardRailList,
  DashboardTable,
  type CanonicalDashboardTemplateProps,
} from "@/components/blocks/dashboard-layout";

const nav = [
  { label: "Profile", href: "/settings/profile", active: true },
  { label: "Members", href: "/settings/members", active: false },
  { label: "Integrations", href: "/settings/integrations", active: false },
  { label: "Billing", href: "/settings/billing", active: false },
] as const;

const defaultColumns = [
  { key: "name", label: "Name" },
  { key: "state", label: "State" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
] as const;

export function SharedProfileSettingsTemplate({
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
      title="Profile Settings"
      toolbar={toolbar}
    >
      <SettingsSurface
        description="Profile and appearance uses server-authoritative values and explicit workflow-backed actions."
        title="Profile Settings"
      >
        <DashboardTable columns={columns} rows={rows} />
      </SettingsSurface>
      {children}
    </DashboardLayout>
  );
}
