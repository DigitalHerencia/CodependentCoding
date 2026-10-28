// Why: global terminal composition and navigation: number keys switch screens, esc goes home, q quits.
import { useApp, useInput } from "ink";
import { useCallback, useMemo, useState } from "react";

import { routes } from "@/app/routes";
import { ScreenTabs } from "@/components/nav/screen-tabs";
import { AppFrame } from "@/components/shells/app-frame";
import { InputLockContext } from "@/hooks/use-input-lock";
import { type ScreenId, screens } from "@/lib/constants/screens";

export function RootLayout() {
  const [screen, setScreen] = useState<ScreenId>("home");
  const [locks, setLocks] = useState(0);
  const { exit } = useApp();
  const lock = useCallback(() => {
    setLocks((count) => count + 1);
    return () => setLocks((count) => count - 1);
  }, []);
  const inputLock = useMemo(() => ({ lock }), [lock]);
  useInput((input, key) => {
    if (key.escape) return setScreen("home");
    // While a screen takes typing, letters and digits belong to it.
    if (locks > 0) return;
    if (input === "q") exit();
    const next = screens.find((item) => item.key === input);
    if (next) setScreen(next.id);
  });
  return (
    <InputLockContext.Provider value={inputLock}>
      <AppFrame nav={<ScreenTabs items={screens} active={screen} />}>
        {routes[screen]()}
      </AppFrame>
    </InputLockContext.Provider>
  );
}
