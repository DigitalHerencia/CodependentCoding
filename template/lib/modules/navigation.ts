import { installedModules } from "@/lib/modules/registry";
import type {
  ModuleDefinition,
  ModuleNav,
  ModuleNavLink,
} from "@/types/moduleTypes";

const baseSettings: readonly ModuleNavLink[] = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Members", href: "/settings/members" },
  { label: "Integrations", href: "/settings/integrations" },
];

/** Sidebar groups contributed by modules, in registry order. */
export function moduleNavigation(
  modules: readonly ModuleDefinition[] = installedModules,
): readonly (ModuleNav & { id: string })[] {
  return modules.flatMap(({ id, nav }) => (nav ? [{ id, ...nav }] : []));
}

/** Base settings links, then module settings links, then workspace setup. */
export function settingsNavigation(
  modules: readonly ModuleDefinition[] = installedModules,
): readonly ModuleNavLink[] {
  return [
    ...baseSettings,
    ...modules.flatMap(({ settings }) => settings ?? []),
    { label: "Workspace setup", href: "/onboarding" },
  ];
}
