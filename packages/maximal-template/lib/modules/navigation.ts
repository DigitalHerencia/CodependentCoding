/** Settings and tenant navigation contributed by installed domain modules. */
import { installedModules } from "@/lib/modules/registry";
import type {
  ModuleDefinition,
  ModuleNav,
  ModuleNavLink,
} from "@/types/moduleTypes";

const baseSettings: readonly ModuleNavLink[] = [
  { label: "Integrations", href: "/settings/integrations" },
];

/** Sidebar groups contributed by modules, in registry order. */
export function moduleNavigation(
  modules: readonly ModuleDefinition[] = installedModules,
): readonly (ModuleNav & { id: string })[] {
  return modules.flatMap(({ id, nav }) => (nav ? [{ id, ...nav }] : []));
}

/** Base settings links followed by each installed domain's settings links. */
export function settingsNavigation(
  modules: readonly ModuleDefinition[] = installedModules,
): readonly ModuleNavLink[] {
  return [
    ...baseSettings,
    ...modules.flatMap(({ settings }) => settings ?? []),
  ];
}
