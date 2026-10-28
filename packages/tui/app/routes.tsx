// Why: the screen registry: which page each screen id shows.
import type { ReactNode } from "react";

import { ChecksPage } from "@/app/checks/page";
import { DoctrinePage } from "@/app/doctrine/page";
import { ModulesPage } from "@/app/modules/page";
import { HomePage } from "@/app/page";
import type { ScreenId } from "@/lib/constants/screens";

export const routes: Record<ScreenId, () => ReactNode> = {
  home: () => <HomePage />,
  doctrine: () => <DoctrinePage />,
  modules: () => <ModulesPage />,
  checks: () => <ChecksPage />,
};
