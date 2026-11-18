/** Browser installation state and event contract; account identity belongs to auth. */
export type PwaInstallProps = {
  canInstall: boolean;
  showIosInstructions: boolean;
  onInstall: () => void | Promise<void>;
  onDismiss: () => void | Promise<void>;
};

/** Browser-provided deferred installation event. */
export type PwaInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
