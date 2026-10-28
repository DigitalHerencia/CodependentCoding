// Why: the screen registry: which page each screen id shows.
import type { ReactNode } from "react";

import { NewAppPage } from "@/app/apps/new/page";
import { AppsPage } from "@/app/apps/page";
import { ChecksPage } from "@/app/checks/page";
import { DoctrinePage } from "@/app/doctrine/page";
import { ModulesPage } from "@/app/modules/page";
import { SlicesPage } from "@/app/slices/page";
import { HomePage } from "@/app/page";
import { SettingsPage } from "@/app/settings/page";
import type { ScreenId } from "@/lib/constants/screens";

export const routes: Record<ScreenId, () => ReactNode> = {
  home: () => <HomePage />,
  doctrine: () => <DoctrinePage />,
  modules: () => <ModulesPage />,
  checks: () => <ChecksPage />,
  slices: () => <SlicesPage />,
  newApp: () => <NewAppPage />,
  apps: () => <AppsPage />,
  settings: () => <SettingsPage />,
};
