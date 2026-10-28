// Why: global terminal composition and navigation: number keys switch screens, q quits.
import { useApp, useInput } from "ink";
import { useState } from "react";

import { routes } from "@/app/routes";
import { ScreenTabs } from "@/components/nav/screen-tabs";
import { AppFrame } from "@/components/shells/app-frame";
import { type ScreenId, screens } from "@/lib/constants/screens";

export function RootLayout() {
  const [screen, setScreen] = useState<ScreenId>("home");
  const { exit } = useApp();
  useInput((input) => {
    if (input === "q") exit();
    const next = screens.find((item) => item.key === input);
    if (next) setScreen(next.id);
  });
  return (
    <AppFrame nav={<ScreenTabs items={screens} active={screen} />}>
      {routes[screen]()}
    </AppFrame>
  );
}
