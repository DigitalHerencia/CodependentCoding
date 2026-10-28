// Why: the screen registry: which page each screen id shows.
import type { ReactNode } from "react";

import { DoctrinePage } from "@/app/doctrine/page";
import { HomePage } from "@/app/page";
import type { ScreenId } from "@/lib/constants/screens";

export const routes: Record<ScreenId, () => ReactNode> = {
  home: () => <HomePage />,
  doctrine: () => <DoctrinePage />,
};
