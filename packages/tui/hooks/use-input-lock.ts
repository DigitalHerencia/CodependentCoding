// Why: lets a screen that takes typing turn off the single-key shortcuts while it is shown.
import { createContext, useContext, useEffect } from "react";

export const InputLockContext = createContext<{ lock: () => () => void }>({
  lock: () => () => undefined,
});

export function useInputLock(active = true): void {
  const { lock } = useContext(InputLockContext);
  useEffect(() => (active ? lock() : undefined), [active, lock]);
}
